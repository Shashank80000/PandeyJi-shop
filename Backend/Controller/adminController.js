import Admin from "../model/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ LOGIN
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let admin = await Admin.findOne({ email: normalizedEmail });

    // Auto-create the first admin ONLY from env credentials when no admin exists.
    // SECURITY: the bootstrap password must come from the environment — no hardcoded fallback.
    if (!admin) {
        const defaultEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        if (defaultEmail && defaultPassword && normalizedEmail === defaultEmail && password === defaultPassword) {
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            admin = new Admin({
                email: defaultEmail,
                password: hashedPassword,
            });
            await admin.save();
        } else {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }
    }

    // Real bcrypt check — the bootstrap password does NOT bypass hashing once the admin exists.
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_ADMIN_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token });
};

// ⚠️ TEMPORARY (create admin once) — protected + one-time only
export const createAdmin = async (req, res) => {
    try {
        // One-time setup: refuse once any admin account already exists.
        const anyAdmin = await Admin.findOne({});
        if (anyAdmin) {
            return res.status(403).json({ message: "Admin already exists. Setup is locked." });
        }

        const email = (req.body.email || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
        const password = req.body.password || process.env.DEFAULT_ADMIN_PASSWORD;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ email, password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin" });
    }
};
