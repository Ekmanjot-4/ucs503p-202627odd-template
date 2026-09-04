import { SIDEBAR_ITEMS } from "../constants/sidebarItems";

function Sidebar() {
    return (
        <aside className="w-64 bg-slate-800 text-white p-4">
            <ul className="flex flex-col gap-2">
                {SIDEBAR_ITEMS.map((item) => (
                    <li
                        key={item.id}
                        className="cursor-pointer rounded-md px-4 py-3 hover:bg-slate-700 transition"
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;