import express from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post( "/", authenticate, async (req, res) => {

        try {
            const { issue_id, body } = req.body;

            if (!body) {
                return res.status(400).json({
                    message: "Comment is required"
                });
            }

            const result = await db.query(
                `
                INSERT INTO comments
                ( issue_id, user_id, body )
                VALUES
                ($1,$2,$3)
                RETURNING *
                `,
                [ issue_id, req.user.id, body ]
            );
            res.json(
                result.rows[0]
            );
        }
        catch (error) {
            console.error(
                "CREATE COMMENT ERROR:",
                error
            );
            res.status(500).json({
                message: "Server error"
            });
        }
    });

router.get( "/issue/:issueId", authenticate, async (req, res) => {

        try {
            const result = await db.query(
                `
                SELECT comments.*, users.name FROM comments JOIN users
                ON users.id = comments.user_id
                WHERE issue_id=$1
                ORDER BY created_at ASC
                `,
                [ req.params.issueId ]
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
    
export default router;