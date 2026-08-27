import {
    Link,
    useParams,
    useSearchParams
} from "react-router-dom";
import {
    useEffect,
    useState
} from "react";
import api from "../api/client";
import NewIssueModal from "../components/NewIssueModal";

export default function IssueList() {
    const { projectId } = useParams();
    const [
        searchParams,
        setSearchParams
    ] = useSearchParams();
    const [issues, setIssues] = useState([]);
    const [
        showModal,
        setShowModal
    ] = useState(false);
    const status =
        searchParams.get("status") || "";
    const priority =
        searchParams.get("priority") || "";
    const sort =
        searchParams.get("sort") || "priority";
    async function loadIssues() {
        try {
            const params = new URLSearchParams();
            if (
                status &&
                status !== "overdue" &&
                status !== "done-this-week"
            ) {
                params.set(
                    "status",
                    status
                );
            }
            if (priority) {
                params.set(
                    "priority",
                    priority
                );
            }
            params.set(
                "sort",
                sort
            );
            const response =
                await api.get(
                    `/issues/project/${projectId}?${params}`
                );
            let data = response.data;
            if (status === "overdue") {
                data =
                    data.filter(issue => {
                        if (!issue.due_date)
                            return false;
                        return (
                            new Date(issue.due_date)
                            <
                            new Date()
                            &&
                            issue.status !== "Done"
                            &&
                            issue.status !== "Canceled"
                        );
                    });
            }
            if (status === "done-this-week") {
                const weekAgo =
                    new Date();
                weekAgo.setDate(
                    weekAgo.getDate() - 7
                );
                data =
                    data.filter(issue => {
                        if (
                            issue.status !== "Done"
                            ||
                            !issue.updated_at
                        ) {
                            return false;
                        }
                        return (
                            new Date(issue.updated_at)
                            >=
                            weekAgo
                        );
                    });
            }
            setIssues(data);
        }
        catch (error) {
            console.error(
                "LOAD ISSUES ERROR",
                error
            );
        }
    }
    useEffect(() => {
        loadIssues();
    }, [
        projectId,
        status,
        priority,
        sort
    ]);
    function updateFilter(
        key,
        value
    ) {
        const params =
            Object.fromEntries(
                searchParams
            );
        if (value) {
            params[key] = value;
        }
        else {
            delete params[key];
        }
        setSearchParams(params);
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
                <div>
                    <select
                        value={status}
                        onChange={ e => updateFilter( "status", e.target.value ) }
                    >
                        <option value="">
                            Status
                        </option>
                        <option>
                            Todo
                        </option>
                        <option>
                            In Progress
                        </option>
                        <option>
                            In Review
                        </option>
                        <option>
                            Done
                        </option>
                    </select>
                    <select
                        value={priority}
                        onChange={ e => updateFilter( "priority", e.target.value ) }
                    >
                        <option value="">
                            Priority
                        </option>
                        <option>
                            Urgent
                        </option>
                        <option>
                            High
                        </option>
                        <option>
                            Medium
                        </option>
                        <option>
                            Low
                        </option>
                    </select>
                    {
                        (status || priority) &&
                        <button
                            onClick={clearFilters}
                        >
                            Clear
                        </button>
                    }
                </div>
                <select
                    value={sort}
                    onChange={ e => updateFilter( "sort", e.target.value ) }
                >
                    <option value="priority">
                        Priority
                    </option>
                    <option value="due_date">
                        Due date
                    </option>
                    <option value="updated">
                        Updated
                    </option>
                </select>
                <button
                    className="primary-button"
                    onClick={() => setShowModal(true) }
                >
                    New Task
                </button>
            </div>
            {
                groups.map(group => {
                    const groupIssues =
                        issues.filter(
                            issue =>
                                issue.status === group
                        );
                    if (groupIssues.length === 0)
                        return null;
                    return (
                        <section
                            className="issue-group"
                            key={group}
                        >
                            <h2>
                                {group}
                                {" "}
                                ({groupIssues.length})
                            </h2>
                            {
                                groupIssues.map(issue => (
                                    <Link
                                        key={issue.id}
                                        to={
                                            `/projects/${projectId}/issues/${issue.id}`
                                        }
                                        className="issue-row"
                                    >
                                        <span
                                            className={
                                                `priority ${issue.priority}`
                                            }
                                        >
                                            {issue.priority}
                                        </span>
                                        <strong>
                                            {issue.issue_key}
                                        </strong>
                                        <span>
                                            {issue.title}
                                        </span>
                                        <span>
                                            {
                                                issue.due_date
                                                    ?
                                                    new Date(
                                                        issue.due_date
                                                    )
                                                        .toLocaleDateString()
                                                    :
                                                    "-"
                                            }
                                        </span>
                                        <span>
                                            {
                                                issue.assignee_name ||
                                                "Unassigned"
                                            }
                                        </span>
                                    </Link>
                                ))
                            }
                        </section>
                    );
                })
            }
            {
                issues.length === 0 &&
                <div className="empty-state">
                    No issues found
                </div>
            }
            {
                showModal &&
                <NewIssueModal
                    open={showModal}
                    projectId={projectId}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    onCreated={() => {
                        loadIssues();
                    }}
                />
            }
        </div>
    );
}