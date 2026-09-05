import { Routes, Route } from "react-router-dom";

import AppLayout from "./layouts/appLayout";

import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import AddQuestion from "./pages/addQuestion";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Heatmap from "./pages/Heatmap";
import Settings from "./pages/Settings";

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/questions/new" element={<AddQuestion />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/history" element={<History />} />
                <Route path="/heatmap" element={<Heatmap />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default App;