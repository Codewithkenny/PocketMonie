import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../../helper/api";

const AccessDenied = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/login", { email, password });

            if (res.data?.token && res.data?.user) {
                login(res.data.user, res.data.token);
                setShowLogin(false);

                window.location.href = "/savings";
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Invalid credentials. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/register", { name, email, password });

            if (res.data?.token && res.data?.user) {
                login(res.data.user, res.data.token);
                setShowSignup(false);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error creating account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-primary text-white text-center p-6 relative">
            <h1 className="text-4xl font-bold mb-4">Access Restricted 🚫</h1>
            <p className="text-lg text-gray-300 max-w-md mb-8">
                You need to be logged in to access this page.
                Please log in or create an account to continue.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => {
                        setShowLogin(true);
                        setShowSignup(false);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-6 py-3 rounded-lg"
                >
                    Log In
                </button>

                <button
                    onClick={() => {
                        setShowSignup(true);
                        setShowLogin(false);
                    }}
                    className="bg-green-500 hover:bg-green-600 transition text-white font-semibold px-6 py-3 rounded-lg"
                >
                    Sign Up
                </button>
            </div>

            <Link to="/" className="mt-6 text-sm text-gray-400 hover:text-white">
                ← Back to Home
            </Link>

            {/* LOGIN MODAL */}
            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white text-black rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
                        <button
                            onClick={() => setShowLogin(false)}
                            className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-xl"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>

                        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
                            >
                                {loading ? "Logging in..." : "Sign In"}
                            </button>
                        </form>

                        <p className="text-sm text-gray-500 text-center mt-4">
                            Don’t have an account?{" "}
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => {
                                    setShowLogin(false);
                                    setShowSignup(true);
                                }}
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            )}

            {/* SIGNUP MODAL */}
            {showSignup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white text-black rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
                        <button
                            onClick={() => setShowSignup(false)}
                            className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-xl"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

                        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                required
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </button>
                        </form>

                        <p className="text-sm text-gray-500 text-center mt-4">
                            Already have an account?{" "}
                            <button
                                className="text-green-600 hover:underline"
                                onClick={() => {
                                    setShowSignup(false);
                                    setShowLogin(true);
                                }}
                            >
                                Log In
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AccessDenied;
