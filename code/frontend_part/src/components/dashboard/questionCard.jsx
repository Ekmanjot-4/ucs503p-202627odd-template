import { useState } from "react";

function QuestionCard({ question, isCompleted, onRevised }) {
    const [isEditing, setIsEditing] = useState(false);
    const [confidence, setConfidence] = useState(question.confidence ?? 3);
    const [notes, setNotes] = useState(question.notes || "");

    const handleRevision = () => {
        onRevised(question, confidence, notes);
        setIsEditing(false);
    };

    const handleClose = () => {
        setConfidence(question.confidence ?? 3);
        setNotes(question.notes || "");
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-lg shadow p-5 mb-4">
            <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold">
                        {question.link ? (
                            <a
                                href={question.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {question.title}
                            </a>
                        ) : (
                            question.title
                        )}
                    </h2>

                    <p className="text-gray-500">
                        {question.topic}
                        {question.subtopic && ` • ${question.subtopic}`}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                        <span>{question.difficulty}</span>
                        <span>{question.platform}</span>
                        <span>Confidence {question.confidence}/5</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setConfidence(question.confidence ?? 3);
                        setNotes(question.notes || "");
                        setIsEditing(true);
                    }}
                    className={`shrink-0 min-w-28 text-center font-medium text-white px-4 py-2 rounded-md shadow ${
                        isCompleted
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isCompleted ? "Revised ✓" : "Revise"}
                </button>
            </div>

            {isEditing && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={handleClose}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Revise Question
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    {question.title}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                                aria-label="Close revision form"
                            >
                                &times;
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleRevision();
                            }}
                        >
                            <div className="mb-5">
                                <label className="block mb-2 font-medium">
                                    Updated Confidence: {confidence}/5
                                </label>

                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={confidence}
                                    onChange={(e) =>
                                        setConfidence(Number(e.target.value))
                                    }
                                    className="w-full accent-blue-600"
                                />

                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>1 - Very weak</span>
                                    <span>5 - Very confident</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 font-medium">
                                    Notes / Mistakes
                                </label>

                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows="3"
                                    placeholder="What did you learn or struggle with?"
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Save Revision
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionCard;