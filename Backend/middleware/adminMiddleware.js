import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader) {
        return res.status(401).json({ message: "No token" });
    }

    // ❌ Wrong format
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    try {
        if (!process.env.JWT_ADMIN_SECRET) {
            console.error("JWT_ADMIN_SECRET is not configured");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Not admin" });
        }

        req.admin = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};