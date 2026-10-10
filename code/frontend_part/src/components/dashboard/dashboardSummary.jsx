import { useEffect, useState } from "react";
import QuestionCard from "./questionCard";

function DashboardSummary() {
    const [questions, setQuestions] = useState([]);
    const [completedIds, setCompletedIds] = useState([]);
    const [dailyTarget, setDailyTarget] = useState(() => {
        return Number(localStorage.getItem("algoRecallDailyTarget")) || 3;
    });

    const getToday = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const statusKey = `algoRecallRevisionStatus-${getToday()}`;

    useEffect(() => {
        const loadQuestions = () => {
            const savedQuestions = JSON.parse(
                localStorage.getItem("algoRecallQuestions") || "[]"
            );

            const target = Number(
                localStorage.getItem("algoRecallDailyTarget")
            ) || 3;

            setDailyTarget(target);
            setQuestions(savedQuestions.slice(0, target));
        };

        const loadCompleted = () => {
            const savedStatus = JSON.parse(
                localStorage.getItem(statusKey) || "[]"
            );

            setCompletedIds(savedStatus);
        };

        loadQuestions();
        loadCompleted();

        window.addEventListener("storage", loadQuestions);
        window.addEventListener("storage", loadCompleted);

        window.addEventListener("focus", loadQuestions);

        return () => {
            window.removeEventListener("storage", loadQuestions);
            window.removeEventListener("storage", loadCompleted);
            window.removeEventListener("focus", loadQuestions);
        };
    }, [statusKey]);

    const handleRevision = (question, confidence, notes) => {
        try {
            const savedQuestions = JSON.parse(
                localStorage.getItem("algoRecallQuestions") || "[]"
            );

            const currentQuestion = savedQuestions.find(
                (item) => item.id === question.id
            );

            if (!currentQuestion) {
                throw new Error("Question not found in localStorage.");
            }

            const revisionDate = getToday();

            const revision = {
                id: `${question.id}-${Date.now()}`,
                questionId: question.id,
                title: currentQuestion.title,
                topic: currentQuestion.topic,
                dateSolved: currentQuestion.dateSolved,
                previousRevisionDate: currentQuestion.lastRevised
                    ? currentQuestion.lastRevised.slice(0, 10)
                    : currentQuestion.dateSolved,
                revisionDate,
                previousConfidence: currentQuestion.confidence ?? 3,
                updatedConfidence: confidence,
                notes,
            };

            const updatedQuestions = savedQuestions.map((item) =>
                item.id === question.id
                    ? {
                        ...item,
                        confidence,
                        notes,
                        lastRevised: new Date().toISOString(),
                    }
                    : item
            );

            localStorage.setItem(
                "algoRecallQuestions",
                JSON.stringify(updatedQuestions)
            );

            const revisionHistory = JSON.parse(
                localStorage.getItem("algoRecallRevisionHistory") || "[]"
            );

            localStorage.setItem(
                "algoRecallRevisionHistory",
                JSON.stringify([revision, ...revisionHistory])
            );

            const savedStatus = JSON.parse(
                localStorage.getItem(statusKey) || "[]"
            );

            const updatedStatus = savedStatus.includes(question.id)
                ? savedStatus
                : [...savedStatus, question.id];

            localStorage.setItem(
                statusKey,
                JSON.stringify(updatedStatus)
            );

            const target = Number(
                localStorage.getItem("algoRecallDailyTarget")
            ) || 3;

            setDailyTarget(target);
            setQuestions(updatedQuestions.slice(0, target));
            setCompletedIds(updatedStatus);
        } catch (error) {
            console.error("Error saving revision:", error);
            alert("Unable to save revision. Please try again.");
        }
    };

    const allocated = questions.length;
    const completed = questions.filter(
        (question) => completedIds.includes(question.id)
    ).length;

    const progress = allocated === 0
        ? 0
        : Math.round((completed / allocated) * 100);

    return (
        <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h1 className="text-2xl font-bold mb-4">
                    Today's Revision Queue
                </h1>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Allocated</p>
                        <p className="text-3xl font-bold">{allocated}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="text-3xl font-bold">{completed}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Progress</p>
                        <p className="text-3xl font-bold">{progress}%</p>
                    </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-5">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">
                Today's Recommendations
            </h2>

            {questions.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">
                        No questions available
                    </h3>
                    <p className="text-gray-500 mt-2">
                        Add some questions to see your recommendations here.
                    </p>
                </div>
            ) : (
                questions.map((question) => (
                    <QuestionCard
                        key={question.id}
                        question={question}
                        isCompleted={completedIds.includes(question.id)}
                        onRevised={handleRevision}
                    />
                ))
            )}
        </div>
    );
}

export default DashboardSummary;