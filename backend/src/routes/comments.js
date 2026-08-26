import express from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();


router.post("/", authenticate, async(req,res)=>{

    try{

        const {
            issue_id,
            body
        } = req.body;


        const result =
        await pool.query(
        `
        INSERT INTO comments(
            issue_id,
            user_id,
            body
        )
        VALUES($1,$2,$3)

        RETURNING *
        `,
        [
            issue_id,
            req.user.id,
            body
        ]);


        res.json(result.rows[0]);


    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Comment failed"
        });

    }

});


export default router;
