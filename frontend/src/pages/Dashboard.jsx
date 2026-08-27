import {
    Link,
    useParams,
    useNavigate
} from "react-router-dom";
import {
    useEffect,
    useState
} from "react";
import api from "../api/client";
import NewIssueModal from "../components/NewIssueModal";

export default function Dashboard() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    async function loadIssues() {
        try {
            setLoading(true);
            const response =
                await api.get(`/issues/project/${projectId}`);
            setIssues(response.data);
        } catch (error) {
            console.error(
                "LOAD ISSUES ERROR:",
                error.response?.data || error
            );
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (projectId) {
            loadIssues();
        }
    }, [projectId]);
    const openIssues =
        issues.filter(issue =>
            issue.status !== "Done" &&
            issue.status !== "Canceled"
        );
    const inProgress =
        issues.filter(issue =>
            issue.status === "In Progress"
        );
    const overdue =
        openIssues.filter(issue => {
            if (!issue.due_date)
                return false;
            return new Date(issue.due_date)
                <
                new Date();
        });
    const doneThisWeek =
        issues.filter(issue => {
            if (
                issue.status !== "Done" ||
                !issue.updated_at
            )
                return false;
            const updated =
                new Date(issue.updated_at);
            const weekAgo =
                new Date();
            weekAgo.setDate(
                weekAgo.getDate() - 7
            );
            return updated >= weekAgo;
        });
    const workload = {};
    openIssues.forEach(issue => {
        const name =
            issue.assignee_name ||
            "Unassigned";
        workload[name] =
            (workload[name] || 0) + 1;
    });
    if (loading) {
        return (
            <h2> Loading dashboard... </h2>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="breadcrumb">
                        Acme Inc /
                        Website Redesign /
                        Dashboard
                    </div>
                    <h1>
                        🟣 Website Redesign
                    </h1>
                    <p>
                        Relaunch of the marketing site
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        setShowModal(true)
                    }
                >
                    New Task
                </button>
            </div>
            {
                showModal &&
                <NewIssueModal
                    open={showModal}
                    projectId={projectId}
                    onClose={() =>
                        setShowModal(false)
                    }
                    onCreated={() => {
                        setShowModal(false);
                        loadIssues();
                    }}
                />
            }
            <div className="stat-grid">
                <StatCard
                    title="OPEN Task"
                    value={openIssues.length}
                    onClick={() =>
                        navigate(
                            `/projects/${projectId}/issues?status=Todo`
                        )
                    }
                />
                <StatCard
                    title="IN PROGRESS"
                    value={inProgress.length}
                    onClick={() =>
                        navigate(
                            `/projects/${projectId}/issues?status=In Progress`
                        )
                    }
                />
                <StatCard
                    title="OVERDUE"
                    value={overdue.length}
                    onClick={() =>
                        navigate(
                            `/projects/${projectId}/issues?status=overdue`
                        )
                    }
                />
                <StatCard
                    title="DONE THIS WEEK"
                    value={doneThisWeek.length}
                    onClick={() =>
                        navigate(
                            `/projects/${projectId}/issues?status=Done`
                        )
                    }
                />
            </div>
            <div className="dashboard-grid">
                <section className="panel">
                    <h2>
                        Tasks by status
                    </h2>
                    <StatusBar
                        name="Backlog"
                        count={
                            issues.filter(
                                i => i.status === "Backlog"
                            ).length
                        }
                    />
                    <StatusBar
                        name="Todo"
                        count={
                            issues.filter(
                                i => i.status === "Todo"
                            ).length
                        }
                    />
                    <StatusBar
                        name="In Progress"
                        count={inProgress.length}
                    />
                    <StatusBar
                        name="In Review"
                        count={
                            issues.filter(
                                i => i.status === "In Review"
                            ).length
                        }
                    />
                    <StatusBar
                        name="Done"
                        count={
                            issues.filter(
                                i => i.status === "Done"
                            ).length
                        }
                    />
                </section>
                <section className="panel">
                    <h2>
                        Open Tasks by assignee
                    </h2>
                    {
                        Object.entries(workload)
                            .map(([name, count]) => (
                                <Workload
                                    key={name}
                                    name={name}
                                    count={count}
                                />
                            ))
                    }
                </section>
            </div>
            <section className="panel">
                <h2>
                    Recently updated
                </h2>
                {
                    issues
                        .slice(0, 10)
                        .map(issue => (
                            <Link
                                key={issue.id}
                                className="recent-item"
                                to={
                                    `/projects/${projectId}/issues/${issue.id}`
                                }
                            >
                                <strong>
                                    {issue.issue_key}
                                </strong>
                                <span>
                                    {issue.title}
                                </span>
                                <span>
                                    {issue.status}
                                </span>
                            </Link>
                        ))
                }
            </section>
        </div>
    );
}
function StatCard({
    title,
    value,
    onClick
}) {
    return (
        <div
            className="stat-card"
            onClick={onClick}
        >
            <small>
                {title}
            </small>
            <h1>
                {value}
            </h1>
        </div>
    );
}
function StatusBar({
    name,
    count
}) {
    return (
        <div className="status-row">
            <span>
                {name}
            </span>
            <div className="bar">
                <div
                    style={{
                        width: `${count * 10}%`
                    }}
                />
            </div>
            <strong> {count} </strong>
        </div>
    );
}
function Workload({
    name,
    count
}) {
    return (
        <div className="workload">
            <span> {name} </span>
            <strong> {count} </strong>
        </div>
    );
}