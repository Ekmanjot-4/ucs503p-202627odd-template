import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
    const handleGoogleLogin = (credentialResponse) => {
        console.log("Google credential received:", credentialResponse.credential);
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
                        Welcome!
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in or create an account to continue.
                    </p>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => console.log("Google Login Failed")}
                        text="continue_with"
                        shape="rectangular"
                        width="320"
                    />
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Secure authentication for your DSA journey.
                </p>
            </div>
        </div>
    );
};

export default Login;