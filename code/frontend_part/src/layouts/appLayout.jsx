import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

import { Outlet } from "react-router-dom";

function AppLayout() {
    return (
        <>
            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-4">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default AppLayout;