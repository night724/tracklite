import express from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get( "/project/:projectId", authenticate, async (req, res) => {

        try {
            const {
                status,
                priority,
                assignee,
                sort
            } = req.query;
            let query = `

                        SELECT
                        i.*,
                        u.name AS assignee_name
                        FROM issues i
                        LEFT JOIN users u
                        ON i.assignee_id=u.id
                        WHERE i.project_id=$1
                        AND i.deleted_at IS NULL

                        `;

            let values = [
                req.params.projectId
            ];

            if (status) {
                values.push(status);
                query +=
                    `
                    AND i.status=$${values.length}
                    `;
            }
            if (priority) {
                values.push(priority);
                query +=
                    `
                    AND i.priority=$${values.length}
                    `;
            }
            if (assignee) {
                values.push(assignee);
                query +=
                    `
                    AND i.assignee_id=$${values.length}
                    `;
            }
            if (sort === "due_date") {
                query +=
                    `
                    ORDER BY i.due_date ASC
                    `;
            }
            else if (sort === "updated") {
                query +=
                    `
                    ORDER BY i.updated_at DESC
                    `;
            }
            else {
                query +=
                    `
                    ORDER BY i.created_at DESC
                    `;
            }
            const result =
                await db.query( query, values );
            res.json(result.rows);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            });
        }
    });

router.get( "/dashboard/:projectId", authenticate, async (req, res) => {

        try {
            const projectId = req.params.projectId;
            const stats =
                await db.query(

                    `
                    SELECT
                    COUNT(*) FILTER(
                    WHERE status!='Done'
                    )
                    AS open,
                    COUNT(*) FILTER(
                    WHERE status='In Progress'
                    )
                    AS progress,
                    COUNT(*) FILTER(
                    WHERE due_date<CURRENT_DATE
                    AND status!='Done'
                    )
                    AS overdue,
                    COUNT(*) FILTER(
                    WHERE status='Done'
                    AND updated_at >= CURRENT_DATE-INTERVAL '7 days'
                    )
                    AS done
                    FROM issues
                    WHERE project_id=$1
                    AND deleted_at IS NULL
                    `,
                    [projectId]
                );
            const issues =
                await db.query(
                    `
                    SELECT
                    i.*,
                    u.name AS assignee_name
                    FROM issues i
                    LEFT JOIN users u
                    ON i.assignee_id=u.id
                    WHERE i.project_id=$1
                    ORDER BY i.updated_at DESC
                    LIMIT 10
                    `,
                    [projectId]
                );
            res.json({
                stats: stats.rows[0],
                issues: issues.rows
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            });
        }
    });

router.get( "/:id", authenticate, async (req, res) => {

        try {
            const issue = await db.query(
                    `
                    SELECT
                    i.*,
                    u.name AS assignee_name
                    FROM issues i
                    LEFT JOIN users u
                    ON i.assignee_id=u.id
                    WHERE i.id=$1
                    `,
                    [ req.params.id ]
                );
            const comments =
                await db.query(
                    `
                    SELECT
                    c.*,
                    u.name
                    FROM comments c
                    JOIN users u
                    ON c.user_id=u.id
                    WHERE c.issue_id=$1
                    ORDER BY c.created_at ASC
                    `,
                    [ req.params.id ]
                );
            const activity = await db.query(
                    `
                    SELECT *
                    FROM activity
                    WHERE issue_id=$1
                    ORDER BY created_at ASC
                    `,
                    [ req.params.id ]
                );
            res.json({
                issue: issue.rows[0],
                comments: comments.rows,
                activity: activity.rows
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            });
        }
    });

router.post( "/", authenticate, async (req, res) => {

        try {
            const {
                project_id,
                title,
                description,
                priority,
                status
            } = req.body;

            const issueKey =
                "ISSUE-" +
                Date.now();
            const result =
                await db.query(
                    `
                    INSERT INTO issues
                    (
                    project_id,
                    issue_key,
                    title,
                    description,
                    priority,
                    status,
                    created_by
                    )
                    VALUES
                    ($1,$2,$3,$4,$5,$6,$7)
                    RETURNING *
                    `,
                    [
                        project_id,
                        issueKey,
                        title,
                        description || "",
                        priority || "Medium",
                        status || "Todo",
                        req.user.id
                    ]
                );
            res.status(201)
                .json(result.rows[0]);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            });
        }
    });

router.patch( "/:id", authenticate, async (req, res) => {

        try {
            const {
                title,
                description,
                status,
                priority,
                assignee_id
            } = req.body;
            const result =
                await db.query(
                    `
                    UPDATE issues
                    SET
                    title=COALESCE($1,title),
                    description=COALESCE($2,description),
                    status=COALESCE($3,status),
                    priority=COALESCE($4,priority),
                    assignee_id=COALESCE($5,assignee_id),
                    updated_at=NOW()
                    WHERE id=$6
                    RETURNING *
                    `,
                    [
                        title,
                        description,
                        status,
                        priority,
                        assignee_id,
                        req.params.id
                    ]
                );
            await db.query(
                `
                INSERT INTO activity
                (
                issue_id,
                user_id,
                activity_type,
                message
                )
                VALUES
                ($1,$2,$3,$4)
                `,
                [
                    req.params.id,
                    req.user.id,
                    "UPDATE",
                    "Updated issue"
                ]
            );
            res.json(result.rows[0]);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            });
        }
    });

router.post( "/:id/comments", authenticate, async (req, res) => {

        try {
            const result =
                await db.query(
                    `
                    INSERT INTO comments
                    (
                    issue_id,
                    user_id,
                    body
                    )
                    VALUES
                    ($1,$2,$3)
                    RETURNING *
                    `,
                    [
                        req.params.id,
                        req.user.id,
                        req.body.body
                    ]
                );
            res.json(result.rows[0]);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            });
        }
    });

export default router;