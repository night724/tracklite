import {
    Link,
    Outlet
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import {
    useAuth
} from "../context/AuthContext";

import api from "../api/client";


export default function AppLayout() {


    const {
        user,
        logout
    } = useAuth();



    const [projects, setProjects] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    useEffect(() => {


        async function loadProjects() {


            try {


                const res =
                    await api.get(
                        "/projects"
                    );



                console.log(
                    "PROJECTS:",
                    res.data
                );



                setProjects(

                    Array.isArray(res.data)

                        ? res.data

                        : res.data.projects || []

                );



            }
            catch (error) {


                console.error(
                    "LOAD PROJECTS ERROR:",
                    error.response?.data || error
                );


            }
            finally {


                setLoading(false);


            }


        }



        loadProjects();



    }, []);





    return (


        <div className="app">


            <aside className="sidebar">



                <div className="organization">

                    <strong>
                        Acme Inc
                    </strong>

                </div>





                <nav>


                    <Link to="/inbox">
                        Inbox
                    </Link>
                    
                    <Link to="/projects">

                        Projects

                    </Link>

                    <Link to="/my-issues">
                        My Issues
                    </Link>


                    <Link to="/members">
                        Members
                    </Link>


                    <Link to="/settings">
                        Settings
                    </Link>


                </nav>






                <div className="projects-title">

                    PROJECTS

                </div>






                <div className="projects">


                    {

                        loading && (

                            <p>
                                Loading...
                            </p>

                        )

                    }



                    {

                        !loading &&
                        projects.length === 0 &&

                        (

                            <p>
                                No projects
                            </p>

                        )

                    }




                    {

                        projects.map(project => (

                            <Link

                                key={project.id}

                                to={
                                    `/projects/${project.id}/dashboard`
                                }

                            >

                                <span

                                    className={
                                        `project-color ${project.color ||
                                        "blue"
                                        }`
                                    }

                                />


                                {project.name}


                            </Link>


                        ))

                    }



                </div>







                <div className="current-user">



                    <div>

                        {
                            user?.name ||
                            "User"
                        }

                    </div>



                    <small>

                        {
                            user?.role ||
                            "Member"
                        }

                    </small>




                    <button
                        onClick={logout}
                    >

                        Log out

                    </button>



                </div>





            </aside>







            <main className="main">


                <header className="topbar">


                    <div>

                        Acme Inc
                        {" / "}
                        TrackLite


                    </div>


                </header>





                <section className="content">


                    <Outlet />


                </section>




            </main>



        </div>


    );


}