
import { useState, useEffect } from "react";
import DashboardSummary from "../components/dashboard/dashboardSummary";
import QuestionCard from "../components/dashboard/questionCard";
import api from "../api";

function Dashboard() {

    const [questions, setQuestions] = useState([]);
    useEffect(() => {
    const fetchQuestions = async () => {
        try {
            const response = await api.get("/questions");
            setQuestions(response.data.questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    fetchQuestions();
}, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            <DashboardSummary />

            {questions.map((question) => (
                <QuestionCard
                    key={question._id}
                    question={question}
                />
            ))}

        </div>
    );
}

export default Dashboard;
