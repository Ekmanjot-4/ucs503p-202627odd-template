import { useEffect, useState } from "react";
import api from "../../api";

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function isRevisedToday(date) {
    if (!date) return false;

    const revised = new Date(date);
    const today = new Date();

    return (
        revised.getFullYear() === today.getFullYear() &&
        revised.getMonth() === today.getMonth() &&
        revised.getDate() === today.getDate()
    );
}

function DashboardSummary() {
    const [questions, setQuestions] = useState([]);
    const [completed, setCompleted] = useState(0);
    const [allocated, setAllocated] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const dailyTarget =
                    Number(
                        localStorage.getItem(
                            "algoRecallDailyTarget"
                        )
                    ) || 3;

                const today = getTodayDate();

                let savedQueueDate =
                    localStorage.getItem(
                        "algoRecallQueueDate"
                    );

                let savedQueueTarget =
                    Number(
                        localStorage.getItem(
                            "algoRecallQueueTarget"
                        )
                    ) || 0;

                let savedQueue =
                    localStorage.getItem(
                        "algoRecallDailyQueue"
                    );

                let queue = [];

                /*
                 * Use today's saved queue if it exists
                 * and the target has not changed.
                 */
                if (
                    savedQueueDate === today &&
                    savedQueueTarget === dailyTarget &&
                    savedQueue
                ) {
                    queue = JSON.parse(savedQueue);
                } else {
                    /*
                     * Target changed or there is no queue
                     * for today. Create a new queue.
                     */
                    const response = await api.get(
                        `/dashboard/due-today?limit=${dailyTarget}`
                    );

                    queue =
                        response.data.questions || [];

                    localStorage.setItem(
                        "algoRecallQueueDate",
                        today
                    );

                    localStorage.setItem(
                        "algoRecallQueueTarget",
                        String(dailyTarget)
                    );

                    localStorage.setItem(
                        "algoRecallDailyQueue",
                        JSON.stringify(queue)
                    );
                }

                const allocatedCount = Math.min(
                    queue.length,
                    dailyTarget
                );

                const completedCount = queue.filter(
                    (question) =>
                        isRevisedToday(
                            question.lastRevised
                        )
                ).length;

                const progressValue =
                    allocatedCount === 0
                        ? 0
                        : Math.min(
                              100,
                              Number(
                                  (
                                      (completedCount /
                                          allocatedCount) *
                                      100
                                  ).toFixed(1)
                              )
                          );

                setQuestions(queue);
                setAllocated(allocatedCount);
                setCompleted(completedCount);
                setProgress(progressValue);
            } catch (error) {
                console.error(
                    "Error loading dashboard:",
                    error
                );
            }
        };

        loadDashboard();
    }, []);

    return (
        <div>
            <div className="summary-card">
                <div className="summary-header">
                    <h1 className="summary-title">
                        Today's Revision Summary
                    </h1>

                    <span className="summary-date">
                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }
                        )}
                    </span>
                </div>

                <div className="summary-stats">
                    <div className="stat-box">
                        <p className="stat-label">
                            ALLOCATED
                        </p>

                        <p className="stat-value">
                            {allocated}
                        </p>
                    </div>

                    <div className="stat-box">
                        <p className="stat-label">
                            COMPLETED
                        </p>

                        <p className="stat-value">
                            {completed}
                        </p>
                    </div>

                    <div className="stat-box">
                        <p className="stat-label">
                            PROGRESS
                        </p>

                        <p className="stat-value">
                            {progress}%
                        </p>
                    </div>
                </div>

                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            <h2 className="recommendations-title">
                Today's Recommendations
            </h2>

            {questions.length === 0 && (
                <div className="recommendations-card">
                    <h3>No questions available</h3>

                    <p>
                        Add some questions to see your
                        recommendations here.
                    </p>
                </div>
            )}
        </div>
    );
}

export default DashboardSummary;