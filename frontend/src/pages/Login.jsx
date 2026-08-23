import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";


export default function Login(){

    const navigate = useNavigate();


    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");


    async function handleLogin(e){

        e.preventDefault();


        try{

            const res = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );


            localStorage.setItem(
                "token",
                res.data.token
            );


            navigate(
                "/projects"
            );


        }catch(err){

            console.log(err);

            setError(
                "Email or password incorrect"
            );

        }

    }



    return (

        <div className="login-page">


            <form
                onSubmit={handleLogin}
            >

                <h1>
                    TrackLite Login
                </h1>


                {
                    error &&
                    <p>
                        {error}
                    </p>
                }


                <input
                    placeholder="Email"
                    value={email}
                    onChange={
                        e=>setEmail(e.target.value)
                    }
                />


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={
                        e=>setPassword(e.target.value)
                    }
                />


                <button>
                    Login
                </button>


            </form>


        </div>

    );

}
