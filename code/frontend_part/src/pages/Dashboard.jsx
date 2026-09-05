import DashboardSummary from "../components/dashboard/dashboardSummary";
import QuestionCard from "../components/dashboard/questionCard";

function Dashboard() {

    const questions = [
        {
            id: 1,
            title: "Two Sum",
            topic: "Arrays > Hashing",
            difficulty: "Easy",
            confidence: 3,
            lastRevised: "02 Sep 2026",
        },
        {
            id: 2,
            title: "Merge Intervals",
            topic: "Arrays",
            difficulty: "Medium",
            confidence: 2,
            lastRevised: "31 Aug 2026",
        },
        {
            id: 3,
            title: "LCA in BST",
            topic: "BST",
            difficulty: "Medium",
            confidence: 4,
            lastRevised: "01 Sep 2026",
        },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            <DashboardSummary />

            {questions.map((question) => (
                <QuestionCard
                    key={question.id}
                    question={question}
                />
            ))}

        </div>
    );
}

export default Dashboard;