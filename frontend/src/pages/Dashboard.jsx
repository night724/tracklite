import {
    Link,
    useParams
} from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../api/client";

export default function Dashboard() {

    const { projectId } = useParams();

    const [issues, setIssues] = useState([]);

    useEffect(() => {

        api.get(
            `/issues/project/${projectId}`
        )
        .then(response => {
            setIssues(response.data);
        })
        .catch(console.error);

    }, [projectId]);

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
            issue =>
                issue.due_date &&
                new Date(issue.due_date) < new Date()
        );

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
                        Website Redesign
                    </h1>

                    <p>
                        Relaunch of the marketing site
                    </p>

                </div>

                <button className="primary-button">
                    New issue
                </button>

            </div>

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
                    value="13"
                />

            </div>

            <div className="dashboard-grid">

                <section className="panel">

                    <h2>
                        Issues by status
                    </h2>

                    <StatusBar
                        name="Backlog"
                        count={14}
                    />

                    <StatusBar
                        name="Todo"
                        count={12}
                    />

                    <StatusBar
                        name="In Progress"
                        count={9}
                    />

                    <StatusBar
                        name="In Review"
                        count={3}
                    />

                    <StatusBar
                        name="Done"
                        count={21}
                    />

                </section>

                <section className="panel">

                    <h2>
                        Open issues by assignee
                    </h2>

                    <Workload
                        name="Priya Sharma"
                        count={11}
                    />

                    <Workload
                        name="Dan Kim"
                        count={9}
                    />

                    <Workload
                        name="Mia Torres"
                        count={7}
                    />

                    <Workload
                        name="Sam Ortiz"
                        count={6}
                    />

                    <Workload
                        name="Unassigned"
                        count={5}
                    />

                </section>

            </div>

            <section className="panel">

                <h2>
                    Recently updated
                </h2>

                {issues.slice(0, 10).map(issue => (

                    <Link
                        className="recent-item"
                        key={issue.id}
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

                ))}

            </section>

        </div>
    );
}

function StatCard({ title, value }) {

    return (
        <div className="stat-card">
            <small>{title}</small>
            <strong>{value}</strong>
        </div>
    );
}

function StatusBar({ name, count }) {

    return (
        <div className="status-row">

            <span>
                {name}
            </span>

            <div className="bar">
                <div
                    style={{
                        width: `${count * 3}%`
                    }}
                />
            </div>

            <strong>
                {count}
            </strong>

        </div>
    );
}

function Workload({ name, count }) {

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
