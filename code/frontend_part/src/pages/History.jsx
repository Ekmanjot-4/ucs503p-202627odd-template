import { useState, useEffect } from "react";

function History() {
    const [revisionHistory, setRevisionHistory] = useState([]);

    useEffect(() => {
        const savedHistory = JSON.parse(
            localStorage.getItem("algoRecallRevisionHistory") || "[]"
        );

        setRevisionHistory(savedHistory);
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29);

    const recentRevisions = revisionHistory
        .filter((revision) => {
            if (!revision.revisionDate) return false;

            const revisionDate = new Date(
                revision.revisionDate + "T00:00:00"
            );

            return revisionDate >= startDate && revisionDate <= today;
        })
        .sort((a, b) =>
            b.revisionDate.localeCompare(a.revisionDate)
        );

    const formatDate = (date) => {
        if (!date) return "—";

        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Revision History
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Your revisions from the last 30 days, newest first.
                </p>
            </div>

            {recentRevisions.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <h2 className="text-lg font-semibold text-slate-700">
                        No revisions yet
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Questions you revise from the Dashboard will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Question</th>
                                <th className="px-6 py-4 font-semibold">Topic</th>
                                <th className="px-6 py-4 font-semibold">Confidence</th>
                                <th className="px-6 py-4 font-semibold">Previously Solved</th>
                                <th className="px-6 py-4 font-semibold">Revision Date</th>
                                <th className="px-6 py-4 font-semibold">Notes / Mistakes</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {recentRevisions.map((revision) => (
                                <tr
                                    key={revision.id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {revision.title}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {revision.topic || "—"}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className="text-slate-500">
                                            {revision.previousConfidence}/5
                                        </span>
                                        <span className="mx-2 text-slate-400">
                                            →
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {revision.updatedConfidence}/5
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                        {formatDate(revision.dateSolved)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                        {formatDate(revision.revisionDate)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {revision.notes || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default History;