import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {

    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({
                message: "Authorization token missing"
            });
        }
        const token = header.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        console.log(
            "JWT USER:",
            decoded
        );
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}