function DashboardSummary() {
    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">
                Today's Revision Queue
            </h1>

                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Allocated</p>
                        <p className="text-3xl font-bold">8</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="text-3xl font-bold">3</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Progress</p>
                        <p className="text-3xl font-bold">37.5%</p>
                    </div>
                </div>
        </div>
    );
}

export default DashboardSummary;