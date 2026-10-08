import { NavLink } from "react-router-dom";
import { SIDEBAR_ITEMS } from "../constants/sidebarItems";

function Sidebar() {
    return (
        <aside className="w-64 bg-slate-800 text-white p-4 h-[calc(100vh-3.5rem)]">
            <ul className="flex flex-col gap-2">
                {SIDEBAR_ITEMS.map((item) => (
                    <li key={item.id}>
                        <NavLink
                            to={item.path}
                            className="block rounded-md px-4 py-3 hover:bg-slate-700 transition"
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;