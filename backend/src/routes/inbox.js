import express from "express";
import db from "../db.js";

const router = express.Router();


router.get("/", async(req,res)=>{


    try{


        const result =
        await db.query(
        `
        SELECT
            id,
            title,
            message,
            created_at
        FROM notifications
        ORDER BY created_at DESC
        LIMIT 20
        `
        );


        res.json(
            result.rows
        );


    }catch(error){


        console.error(error);


        res.status(500)
        .json({
            message:"Failed to load inbox"
        });


    }


});


export default router;
