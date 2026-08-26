import {
    useEffect,
    useState
} from "react";

import api from "../api/client";

import ProjectCard from "../components/ProjectCard";

import CreateProjectModal from "../components/CreateProjectModal";



export default function Projects(){


    const [projects,setProjects] =
        useState([]);


    const [search,setSearch] =
        useState("");


    const [showModal,setShowModal] =
        useState(false);



    async function loadProjects(){

        try{

            const response =
                await api.get(
                    "/projects"
                );


            setProjects(
                response.data
            );


        }
        catch(error){

            console.error(
                "LOAD PROJECTS ERROR",
                error
            );

        }

    }





    useEffect(()=>{

        loadProjects();

    },[]);






    const filteredProjects =
        projects.filter(project=>{


            const name =
                project.name
                ?.toLowerCase()
                || "";


            return name.includes(
                search.toLowerCase()
            );


        });






    return (

        <div className="projects-page">



            <div className="projects-header">


                <div>

                    <h1>
                        Projects
                    </h1>


                    <p>
                        Manage your team's projects
                    </p>


                </div>



                <button

                    className="primary-button"

                    onClick={()=>
                        setShowModal(true)
                    }

                >

                    + New Project

                </button>


            </div>





            <div className="project-toolbar">


                <input

                    placeholder="Search projects..."

                    value={search}

                    onChange={
                        e =>
                        setSearch(
                            e.target.value
                        )
                    }

                />


            </div>








            <div className="project-grid">


                {
                    filteredProjects.map(project=>(


                        <ProjectCard

                            key={project.id}

                            project={project}

                        />


                    ))
                }


            </div>








            {
                showModal &&


                <CreateProjectModal


                    onClose={()=>
                        setShowModal(false)
                    }


                    onCreated={()=>{

                        setShowModal(false);

                        loadProjects();

                    }}


                />


            }




        </div>

    );

}