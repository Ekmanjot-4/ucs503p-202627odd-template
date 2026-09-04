import { PROJECT_NAME } from "../constants/appConstants";

function Navbar() {
    return (
        <nav className="bg-blue-600 h-16 flex items-center justify-between px-8 shadow-md">

            <div>
                <h1 className="text-white text-2xl font-bold">
                    {PROJECT_NAME}
                </h1>
            </div>

            <div>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="Profile"
                    className="h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
                />
            </div>

        </nav>
    );
}

export default Navbar;