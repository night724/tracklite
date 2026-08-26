import {
    Link
} from "react-router-dom";



export default function ProjectCard({
    project
}) {


    return (

        <div className="project-card">

            <div className="project-icon">

                {project.name
                    ?.charAt(0)
                    .toUpperCase()
                }

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

            <div className="project-info">


                <span>

                    📌

                    {
                        project.issue_count ||
                        0
                    }

                    Issues

                </span>

                <span>

                    👥

                    {
                        project.member_count ||
                        0
                    }

                    Members

                </span>

            </div>

            <div className="progress-container">


                <div

                    className="progress-bar"

                    style={{

                        width:
                            `${project.progress ||
                            0
                            }%`

                    }}

                />

            </div>


            <small>

                {
                    project.progress ||
                    0
                }%

                completed

            </small>

            <Link

                className="project-button"

                to={
                    `/projects/${project.id}/dashboard`
                }

            >

                Open Project

            </Link>




        </div>

    );

}