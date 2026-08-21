import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    Link
} from "react-router-dom";

import api from "../api/client";

export default function IssueDetail() {

    const { issueId, projectId } = useParams();

    const [issue, setIssue] = useState(null);

    const [editingTitle, setEditingTitle] =
        useState(false);

    const [title, setTitle] =
        useState("");

    const [comment, setComment] =
        useState("");

    useEffect(() => {

        loadIssue();

    }, [issueId]);

    async function loadIssue() {

        try {

            const response =
                await api.get(`/issues/${issueId}`);

            setIssue(response.data);

            setTitle(response.data.title);

        } catch (error) {

            console.error(error);

        }

    }

    async function saveTitle() {

        try {

            const response =
                await api.patch(
                    `/issues/${issueId}`,
                    {
                        title
                    }
                );

            setIssue(response.data);

            setEditingTitle(false);

        } catch (error) {

            console.error(error);

        }
    }

    async function updateProperty(
        field,
        value
    ) {

        try {

            const response =
                await api.patch(
                    `/issues/${issueId}`,
                    {
                        [field]: value
                    }
                );

            setIssue(response.data);

        } catch (error) {

            console.error(error);

        }
    }

    if (!issue) {

        return (
            <div className="loading">
                Loading issue...
            </div>
        );

    }

    return (
        <div>

            <div className="breadcrumb">
                Acme Inc /
                Website Redesign /
                {issue.issue_key}
            </div>

            <div className="issue-detail">

                <main className="issue-main">

                    <div className="issue-key">
                        {issue.issue_key}
                    </div>

                    {editingTitle ? (

                        <div className="edit-title">

                            <input
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                onClick={saveTitle}
                            >
                                Save
                            </button>

                            <button
                                onClick={() =>
                                    setEditingTitle(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    ) : (

                        <h1
                            onClick={() =>
                                setEditingTitle(true)
                            }
                        >
                            {issue.title}
                        </h1>

                    )}

                    <div className="description">

                        <p>
                            {issue.description ||
                                "No description"}
                        </p>

                    </div>

                    <section className="attachments">

                        <h2>
                            Attachments
                        </h2>

                        <div className="attachment">
                            No attachments yet
                        </div>

                    </section>

                    <section className="activity">

                        <h2>
                            Activity
                        </h2>

                        <ActivityItem>
                            {issue.issue_key}
                            {" "}
                            was created
                        </ActivityItem>

                        <ActivityItem>
                            Status changed to
                            {" "}
                            {issue.status}
                        </ActivityItem>

                    </section>

                    <section className="comment-box">

                        <textarea
                            value={comment}
                            onChange={(e) =>
                                setComment(
                                    e.target.value
                                )
                            }
                            placeholder="Leave a comment…"
                        />

                        <button
                            className="primary-button"
                            disabled={!comment.trim()}
                        >
                            Comment
                        </button>

                    </section>

                </main>

                <aside className="properties">

                    <h2>
                        Properties
                    </h2>

                    <Property
                        label="Status"
                        value={issue.status}
                        options={[
                            "Backlog",
                            "Todo",
                            "In Progress",
                            "In Review",
                            "Done",
                            "Canceled"
                        ]}
                        onChange={(value) =>
                            updateProperty(
                                "status",
                                value
                            )
                        }
                    />

                    <Property
                        label="Priority"
                        value={issue.priority}
                        options={[
                            "Urgent",
                            "High",
                            "Medium",
                            "Low"
                        ]}
                        onChange={(value) =>
                            updateProperty(
                                "priority",
                                value
                            )
                        }
                    />

                    <div className="property">

                        <label>
                            Assignee
                        </label>

                        <div>
                            {issue.assignee_name ||
                                "Unassigned"}
                        </div>

                    </div>

                    <div className="property">

                        <label>
                            Due date
                        </label>

                        <div>
                            {issue.due_date ||
                                "Not set"}
                        </div>

                    </div>

                    <div className="property">

                        <label>
                            Created
                        </label>

                        <div>
                            {new Date(
                                issue.created_at
                            ).toLocaleString()}
                        </div>

                    </div>

                    <div className="property">

                        <label>
                            Updated
                        </label>

                        <div>
                            {new Date(
                                issue.updated_at
                            ).toLocaleString()}
                        </div>

                    </div>

                    <button
                        className="danger-button"
                        onClick={async () => {

                            const confirmed =
                                window.confirm(
                                    "Delete this issue?"
                                );

                            if (!confirmed)
                                return;

                            await api.delete(
                                `/issues/${issue.id}`
                            );

                            window.location.href =
                                `/projects/${projectId}/issues`;

                        }}
                    >
                        Delete issue
                    </button>

                </aside>

            </div>

        </div>
    );
}

function Property({
    label,
    value,
    options,
    onChange
}) {

    return (
        <div className="property">

            <label>
                {label}
            </label>

            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
            >
                {options.map(option => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>

        </div>
    );
}

function ActivityItem({ children }) {

    return (
        <div className="activity-item">
            {children}
        </div>
    );
}
