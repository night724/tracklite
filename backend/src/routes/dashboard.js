import express from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get( "/:projectId", authenticate, async (req, res) => {

        try {
            const {
                projectId
            } = req.params;

            const project = await pool.query(
                `
                SELECT id,name
                FROM projects
                WHERE id=$1
                `,
                [ projectId ]
            );
            if (project.rows.length === 0) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            const stats = await pool.query(

                `
            SELECT
            COUNT(*) FILTER(
                WHERE status NOT IN
                ('Done','Canceled')
            )::int AS open,
            COUNT(*) FILTER(
                WHERE status='In Progress'
            )::int AS progress,
            COUNT(*) FILTER(
                WHERE due_date < CURRENT_DATE
                AND status NOT IN
                ('Done','Canceled')
            )::int AS overdue,
            COUNT(*) FILTER(
                WHERE status='Done'
                AND updated_at >=
                CURRENT_DATE - INTERVAL '7 days'
            )::int AS done
            FROM issues
            WHERE project_id=$1
            AND deleted_at IS NULL
            `,
                [  projectId  ]
            );

            const issues = await pool.query(
                `
            SELECT
            i.id,
            i.issue_key,
            i.title,
            i.status,
            i.priority,
            i.due_date,
            u.name AS assignee_name
            FROM issues i
            LEFT JOIN users u
            ON i.assignee_id=u.id
            WHERE i.project_id=$1
            AND i.deleted_at IS NULL
            ORDER BY i.updated_at DESC
            LIMIT 10
            `,
                [ projectId ]
            );

            res.json({
                project: project.rows[0],
                stats: stats.rows[0],
                issues: issues.rows
            });
        }
        catch (error) {
            console.error(
                "DASHBOARD ERROR:",
                error
            );

            res.status(500).json({
                message: error.message
            });
        }
    }
);

export default router;