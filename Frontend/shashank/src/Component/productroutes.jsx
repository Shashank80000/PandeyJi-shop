import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}