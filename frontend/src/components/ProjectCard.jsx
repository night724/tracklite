import {
    Link
} from "react-router-dom";

export default function ProjectCard({
    project
}) {
    return (
        <div className="project-card">
            <div className="project-top">
                <div
                    className="project-icon"
                    style={{ background: project.color }}
                >
                    {
                        project.name
                            .charAt(0)
                            .toUpperCase()
                    }
                </div>
            </div>

            <h2>
                {project.name}
            </h2>
            <p>
                {
                    project.description ||
                    "No description"
                }
            </p>
            <div className="project-stats">
                <div>
                    <strong>
                        {project.issue_count || 0}
                    </strong>
                    <span> Issues </span>
                </div>

                <div>
                    <strong>
                        {project.member_count || 0}
                    </strong>
                    <span> Members </span>
                </div>
            </div>

            <div className="progress-area">
                <div className="progress-background">
                    <div className="progress-value"
                        style={{
                            width: `${project.progress || 0}%`
                        }}
                    >
                    </div>
                </div>
                <span>
                    {project.progress || 0}% completed
                </span>
            </div>
            <Link
                to={
                    `/projects/${project.id}/dashboard`
                }
                className="open-project"
            >
                Open Project
            </Link>
        </div>
    );
}