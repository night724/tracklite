import {
    Link,
    useParams
} from "react-router-dom";
import {
    useEffect,
    useState
} from "react";
import api from "../api/client";
import NewIssueModal from "../components/NewIssueModal";

export default function MobileApp() {
    const { projectId } = useParams();
    const [project, setProject] =
        useState(null);
    const [issues, setIssues] =
        useState([]);
    const [showModal, setShowModal] =
        useState(false);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] =
        useState("");

    useEffect(() => {
        if (projectId) {
            loadData();
        }
    }, [projectId]);

    async function loadData() {
        try {
            setLoading(true);
            const projectResponse =
                await api.get(
                    `/projects/${projectId}`
                );
            setProject(
                projectResponse.data
            );
            const issueResponse =
                await api.get(
                    `/issues/project/${projectId}`
                );
            setIssues(
                Array.isArray(issueResponse.data)
                    ?
                    issueResponse.data
                    :
                    []
            );
        }
        catch (error) {
            console.error(
                error
            );
            setError(
                error.response?.data?.message ||
                "Failed loading project"
            );
        }
        finally {
            setLoading(false);
        }
    }

    const openIssues =
        issues.filter(
            issue =>
                issue.status !== "Done" &&
                issue.status !== "Canceled"
        );
    const inProgress =
        issues.filter(
            issue =>
                issue.status === "In Progress"
        );
    const overdue =
        openIssues.filter(issue => {
            if (!issue.due_date)
                return false;
            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];
            return issue.due_date < today;
        });

    const doneThisWeek =
        issues.filter(issue => {
            if (
                issue.status !== "Done"
            )
                return false;
            const updated =
                new Date(
                    issue.updated_at
                );
            const week =
                new Date();
            week.setDate(
                week.getDate() - 7
            );
            return updated >= week;
        });

    if (loading) {
        return (
            <div className="page">
                Loading...
            </div>
        );
    }
    return (
        <div className="page">
            {
                error &&
                <div className="error-message">
                    {error}
                </div>
            }
            <div className="page-header">
                <div>
                    <div className="breadcrumb">
                        Acme Inc /
                        {" "}
                        {project?.name || "Mobile App"}
                        {" "}
                        / Dashboard
                    </div>
                    <h1>
                        🟢 {project?.name || "Mobile App"}
                    </h1>
                    <p>
                        {project?.description ||
                            "Mobile application project"}
                    </p>
                </div>
                <button
                    className="primary-button"
                    onClick={() =>
                        setShowModal(true)
                    }
                >
                    New issue
                </button>
            </div>
            {
                showModal &&
                <NewIssueModal
                    open={showModal}
                    projectId={projectId}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    onCreated={() => {
                        setShowModal(false);
                        loadData();
                    }}
                />
            }
            <div className="stat-grid">
                <StatCard
                    title="OPEN ISSUES"
                    value={openIssues.length}
                />
                <StatCard
                    title="IN PROGRESS"
                    value={inProgress.length}
                />
                <StatCard
                    title="OVERDUE"
                    value={overdue.length}
                />
                <StatCard
                    title="DONE THIS WEEK"
                    value={doneThisWeek.length}
                />
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
                                to={`/projects/${projectId}/issues/${issue.id}`}
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
    value
}) {


    return (

        <div className="stat-card">


            <small>

                {title}

            </small>


            <h1>

                {value}

            </h1>


        </div>

    );


}