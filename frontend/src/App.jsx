import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import {
    AuthProvider,
    useAuth
} from "./context/AuthContext";
import Login from "./pages/Login";
import Members from "./pages/Members";
import Dashboard from "./pages/Dashboard";
import IssueList from "./pages/IssueList";
import IssueDetail from "./pages/IssueDetail";
import Inbox from "./pages/Inbox";
import MyIssues from "./pages/MyIssues";
import Settings from "./pages/Settings";
import MobileApp from "./pages/MobileApp";
import Projects from "./pages/Projects";
import AppLayout from "./layouts/AppLayout";

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }
    return children;
}
function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC ROUTE */}
            <Route
                path="/login"
                element={<Login />}
            />
            {/* PRIVATE ROUTES */}
            <Route
                path="projects"
                element={<Projects />}
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
                            to="/projects/bf5f8739-dde7-4d40-a0f2-797a40f68788/dashboard"
                            replace
                        />
                    }
                />
                <Route
                    path="inbox"
                    element={<Inbox />}
                />
                <Route
                    path="my-issues"
                    element={<MyIssues />}
                />
                <Route
                    path="members"
                    element={<Members />}
                />
                <Route
                    path="settings"
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
                <Route
                    path="projects/:projectId/mobile-app"
                    element={<MobileApp />}
                />
            </Route>
            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
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