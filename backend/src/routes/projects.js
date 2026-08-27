import express from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                project_key,
                description,
                color,
                archived
            FROM projects
            ORDER BY name
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to load projects"
        });
    }
});

router.get("/:id", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT *
            FROM projects
            WHERE id = $1
            `,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to load project"
        });
    }
});

router.post(
    "/",
    authenticate,
    async (req, res) => {
        try {
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({
                    message: "Project name required"
                });
            }
            const userId = req.user.id;
            console.log(
                "CREATE PROJECT USER:",
                userId
            );
            const org = await pool.query(
                `
                SELECT organization_id
                FROM organization_members
                WHERE user_id=$1
                LIMIT 1
                `,
                [  userId  ]
            );
            console.log(
                "FOUND ORGANIZATION:",
                org.rows
            );
            if (org.rows.length === 0) {
                return res.status(400).json({
                    message: "User has no organization"
                });
            }
            const organizationId =
                org.rows[0].organization_id;
            const project = await pool.query(
                `
                INSERT INTO projects
                (
                organization_id,
                created_by,
                name,
                project_key,
                description,
                color
                )
                VALUES
                (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
                )

                RETURNING *
                `,
                [
                    organizationId,
                    userId,
                    name,
                    name
                        .substring(0, 3)
                        .toUpperCase(),
                    description || "",
                    "#6366f1"
                ]

            );
            res.json(
                project.rows[0]
            );
        }
        catch (error) {
            console.error(
                "PROJECT CREATE ERROR:",
                error
            );
            res.status(500).json({
                message: error.message
            });
        }
    });

export default router;