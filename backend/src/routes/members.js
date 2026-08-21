import express from "express";
import crypto from "crypto";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                u.id,
                u.name,
                u.email,
                om.role,
                om.joined_at
            FROM organization_members om
            JOIN users u
                ON u.id = om.user_id
            ORDER BY u.name
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load members"
        });
    }
});

router.post("/invite", authenticate, async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({
                message: "Email and role are required"
            });
        }

        const organization = await pool.query(`
            SELECT organization_id
            FROM organization_members
            WHERE user_id = $1
            LIMIT 1
        `, [req.user.id]);

        if (organization.rows.length === 0) {
            return res.status(400).json({
                message: "Organization not found"
            });
        }

        const organizationId =
            organization.rows[0].organization_id;

        const token = crypto
            .randomBytes(32)
            .toString("hex");

        const result = await pool.query(
            `
            INSERT INTO invites(
                organization_id,
                email,
                role,
                token,
                expires_at
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                CURRENT_TIMESTAMP + INTERVAL '7 days'
            )
            RETURNING id, email, role, expires_at
            `,
            [
                organizationId,
                email,
                role,
                token
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create invite"
        });
    }
});

export default router;
