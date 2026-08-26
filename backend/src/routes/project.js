import express from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";


const router = express.Router();



router.get(
    "/",
    authenticate,
    async (req, res) => {


        try {


            const result =
                await db.query(

                    `
                    SELECT *
                    FROM projects
                    ORDER BY created_at DESC
                    `

                );


            res.json(
                result.rows
            );


        }
        catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Server error"
            });

        }


    });





router.post(
    "/",
    authenticate,
    async (req, res) => {


        try {


            const {
                name
            } = req.body;



            const result =
                await db.query(

                    `
                    INSERT INTO projects
                    (
                    name
                    )

                    VALUES
                    ($1)

                    RETURNING *

                    `,

                    [
                        name
                    ]

                );



            res.json(
                result.rows[0]
            );



        }
        catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Server error"
            });

        }


    });



export default router;