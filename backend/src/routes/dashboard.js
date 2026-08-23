import express from "express";
import pool from "../db.js";

const router = express.Router();



router.get("/:projectId", async(req,res)=>{


    const {projectId}=req.params;


    try{


        const open =
        await pool.query(
        `
        SELECT COUNT(*)
        FROM issues
        WHERE project_id=$1
        AND status NOT IN
        ('Done','Canceled')
        `,
        [projectId]
        );



        const progress =
        await pool.query(
        `
        SELECT COUNT(*)
        FROM issues
        WHERE project_id=$1
        AND status='In Progress'
        `,
        [projectId]
        );



        const overdue =
        await pool.query(
        `
        SELECT COUNT(*)
        FROM issues
        WHERE project_id=$1
        AND due_date < CURRENT_DATE
        AND status NOT IN
        ('Done','Canceled')
        `,
        [projectId]
        );



        const done =
        await pool.query(
        `
        SELECT COUNT(*)
        FROM issues
        WHERE project_id=$1
        AND status='Done'
        AND updated_at >= CURRENT_DATE - INTERVAL '7 days'
        `,
        [projectId]
        );



        const issues =
        await pool.query(
        `
        SELECT
        i.*,
        u.name as assignee_name

        FROM issues i

        LEFT JOIN users u
        ON u.id=i.assignee_id

        WHERE i.project_id=$1

        ORDER BY updated_at DESC

        LIMIT 10

        `,
        [projectId]
        );



        res.json({

            stats:{
                open:open.rows[0].count,
                progress:progress.rows[0].count,
                overdue:overdue.rows[0].count,
                done:done.rows[0].count
            },

            issues:issues.rows

        });



    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Dashboard error"
        });

    }


});


export default router;