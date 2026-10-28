
import { useEffect, useState } from "react";
import api from "../../api";

function DashboardSummary() {
    const [questions, setQuestions] = useState([]);
    const [completedIds, setCompletedIds] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await api.get("/dashboard");

                const dashboardData = response.data;

                setQuestions(dashboardData.questions || []);

                setCompletedIds(
                    (dashboardData.questions || [])
                        .filter((question) => question.lastRevised)
                        .map((question) => question._id)
                );
            } catch (error) {
                console.error("Error loading dashboard:", error);
            }
        };

        loadDashboard();
    }, []);

    const allocated = questions.length;

    const completed = questions.filter((question) =>
        completedIds.includes(question._id)
    ).length;

    const progress =
        allocated === 0
            ? 0
            : Math.round((completed / allocated) * 100);

    return (
        <div>
            <div className="summary-card">
                <div className="summary-header">
                    <h1 className="summary-title">
                        Today's Revision Summary
                    </h1>

                    <span className="summary-date">
                        {new Date().toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>

                <div className="summary-stats">
                    <div className="stat-box">
                        <p className="stat-label">ALLOCATED</p>
                        <p className="stat-value">{allocated}</p>
                    </div>

                    <div className="stat-box">
                        <p className="stat-label">COMPLETED</p>
                        <p className="stat-value">{completed}</p>
                    </div>

                    <div className="stat-box">
                        <p className="stat-label">PROGRESS</p>
                        <p className="stat-value">{progress}%</p>
                    </div>
                </div>

                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
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
                        Add some questions to see your recommendations here.
                    </p>
                </div>
            )}
        </div>
    );
}

export default DashboardSummary;
