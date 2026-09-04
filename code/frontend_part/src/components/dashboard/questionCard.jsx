function QuestionCard({ question }) {
    console.log("QUESTION:", question);
    console.log(Object.keys(question));

    return (
        <div className="bg-white rounded-lg shadow p-5 mb-4">

            <div className="flex justify-between items-start">

                <div>
                    <h2 className="text-xl font-semibold">
                        {question.title}
                    </h2>

                    <p className="text-gray-500">
                        {question.difficulty}
                    </p>

                    <div className="flex gap-6 mt-3 text-sm text-gray-600">
                        <span>{question.difficulty}</span>
                        <span>Confidence {question.confidence}/5</span>
                        <span>{question.lastRevised}</span>
                    </div>
                </div>

                <button className="bg-blue-600 text-white px-3 py-1 rounded-md">
                    R
                </button>

            </div>

        </div>
    );
}

export default QuestionCard;