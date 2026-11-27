import { useState, useEffect } from "react";
import DashboardSummary from "../components/dashboard/dashboardSummary";
import QuestionCard from "../components/dashboard/questionCard";
import api from "../api";

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

function Dashboard() {
    const [questions, setQuestions] = useState([]);
    const [completedQuestions, setCompletedQuestions] = useState(new Set());

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const dailyTarget =
                    Number(
                        localStorage.getItem("algoRecallDailyTarget")
                    ) || 3;

                const today = getTodayDate();

                const savedQueueDate =
                    localStorage.getItem("algoRecallQueueDate");

                const savedQueueTarget =
                    Number(
                        localStorage.getItem("algoRecallQueueTarget")
                    ) || 0;

                const savedQueue =
                    localStorage.getItem("algoRecallDailyQueue");

                if (
                    savedQueueDate === today &&
                    savedQueueTarget === dailyTarget &&
                    savedQueue
                ) {
                    const savedQuestions =
                        JSON.parse(savedQueue);

                    setQuestions(savedQuestions);

                    setCompletedQuestions(
                        new Set(
                            savedQuestions
                                .filter((question) =>
                                    isRevisedToday(
                                        question.lastRevised
                                    )
                                )
                                .map((question) => question._id)
                        )
                    );

                    return;
                }

                const response = await api.get(
                    `/dashboard/due-today?limit=${dailyTarget}`
                );

                const fetchedQuestions =
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
                    JSON.stringify(fetchedQuestions)
                );

                setQuestions(fetchedQuestions);

                setCompletedQuestions(
                    new Set(
                        fetchedQuestions
                            .filter((question) =>
                                isRevisedToday(
                                    question.lastRevised
                                )
                            )
                            .map((question) => question._id)
                    )
                );
            } catch (error) {
                console.error(
                    "Error fetching questions:",
                    error
                );
            }
        };

        fetchQuestions();
    }, []);

    const handleRevision = async (
        question,
        confidence,
        notes
    ) => {
        try {
            const response = await api.post(
                `/revisions/${question._id}`,
                {
                    confidence,
                    notes,
                }
            );

            const updatedQuestion =
                response.data.question;

            setQuestions((previousQuestions) => {
                const updatedQuestions =
                    previousQuestions.map((item) =>
                        item._id === question._id
                            ? updatedQuestion
                            : item
                    );

                localStorage.setItem(
                    "algoRecallDailyQueue",
                    JSON.stringify(updatedQuestions)
                );

                return updatedQuestions;
            });

            setCompletedQuestions((previous) => {
                const updated = new Set(previous);

                updated.add(question._id);

                return updated;
            });
        } catch (error) {
            console.error(
                "Error recording revision:",
                error
            );
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <DashboardSummary />

            {questions.map((question) => (
                <QuestionCard
                    key={question._id}
                    question={question}
                    isCompleted={completedQuestions.has(
                        question._id
                    )}
                    onRevised={handleRevision}
                />
            ))}
        </div>
    );
}

export default Dashboard;
