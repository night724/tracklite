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

export default router;
