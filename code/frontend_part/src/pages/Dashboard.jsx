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

function Dashboard() {
    const [questions, setQuestions] = useState([]);
    const [completedQuestions, setCompletedQuestions] = useState(new Set());

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.get("/questions");

                const updates = JSON.parse(
                    localStorage.getItem("algoRecallQuestionUpdates") || "{}"
                );

                const fetchedQuestions = response.data.questions.map(
                    (question) => ({
                        ...question,
                        ...(updates[question._id] || {}),
                    })
                );

                setQuestions(fetchedQuestions);

                const today = getTodayDate();

                setCompletedQuestions(
                    new Set(
                        fetchedQuestions
                            .filter(
                                (question) =>
                                    question.lastRevisionDate === today
                            )
                            .map((question) => question._id)
                    )
                );
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    const handleRevision = (question, confidence, notes) => {
        const revisionDate = getTodayDate();

        const revision = {
            id: `${question._id}-${Date.now()}`,
            questionId: question._id,
            title: question.title,
            topic: question.topic,
            dateSolved: question.dateSolved,
            previousRevisionDate:
                question.lastRevisionDate || question.dateSolved,
            revisionDate,
            previousConfidence: question.confidence ?? 3,
            updatedConfidence: confidence,
            notes,
        };

        const revisionHistory = JSON.parse(
            localStorage.getItem("algoRecallRevisionHistory") || "[]"
        );

        localStorage.setItem(
            "algoRecallRevisionHistory",
            JSON.stringify([revision, ...revisionHistory])
        );

        const updatedQuestion = {
            confidence,
            notes,
            lastRevisionDate: revisionDate,
        };

        const updates = JSON.parse(
            localStorage.getItem("algoRecallQuestionUpdates") || "{}"
        );

        updates[question._id] = {
            ...(updates[question._id] || {}),
            ...updatedQuestion,
        };

        localStorage.setItem(
            "algoRecallQuestionUpdates",
            JSON.stringify(updates)
        );

        setQuestions((previousQuestions) =>
            previousQuestions.map((item) =>
                item._id === question._id
                    ? { ...item, ...updatedQuestion }
                    : item
            )
        );

        setCompletedQuestions((previous) => {
            const updated = new Set(previous);
            updated.add(question._id);
            return updated;
        });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <DashboardSummary />

            {questions.map((question) => (
                <QuestionCard
                    key={question._id}
                    question={question}
                    isCompleted={completedQuestions.has(question._id)}
                    onRevised={handleRevision}
                />
            ))}
        </div>
    );
}

export default Dashboard;