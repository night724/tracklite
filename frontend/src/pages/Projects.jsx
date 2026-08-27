import {
    useEffect,
    useState
} from "react";
import api from "../api/client";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    async function loadProjects() {
        try {
            const res = await api.get("/projects");
            setProjects(res.data);
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        loadProjects();
    }, []);
    const visibleProjects =
        projects.filter(project => {
            const matchName =
                project.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );
            const matchStatus =
                filter === "all"
                ||
                project.status === filter;
            return matchName && matchStatus;
        });
    return (
        <div className="projects-page">
            <header className="projects-header">
                <div>
                    <h1>
                        Projects
                    </h1>
                    <p>
                        Organize and manage your team's work
                    </p>
                </div>
                <button
                    className="primary-button"
                    onClick={() =>
                        setShowModal(true)
                    }
                >
                    + New Project
                </button>
            </header>

            <div className="project-controls">
                <input
                    placeholder="🔍 Search projects..."
                    value={search}
                    onChange={
                        e => setSearch(
                            e.target.value
                        )
                    }
                />
                <select
                    value={filter}
                    onChange={
                        e => setFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="all">
                        All Projects
                    </option>
                    <option value="active">
                        Active
                    </option>
                    <option value="completed">
                        Completed
                    </option>
                </select>
            </div>
            <div className="project-grid">
                {
                    visibleProjects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                        />
                    ))
                }
            </div>
            {
                visibleProjects.length === 0 &&
                <div className="empty-project">
                    <h2>
                        No projects found
                    </h2>
                    <p>
                        Create your first project
                    </p>
                </div>
            }
            {
                showModal &&
                <CreateProjectModal
                    onClose={() =>
                        setShowModal(false)
                    }
                    onCreated={() => {
                        setShowModal(false);
                        loadProjects();
                    }}
                />
            }
        </div>
    );
}