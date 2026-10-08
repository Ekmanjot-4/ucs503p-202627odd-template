import { useState } from "react";
import api from "../../api";
function QuestionCard({ question }) {
    const [confidence, setConfidence] = useState(question.confidence);
    const handleRevision = async () => {
    try {
        const response = await api.post(`/revisions/${question._id}`, {
            confidence: confidence,
        });

        console.log("Revision recorded:", response.data);
    } catch (error) {
        console.error("Error recording revision:", error);
    }
};
    
    return (
        <div className="bg-white rounded-lg shadow p-5 mb-4">

            <div className="flex justify-between items-start">

                <div>
                    <h2 className="text-xl font-semibold">
                        {question.title}
                    </h2>

                    <p className="text-gray-500">
                        {question.topic}
                    </p>

                    <div className="flex gap-6 mt-3 text-sm text-gray-600">
                        <span>{question.difficulty}</span>
                        <span>Confidence {question.confidence}/5</span>
                        <select
    value={confidence}
    onChange={(e) => setConfidence(Number(e.target.value))}
    className="border rounded px-2 py-1"
>
    <option value={1}>1</option>
    <option value={2}>2</option>
    <option value={3}>3</option>
    <option value={4}>4</option>
    <option value={5}>5</option>
</select>
                        <span>
    {question.lastRevised
        ? new Date(question.lastRevised).toLocaleDateString()
        : "Not revised yet"}
</span>
                    </div>
                </div>

                <button 
                onClick={handleRevision}
                className="bg-blue-600 text-white px-3 py-1 rounded-md">
                    R
                </button>

            </div>

        </div>
    );
}

export default QuestionCard;