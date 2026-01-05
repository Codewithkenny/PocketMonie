import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccessDenied from "../Pages/AccessDenied";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // While checking auth state
    if (loading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <h2 className="text-2xl text-gray-400">Loading...</h2>
            </section>
        );
    }

    // If not logged in, redirect to login
    if (!user) {
        // Redirect home if trying to access savings routes
        if (location.pathname.startsWith("/savings")) {
            return <AccessDenied />;
        }
        return <Navigate to="/" replace />;
    }

    // ✅ Logged in → render the protected component
    return children;
};

export default ProtectedRoute;
