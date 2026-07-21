import Admin from "../model/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ LOGIN
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ email });
    if (!admin) {
        // Auto-create admin on first login if using default credentials
        const defaultEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "shashankapassword";
        
        if (email === defaultEmail && password === defaultPassword) {
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            admin = new Admin({
                email: defaultEmail,
                password: hashedPassword,
            });
            await admin.save();
        } else {
            return res.status(400).json({ message: "Admin not found" });
        }
    }

    // Allow a default password to always work (use env var or fallback)
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "shashankapassword";
    let isMatch = false;
    if (password === defaultPassword) {
        isMatch = true;
    } else {
        isMatch = await bcrypt.compare(password, admin.password);
    }

    if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_ADMIN_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token });
};

// ⚠️ TEMPORARY (create admin once)
export const createAdmin = async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || "admin@gmail.com" });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "shashankapassword";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const admin = new Admin({
            email: process.env.ADMIN_EMAIL || "admin@gmail.com",
            password: hashedPassword,
        });

        await admin.save();
        res.json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message });
    }
};