import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";


export default function MyIssues(){


    const [issues,setIssues] =
        useState([]);



    useEffect(()=>{

        loadIssues();

    },[]);



    async function loadIssues(){


        try{

            const response =
                await api.get(
                    "/issues/my"
                );


            setIssues(
                response.data
            );


        }catch(error){

            console.error(
                "MY ISSUES ERROR:",
                error.response?.data || error
            );

        }


    }



    return (

        <div className="page">


            <div className="page-header">

                <div>

                    <div className="breadcrumb">

                        Acme Inc / My Issues

                    </div>


                    <h1>
                        My Issues
                    </h1>


                    <p>
                        Issues assigned to you
                    </p>


                </div>


            </div>




            <section className="panel">


                {
                    issues.length === 0 &&

                    <p>
                        No issues assigned
                    </p>

                }



                {
                    issues.map(issue=>(


                        <Link

                            key={issue.id}

                            className="recent-item"

                            to={
                            `/projects/${issue.project_id}/issues/${issue.id}`
                            }

                        >


                            <strong>

                                {issue.issue_key}

                            </strong>



                            <span>

                                {issue.title}

                            </span>



                            <span>

                                {issue.status}

                            </span>



                            <span>

                                {issue.priority}

                            </span>


                        </Link>


                    ))

                }


            </section>


        </div>

    );

}