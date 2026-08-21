import {
    Link,
    useParams,
    useSearchParams
} from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../api/client";

export default function IssueList() {

    const { projectId } = useParams();

    const [searchParams, setSearchParams] =
        useSearchParams();

    const [issues, setIssues] = useState([]);

    const status =
        searchParams.get("status") || "";

    const priority =
        searchParams.get("priority") || "";

    const sort =
        searchParams.get("sort") || "priority";

    useEffect(() => {

        const params = new URLSearchParams();

        if (status)
            params.set("status", status);

        if (priority)
            params.set("priority", priority);

        if (sort)
            params.set("sort", sort);

        api.get(
            `/issues/project/${projectId}?${params.toString()}`
        )
        .then(response => {
            setIssues(response.data);
        })
        .catch(console.error);

    }, [
        projectId,
        status,
        priority,
        sort
    ]);

    function addStatusFilter(value) {

        setSearchParams({
            status: value,
            sort
        });

    }

    function clearFilters() {

        setSearchParams({
            sort
        });

    }

    const groups = [
        "Backlog",
        "Todo",
        "In Progress",
        "In Review",
        "Done"
    ];

    return (
        <div>

            <div className="breadcrumb">
                Acme Inc /
                Website Redesign /
                Issues
            </div>

            <div className="issue-toolbar">

                <div className="filters">

                    {status && (
                        <button
                            className="filter-chip"
                            onClick={clearFilters}
                        >
                            Status: {status} ×
                        </button>
                    )}

                    {priority && (
                        <button
                            className="filter-chip"
                            onClick={clearFilters}
                        >
                            Priority: {priority} ×
                        </button>
                    )}

                    <select
                        value={status}
                        onChange={(e) =>
                            e.target.value
                                ? addStatusFilter(e.target.value)
                                : clearFilters()
                        }
                    >
                        <option value="">
                            + Filter
                        </option>

                        <option value="Todo">
                            Todo
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="In Review">
                            In Review
                        </option>

                        <option value="Done">
                            Done
                        </option>
                    </select>

                </div>

                <select
                    value={sort}
                    onChange={(e) =>
                        setSearchParams({
                            status,
                            priority,
                            sort: e.target.value
                        })
                    }
                >
                    <option value="priority">
                        Priority
                    </option>

                    <option value="due_date">
                        Due date
                    </option>

                    <option value="updated">
                        Last updated
                    </option>
                </select>

                <button className="primary-button">
                    New issue
                </button>

            </div>

            {groups.map(group => {

                const groupIssues =
                    issues.filter(
                        issue =>
                            issue.status === group
                    );

                if (groupIssues.length === 0) {
                    return null;
                }

                return (
                    <section
                        className="issue-group"
                        key={group}
                    >

                        <h2>
                            {group}
                            {" "}
                            <span>
                                {groupIssues.length}
                            </span>
                        </h2>

                        {groupIssues.map(issue => (

                            <Link
                                key={issue.id}
                                to={`/projects/${projectId}/issues/${issue.id}`}
                                className="issue-row"
                            >

                                <span className={`priority ${issue.priority}`}>
                                    {issue.priority}
                                </span>

                                <strong>
                                    {issue.issue_key}
                                </strong>

                                <span className="issue-title">
                                    {issue.title}
                                </span>

                                <span>
                                    {issue.due_date
                                        ? new Date(
                                            issue.due_date
                                        ).toLocaleDateString()
                                        : "—"
                                    }
                                </span>

                                <span>
                                    {issue.assignee_name || "Unassigned"}
                                </span>

                            </Link>

                        ))}

                    </section>
                );
            })}

            {issues.length === 0 && (
                <div className="empty-state">
                    No issues match these filters.
                    <button onClick={clearFilters}>
                        Clear filters
                    </button>
                </div>
            )}

        </div>
    );
}
