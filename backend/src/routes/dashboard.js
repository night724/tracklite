import express from "express";
import db from "../db.js";

const router = express.Router();


router.get("/:projectId", async (req, res) => {

    const { projectId } = req.params;


    try {


        const open = await db.query(
            `
            SELECT COUNT(*)
            FROM issues
            WHERE project_id = $1
            AND deleted_at IS NULL
            AND status NOT IN ('Done','Canceled')
            `,
            [
                projectId
            ]
        );



        const inProgress = await db.query(
            `
            SELECT COUNT(*)
            FROM issues
            WHERE project_id = $1
            AND deleted_at IS NULL
            AND status = 'In Progress'
            `,
            [
                projectId
            ]
        );



        const overdue = await db.query(
            `
            SELECT COUNT(*)
            FROM issues
            WHERE project_id = $1
            AND deleted_at IS NULL
            AND status NOT IN ('Done','Canceled')
            AND due_date < CURRENT_DATE
            `,
            [
                projectId
            ]
        );



        const doneThisWeek = await db.query(
            `
            SELECT COUNT(*)
            FROM issues
            WHERE project_id = $1
            AND status = 'Done'
            AND updated_at >= date_trunc('week', CURRENT_DATE)
            `,
            [
                projectId
            ]
        );



        res.json({

            open:
            Number(open.rows[0].count),

            inProgress:
            Number(inProgress.rows[0].count),

            overdue:
            Number(overdue.rows[0].count),

            doneThisWeek:
            Number(doneThisWeek.rows[0].count)

        });



    } catch(error) {


        console.error(
            "DASHBOARD ERROR:",
            error
        );


        res.status(500).json({

            message:error.message

        });


    }


});


export default router;