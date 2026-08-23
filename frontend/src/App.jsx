import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Members from "./pages/Members";
import Dashboard from "./pages/Dashboard";
import IssueList from "./pages/IssueList";
import IssueDetail from "./pages/IssueDetail";
import Inbox from "./pages/Inbox";
import MyIssues from "./pages/MyIssues";
import Settings from "./pages/Settings";
import AppLayout from "./layouts/AppLayout";

function ProtectedRoute({ children }) {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AppRoutes() {

    return (
        <Routes>

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    index
                    element={
                        <Navigate
                            to="/projects/1/dashboard"
                            replace
                        />
                    }
                />
                <Route
                    path="/inbox"
                    element={<Inbox />}
                />
                <Route
                    path="members"
                    element={<Members />}
                />
                <Route

                    path="/my-issues"

                    element={<MyIssues />}

                />
                <Route
                    path="/settings"
                    element={<Settings />}
                />
                <Route
                    path="projects/:projectId/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="projects/:projectId/issues"
                    element={<IssueList />}
                />

                <Route
                    path="projects/:projectId/issues/:issueId"
                    element={<IssueDetail />}
                />

            </Route>

            <Route
                path="*"
                element={<Navigate to="/" />}
            />

        </Routes>
    );
}

export default function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
