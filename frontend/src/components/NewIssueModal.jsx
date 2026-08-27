import { useState } from "react";
import api from "../api/client";

export default function NewIssueModal({ open, projectId, onClose, onCreated}) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("Todo");
    const [loading, setLoading] = useState(false);

    if (!open) { return null; }
    async function handleSubmit(e) { e.preventDefault();
        if (!title.trim()) {
            alert("Title is required");
            return;
        }
        try {
            setLoading(true);
            await api.post( "/issues",
                {
                    project_id: projectId,
                    title,
                    description,
                    priority,
                    status
                }
            );
            setTitle("");
            setDescription("");
            setPriority("Medium");
            setStatus("Todo");
            onCreated();
        }
        catch (error) {
            console.error( "CREATE Task ERROR:", error.response?.data || error );
            alert( "Failed to create Task" );
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2> Create new Task </h2>
                <form onSubmit={handleSubmit}>
                    <label> Title </label>
                    <input
                        value={title}
                        onChange={ e => setTitle( e.target.value ) }
                        placeholder="Task title"
                    />
                    <label> Description </label>
                    <textarea
                        value={description}
                        onChange={ e => setDescription( e.target.value ) }
                        placeholder="Describe the Task"
                    />
                    <label> Priority </label>
                    <select
                        value={priority}
                        onChange={ e => setPriority( e.target.value ) }
                    >
                        <option> Urgent </option>
                        <option> High </option>
                        <option> Medium </option>
                        <option> Low </option>
                    </select>

                    <label> Status </label>
                    <select
                        value={status}
                        onChange={ e => setStatus( e.target.value ) }
                    >
                        <option> Backlog </option>
                        <option> Todo </option>
                        <option> In Progress </option>
                    </select>

                    <div>
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {
                                loading
                                    ?
                                    "Creating..."
                                    :
                                    "Create Task"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}