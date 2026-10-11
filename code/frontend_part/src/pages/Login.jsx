import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);

            setError(
                error.response?.data?.message ||
                "Unable to login. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Algo Recall
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Your personal DSA revision companion
                    </p>
                </div>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold text-slate-800">
                        Welcome Back!
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to continue your revision journey.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#315B8C]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#315B8C]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#315B8C] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#26476D] disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>

                </form>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Secure authentication for your DSA journey.
                </p>

            </div>
        </div>
    );
};

export default Login;