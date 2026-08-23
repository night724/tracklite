import { useEffect, useState } from "react";
import api from "../api/client";


export default function Inbox(){

    const [notifications,setNotifications] =
        useState([]);


    useEffect(()=>{

        loadInbox();

    },[]);



    async function loadInbox(){

        try{

            const response =
                await api.get("/inbox");

            setNotifications(
                response.data
            );


        }catch(error){

            console.error(
                "Inbox error:",
                error
            );

        }

    }



    return (

        <div className="page">


            <div className="page-header">

                <div>

                    <div className="breadcrumb">
                        Acme Inc / Inbox
                    </div>


                    <h1>
                        Inbox
                    </h1>


                    <p>
                        Your latest updates and notifications
                    </p>


                </div>


            </div>



            <section className="panel">


                {
                    notifications.length === 0 &&

                    <p>
                        No notifications
                    </p>

                }



                {
                    notifications.map(item=>(


                        <div
                            key={item.id}
                            className="inbox-item"
                        >


                            <strong>
                                {item.title}
                            </strong>


                            <p>
                                {item.message}
                            </p>


                            <small>
                                {
                                    new Date(
                                        item.created_at
                                    ).toLocaleString()
                                }
                            </small>


                        </div>


                    ))
                }


            </section>


        </div>

    );

}
