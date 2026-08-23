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

        if (!projectId) {
            return;
        }

        loadProject();
        loadIssues();

    }, [projectId]);


    async function loadProject() {

        try {

            const response =
                await api.get(
                    `/projects/${projectId}`
                );

            setProject(
                response.data
            );

        } catch (err) {

            console.error(
                "LOAD MOBILE APP PROJECT ERROR:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load project"
            );

        }

    }


    async function loadIssues() {

        try {

            setLoading(true);

            const response =
                await api.get(
                    `/issues/project/${projectId}`
                );

            setIssues(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "LOAD MOBILE APP ISSUES ERROR:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load issues"
            );

        } finally {

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
        openIssues.filter(
            issue => {

                if (!issue.due_date) {
                    return false;
                }

                return (
                    new Date(issue.due_date)
                    <
                    new Date()
                );

            }
        );


    const doneThisWeek =
        issues.filter(
            issue => {

                if (
                    issue.status !== "Done" ||
                    !issue.updated_at
                ) {
                    return false;
                }

                const updated =
                    new Date(
                        issue.updated_at
                    );

                const weekAgo =
                    new Date();

                weekAgo.setDate(
                    weekAgo.getDate() - 7
                );

                return updated >= weekAgo;

            }
        );


    const backlog =
        issues.filter(
            issue =>
                issue.status === "Backlog"
        ).length;


    const todo =
        issues.filter(
            issue =>
                issue.status === "Todo"
        ).length;


    const inReview =
        issues.filter(
            issue =>
                issue.status === "In Review"
        ).length;


    const done =
        issues.filter(
            issue =>
                issue.status === "Done"
        ).length;


    const workload =
        openIssues.reduce(
            (result, issue) => {

                const name =
                    issue.assignee_name ||
                    "Unassigned";

                result[name] =
                    (result[name] || 0) + 1;

                return result;

            },
            {}
        );


    if (loading && !project) {

        return (
            <div className="page">

                <h2>
                    Loading Mobile App...
                </h2>

            </div>
        );

    }


    return (

        <div className="page">


            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            <div className="page-header">


                <div>


                    <div className="breadcrumb">

                        Acme Inc /
                        {" "}
                        {project?.name || "Mobile App"} /
                        {" "}
                        Dashboard

                    </div>


                    <h1>

                        {project?.name ||
                            "Mobile App"}

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


            {showModal && (

                <NewIssueModal

                    projectId={projectId}

                    onClose={() => {

                        setShowModal(false);

                        loadIssues();

                    }}

                />

            )}


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


            <div className="dashboard-grid">


                <section className="panel">


                    <h2>
                        Issues by status
                    </h2>


                    <StatusBar
                        name="Backlog"
                        count={backlog}
                    />


                    <StatusBar
                        name="Todo"
                        count={todo}
                    />


                    <StatusBar
                        name="In Progress"
                        count={inProgress.length}
                    />


                    <StatusBar
                        name="In Review"
                        count={inReview}
                    />


                    <StatusBar
                        name="Done"
                        count={done}
                    />


                </section>


                <section className="panel">


                    <h2>
                        Open issues by assignee
                    </h2>


                    {Object.keys(workload).length === 0 && (

                        <p>
                            No open issues.
                        </p>

                    )}


                    {Object.entries(
                        workload
                    ).map(
                        ([name, count]) => (

                            <Workload
                                key={name}
                                name={name}
                                count={count}
                            />

                        )
                    )}


                </section>


            </div>


            <section className="panel">


                <h2>
                    Recently updated
                </h2>


                {issues.length === 0 && (

                    <p>
                        No issues found.
                    </p>

                )}


                {issues
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
                                {issue.issue_key ||
                                    "Issue"}
                            </strong>


                            <span>
                                {issue.title}
                            </span>


                            <span>
                                {issue.status}
                            </span>

                        </Link>

                    ))}


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

            <strong>
                {value}
            </strong>

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
                        width:
                            `${Math.min(
                                count * 5,
                                100
                            )}%`
                    }}
                />

            </div>


            <strong>
                {count}
            </strong>


        </div>

    );
}


function Workload({
    name,
    count
}) {

    return (

        <div className="workload">

            <span>
                {name}
            </span>

            <strong>
                {count}
            </strong>

        </div>

    );
}
