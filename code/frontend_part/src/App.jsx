import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-6">
                    <Dashboard />
                </main>
            </div>
        </div>
    );
}

export default App;