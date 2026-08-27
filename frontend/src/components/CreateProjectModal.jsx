import { useState } from "react";
import api from "../api/client";

export default function CreateProjectModal({
    onClose,
    onCreated
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    async function createProject(e) {
        e.preventDefault();
        if (!name.trim()) {
            alert("Project name is required");
            return;
        }
        try {
            const response = await api.post( "/projects",
                { name, description }
            );
            console.log(
                "PROJECT CREATED:",
                response.data
            );
            onCreated();
        }
        catch (err) {
            console.log(
                "PROJECT ERROR:",
                err.response?.data || err.message
            );
        }
    }
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2> Create Project </h2>
                <form onSubmit={createProject}>
                    <input
                        type="text"
                        placeholder="Project name"
                        value={name}
                        onChange={
                            (e) => setName(e.target.value)
                        }
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={ (e) => setDescription(e.target.value) }
                    />
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}