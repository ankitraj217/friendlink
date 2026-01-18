// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

import { HomePage, ExplorePage, ReelsPage, ProfilePage, NotFoundPage, SettingsPage } from "../pages";
import { LoginPage, RegisterPage, LandingPage } from "../pages/auth";
import { CreatePage, ViewPostPage } from "../pages/posts";

export default function AppRoute() {
    return (
        <Routes>
            {/* Auth routes (only if NOT logged in) */}
            <Route element={<AuthRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Private routes (only if logged in) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/post/:id" element={<ViewPostPage />} />
                <Route path="/reels" element={<ReelsPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Public Profile Route */}
            <Route path="/profile/:id" element={<ProfilePage />} />
            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

// Route wrappers for authentication checks
const ProtectedRoute = () => {
    const { isAuth } = useContext(AuthContext);

    return isAuth ? <Outlet /> : <Navigate to="/" replace />;
}

const AuthRoute = () => {
    const { isAuth } = useContext(AuthContext);

    return !isAuth ? <Outlet /> : <Navigate to="/home" replace />;
}

