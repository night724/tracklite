import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();



// ======================
// REGISTER
// ======================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;



        if (!name || !email || !password) {

            return res.status(400).json({

                message: "All fields are required"

            });

        }



        // Check existing user

        const existing =
        await db.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            `,
            [
                email
            ]
        );



        if (existing.rows.length > 0) {

            return res.status(400).json({

                message: "User already exists"

            });

        }



        // Hash password

        const passwordHash =
        await bcrypt.hash(
            password,
            10
        );



        // Insert user

        const result =
        await db.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password_hash
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            RETURNING
                id,
                name,
                email
            `,
            [
                name,
                email,
                passwordHash
            ]
        );



        res.status(201).json({

            message:"User created",

            user:result.rows[0]

        });



    } catch(error) {


        console.error(
            "REGISTER ERROR:",
            error
        );


        res.status(500).json({

            message:error.message

        });


    }

});





// ======================
// LOGIN
// ======================

router.post("/login", async(req,res)=>{


    try {


        const {
            email,
            password
        } = req.body;



        if(!email || !password){

            return res.status(400).json({

                message:"Email and password required"

            });

        }




        const result =
        await db.query(
            `
            SELECT *
            FROM users
            WHERE email=$1
            `,
            [
                email
            ]
        );



        if(result.rows.length===0){


            return res.status(401).json({

                message:"Email or password is incorrect"

            });


        }



        const user =
        result.rows[0];



        const validPassword =
        await bcrypt.compare(
            password,
            user.password_hash
        );



        if(!validPassword){


            return res.status(401).json({

                message:"Email or password is incorrect"

            });


        }




        if(!process.env.JWT_SECRET){

            throw new Error(
                "JWT_SECRET is missing"
            );

        }




        const token =
        jwt.sign(

            {
                id:user.id,
                email:user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }

        );




        res.json({

            token,

            user:{

                id:user.id,

                name:user.name,

                email:user.email

            }

        });



    } catch(error){


        console.error(
            "LOGIN ERROR:",
            error
        );



        res.status(500).json({

            message:error.message

        });


    }


});



export default router;