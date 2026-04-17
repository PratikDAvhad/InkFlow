import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import HomePage        from "./pages/HomePage";
import BlogListPage    from "./pages/BlogListPage";
import BlogPostPage    from "./pages/BlogPostPage";
import CategoriesPage  from "./pages/CategoriesPage";
import LoginPage       from "./pages/LoginPage";
import RegisterPage    from "./pages/RegisterPage";
import CreatePostPage  from "./pages/CreatePostPage";
import EditPostPage    from "./pages/EditPostPage";
import ProfilePage     from "./pages/ProfilePage";
import MyPostsPage     from "./pages/MyPostsPage";
import SavedPage       from "./pages/SavedPage";
import DashboardPage   from "./pages/DashboardPage";
import SettingsPage    from "./pages/SettingsPage";
import AboutPage       from "./pages/AboutPage";
import NotFoundPage    from "./pages/NotFoundPage";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  const userRole = user.role || "user";
  if (roles && (!user.role || !roles.includes(user.role))) {
    console.warn(`Access denied. User role: ${user.role}. Required: ${roles}`);
    return <Navigate to="/" replace />;
  }
  return children;
};



function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar onHamburger={() => setSidebarOpen(o => !o)} />
        <main className="page-content">
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/blog"         element={<BlogListPage />} />
            <Route path="/blog/:slug"   element={<BlogPostPage />} />
            <Route path="/categories"   element={<CategoriesPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/about"        element={<AboutPage />} />

            <Route path="/saved"   element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
            <Route path="/my-posts" element={<ProtectedRoute ><MyPostsPage /></ProtectedRoute>} />
            <Route path="/create"  element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute ><EditPostPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/settings"  element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AuthShell() {
  return (
    <Routes>
      <Route path="/login"    element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/login"    element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            <Route path="/*"        element={<AppShell />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

// AuthRoute needs to be top-level too
function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}
