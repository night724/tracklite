import express from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/project/:projectId", authenticate, async (req, res) => {
    try {
        const {
            status,
            priority,
            assignee,
            sort = "priority"
        } = req.query;

        const values = [req.params.projectId];

        let where = `
            WHERE i.project_id = $1
            AND i.deleted_at IS NULL
        `;

        if (status) {
            values.push(status);

            where += `
                AND i.status = $${values.length}
            `;
        }

        if (priority) {
            values.push(priority);

            where += `
                AND i.priority = $${values.length}
            `;
        }

        if (assignee) {
            values.push(assignee);

            where += `
                AND i.assignee_id = $${values.length}
            `;
        }

        let orderBy = `
            CASE i.priority
                WHEN 'Urgent' THEN 1
                WHEN 'High' THEN 2
                WHEN 'Medium' THEN 3
                WHEN 'Low' THEN 4
            END
        `;

        if (sort === "due_date") {
            orderBy = `
                i.due_date NULLS LAST
            `;
        }

        if (sort === "updated") {
            orderBy = `
                i.updated_at DESC
            `;
        }

        const result = await pool.query(
            `
            SELECT
                i.*,
                u.name AS assignee_name
            FROM issues i
            LEFT JOIN users u
                ON u.id = i.assignee_id
            ${where}
            ORDER BY
                ${orderBy}
            `,
            values
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load issues"
        });
    }
});

router.get("/:id", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                i.*,
                u.name AS assignee_name
            FROM issues i
            LEFT JOIN users u
                ON u.id = i.assignee_id
            WHERE i.id = $1
            AND i.deleted_at IS NULL
            `,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load issue"
        });
    }
});

router.post("/", authenticate, async (req, res) => {
    try {
        const {
            project_id,
            issue_key,
            title,
            description,
            status = "Todo",
            priority = "Medium",
            assignee_id,
            due_date
        } = req.body;

        if (!project_id || !issue_key || !title) {
            return res.status(400).json({
                message: "Project, issue key and title are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO issues(
                project_id,
                issue_key,
                title,
                description,
                status,
                priority,
                assignee_id,
                due_date,
                created_by
            )
            VALUES(
                $1,$2,$3,$4,$5,$6,$7,$8,$9
            )
            RETURNING *
            `,
            [
                project_id,
                issue_key,
                title,
                description,
                status,
                priority,
                assignee_id || null,
                due_date || null,
                req.user.id
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create issue"
        });
    }
});

router.patch("/:id", authenticate, async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            assignee_id,
            due_date
        } = req.body;

        const result = await pool.query(
            `
            UPDATE issues
            SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                status = COALESCE($3, status),
                priority = COALESCE($4, priority),
                assignee_id = $5,
                due_date = $6,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            AND deleted_at IS NULL
            RETURNING *
            `,
            [
                title,
                description,
                status,
                priority,
                assignee_id || null,
                due_date || null,
                req.params.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update issue"
        });
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        await pool.query(
            `
            UPDATE issues
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1
            `,
            [req.params.id]
        );

        res.json({
            message: "Issue deleted"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete issue"
        });
    }
});

export default router;
