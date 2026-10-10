import { useState, useEffect } from "react";

function Questions() {
    const [questions, setQuestions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const savedQuestions = JSON.parse(
            localStorage.getItem("algoRecallQuestions") || "[]"
        );

        setQuestions(savedQuestions);
    }, []);

    const handleEdit = (question) => {
        setEditingId(question.id);
        setEditForm({ ...question });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        try {
            const updatedQuestions = questions.map((question) =>
                question.id === editingId
                    ? {
                        ...editForm,
                        confidence: Number(editForm.confidence),
                    }
                    : question
            );

            localStorage.setItem(
                "algoRecallQuestions",
                JSON.stringify(updatedQuestions)
            );

            setQuestions(updatedQuestions);
            setEditingId(null);
            setEditForm({});
        } catch (error) {
            console.error("Error updating question:", error);
            alert("Unable to update question. Please try again.");
        }
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this question?"
        );

        if (!confirmed) return;

        try {
            const updatedQuestions = questions.filter(
                (question) => question.id !== id
            );

            localStorage.setItem(
                "algoRecallQuestions",
                JSON.stringify(updatedQuestions)
            );

            setQuestions(updatedQuestions);

            if (editingId === id) {
                setEditingId(null);
                setEditForm({});
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("Unable to delete question. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        My Questions
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage and review your solved DSA questions.
                    </p>
                </div>

                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
                    Total Questions: {questions.length}
                </div>
            </div>

            {questions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-10 text-center">
                    <h2 className="text-xl font-medium text-gray-700 mb-2">
                        No questions added yet
                    </h2>
                    <p className="text-gray-500">
                        Visit the Add Question page to add your first question.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-4">Question</th>
                                <th className="p-4">Topic</th>
                                <th className="p-4">Subtopic</th>
                                <th className="p-4">Difficulty</th>
                                <th className="p-4">Platform</th>
                                <th className="p-4">Confidence</th>
                                <th className="p-4">Date Solved</th>
                                <th className="p-4">Notes</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {questions.map((question) => (
                                <tr
                                    key={question.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-4 font-medium text-gray-800">
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
                                    </td>

                                    <td className="p-4">{question.topic}</td>
                                    <td className="p-4">
                                        {question.subtopic || "-"}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${
                                                question.difficulty === "Easy"
                                                    ? "bg-green-100 text-green-700"
                                                    : question.difficulty === "Medium"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {question.difficulty}
                                        </span>
                                    </td>

                                    <td className="p-4">{question.platform}</td>

                                    <td className="p-4">
                                        {question.confidence}/5
                                    </td>

                                    <td className="p-4">
                                        {question.dateSolved || "-"}
                                    </td>

                                    <td className="p-4 max-w-xs">
                                        <span
                                            className="block truncate"
                                            title={question.notes || ""}
                                        >
                                            {question.notes || "-"}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(question)
                                                }
                                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                                            >
                                                Update
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(question.id)
                                                }
                                                className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl my-8">
                        <h2 className="text-2xl font-semibold mb-6">
                            Update Question
                        </h2>

                        <form
                            onSubmit={handleUpdate}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <div>
                                <label className="block mb-1 font-medium">
                                    Question Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editForm.title || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Topic *
                                </label>
                                <input
                                    type="text"
                                    name="topic"
                                    value={editForm.topic || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Subtopic
                                </label>
                                <input
                                    type="text"
                                    name="subtopic"
                                    value={editForm.subtopic || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Difficulty *
                                </label>
                                <select
                                    name="difficulty"
                                    value={editForm.difficulty || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                >
                                    <option value="">Select Difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Platform *
                                </label>
                                <select
                                    name="platform"
                                    value={editForm.platform || "LeetCode"}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                >
                                    <option value="LeetCode">LeetCode</option>
                                    <option value="GeeksforGeeks">
                                        GeeksforGeeks
                                    </option>
                                    <option value="CodeStudio">CodeStudio</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Question Link
                                </label>
                                <input
                                    type="url"
                                    name="link"
                                    value={editForm.link || ""}
                                    onChange={handleEditChange}
                                    placeholder="https://..."
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Confidence: {editForm.confidence ?? 3}/5
                                </label>
                                <input
                                    type="range"
                                    name="confidence"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={editForm.confidence ?? 3}
                                    onChange={handleEditChange}
                                    className="w-full accent-blue-600 mt-2"
                                />
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>1 - Very weak</span>
                                    <span>5 - Very confident</span>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Date Solved *
                                </label>
                                <input
                                    type="date"
                                    name="dateSolved"
                                    value={editForm.dateSolved || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">
                                    Notes / Mistakes
                                </label>
                                <textarea
                                    name="notes"
                                    value={editForm.notes || ""}
                                    onChange={handleEditChange}
                                    rows="3"
                                    placeholder="Record your approach, mistakes, or concepts to revisit..."
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-3 mt-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setEditForm({});
                                    }}
                                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Questions;