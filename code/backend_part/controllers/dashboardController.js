const Question = require("../models/Question");
const RevisionHistory = require("../models/RevisionHistory");
const {
  calculatePriority
} = require("../services/schedulingService");

function startOfDay(date = new Date()) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date = new Date()) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

async function getDueToday(req, res, next) {
  try {
    const now = new Date();

    const dailyTarget = Math.max(
      1,
      Number(req.query.limit) || 3
    );

    // Get all questions belonging to the current user
    const allQuestions = await Question.find({
      userId: req.userId
    });

    // Get all revisions made by the user today
    const todayHistory = await RevisionHistory.find({
      userId: req.userId,
      revisedAt: {
        $gte: startOfDay(now),
        $lte: endOfDay(now)
      }
    });

    // IDs of questions already revised today
    const revisedTodayIds = new Set(
      todayHistory.map((revision) =>
        revision.questionId.toString()
      )
    );

    /*
     * STEP 1:
     * Find questions that are actually due according to
     * the spaced-repetition schedule.
     *
     * Questions revised today are excluded because they
     * should not be recommended again today.
     */
    const dueQuestions = allQuestions
      .filter(
        (question) =>
          question.nextRevision &&
          new Date(question.nextRevision) <= endOfDay(now) &&
          !revisedTodayIds.has(question._id.toString())
      )
      .map((question) => ({
        ...question.toObject(),
        priority: calculatePriority(question, now)
      }))
      .sort((a, b) => b.priority - a.priority);

    /*
     * STEP 2:
     * Find questions that are NOT due yet.
     *
     * These are fallback questions. They are used only when
     * there are not enough due questions to fill the user's
     * daily target.
     */
    const notDueQuestions = allQuestions
      .filter(
        (question) =>
          (!question.nextRevision ||
            new Date(question.nextRevision) > endOfDay(now)) &&
          !revisedTodayIds.has(question._id.toString())
      )
      .map((question) => ({
        ...question.toObject(),
        priority: calculatePriority(question, now)
      }))
      .sort((a, b) => b.priority - a.priority);

    /*
     * STEP 3:
     * Take the highest-priority due questions first.
     */
    const dueSelection = dueQuestions.slice(
      0,
      dailyTarget
    );

    /*
     * STEP 4:
     * If there aren't enough due questions,
     * fill the remaining slots with high-priority
     * questions that are not due yet.
     */
    const remainingSlots =
      dailyTarget - dueSelection.length;

    const fallbackSelection = notDueQuestions.slice(
      0,
      Math.max(0, remainingSlots)
    );

    const newRecommendations = [
      ...dueSelection,
      ...fallbackSelection
    ];

    /*
     * STEP 5:
     * Keep questions already revised today visible
     * on the dashboard.
     */
    const revisedToday = allQuestions
      .filter((question) =>
        revisedTodayIds.has(question._id.toString())
      )
      .map((question) => ({
        ...question.toObject(),
        priority: calculatePriority(question, now)
      }));

    /*
     * Keep today's revised questions + today's
     * recommendations on the dashboard.
     */
    const questions = [
      ...revisedToday,
      ...newRecommendations
    ].slice(0, dailyTarget);

    const completed = Math.min(
      todayHistory.length,
      dailyTarget
    );

    const allocated = Math.min(
      allQuestions.length,
      dailyTarget
    );

    res.json({
      allocated,
      completed,
      remaining: Math.max(
        0,
        allocated - completed
      ),
      progress:
        allocated === 0
          ? 0
          : Number(
              ((completed / allocated) * 100).toFixed(1)
            ),
      questions
    });
  } catch (error) {
    next(error);
  }
}

async function getRecommendation(req, res, next) {
  try {
    const now = new Date();

    const questions = await Question.find({
      userId: req.userId,
      nextRevision: { $lte: endOfDay(now) }
    });

    if (questions.length === 0) {
      return res.json({
        recommendation: null,
        message: "No questions are due for revision today."
      });
    }

    const ranked = questions
      .map((question) => ({
        question,
        priority: calculatePriority(question, now)
      }))
      .sort((a, b) => b.priority - a.priority);

    const recommendation = ranked[0].question.toObject();

    recommendation.priority =
      ranked[0].priority;

    res.json({ recommendation });
  } catch (error) {
    next(error);
  }
}

async function getAnalytics(req, res, next) {
  try {
    const [questions, history] = await Promise.all([
      Question.find({ userId: req.userId }),
      RevisionHistory.find({ userId: req.userId })
    ]);

    const totalQuestions = questions.length;
    const totalRevisions = history.length;

    const confidenceDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    const difficultyDistribution = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };

    const topicMap = {};

    for (const question of questions) {
      confidenceDistribution[question.confidence] += 1;
      difficultyDistribution[question.difficulty] += 1;

      if (!topicMap[question.topic]) {
        topicMap[question.topic] = {
          topic: question.topic,
          questions: 0,
          revisions: 0,
          confidenceTotal: 0
        };
      }

      topicMap[question.topic].questions += 1;
      topicMap[question.topic].confidenceTotal +=
        question.confidence;
    }

    for (const revision of history) {
      const question = questions.find(
        (q) =>
          q._id.toString() ===
          revision.questionId.toString()
      );

      if (
        question &&
        topicMap[question.topic]
      ) {
        topicMap[question.topic].revisions += 1;
      }
    }

    const topicPerformance =
      Object.values(topicMap).map((item) => ({
        ...item,
        averageConfidence:
          item.questions === 0
            ? 0
            : Number(
                (
                  item.confidenceTotal /
                  item.questions
                ).toFixed(2)
              )
      }));

    res.json({
      summary: {
        totalQuestions,
        totalRevisions,
        averageConfidence:
          totalQuestions === 0
            ? 0
            : Number(
                (
                  questions.reduce(
                    (sum, q) =>
                      sum + q.confidence,
                    0
                  ) / totalQuestions
                ).toFixed(2)
              )
      },
      confidenceDistribution,
      difficultyDistribution,
      topicPerformance
    });
  } catch (error) {
    next(error);
  }
}

async function getHeatmap(req, res, next) {
  try {
    const history = await RevisionHistory.find({
      userId: req.userId
    }).select("revisedAt");

    const heatmap = {};

    for (const item of history) {
      const key = new Date(item.revisedAt)
        .toISOString()
        .slice(0, 10);

      heatmap[key] =
        (heatmap[key] || 0) + 1;
    }

    res.json({ heatmap });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDueToday,
  getRecommendation,
  getAnalytics,
  getHeatmap
};