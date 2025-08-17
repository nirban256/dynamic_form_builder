import React from "react";

const LoginPage = () => {
    const handleLogin = () => {
        // Redirect user to backend OAuth route
        const apiUrl = import.meta.env.VITE_API_URL;
        window.location.href = `${apiUrl}/api/auth/airtable`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Airtable based Form Builder
                </h1>
                <p className="text-gray-500 mb-8">
                    Login with your Airtable account
                </p>

                <div className="flex justify-center mb-8">
                    <img
                        src="./Airtable_Logo.svg"
                        alt="Airtable"
                        className="h-8"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-5 h-5"
                        viewBox="0 0 16 16"
                    >
                        <path d="M15.854 8.146a.5.5 0 0 0-.708-.708L8.5 14.086 1.854 7.438a.5.5 0 1 0-.708.708l7 7a.5.5 0 0 0 .708 0l7-7z" />
                    </svg>
                    Login with Airtable
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
