import dns from 'node:dns'; // or const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); 

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/aouthrouts.js";
import productRoutes from "./routes/productroutes.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/addressrouts.js";
import orderRoutes from "./routes/orderRouts.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1); // behind Render/Vercel proxies
let dbConnectPromise;

const ensureDbConnected = () => {
  
    if (!dbConnectPromise) {
        dbConnectPromise = connectDB().catch((error) => {
            dbConnectPromise = null;
            throw error;
        });
    }

    return dbConnectPromise;
};

// CORS: explicit allowlist. Set CLIENT_ORIGIN (comma-separated) in production.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// No CLIENT_ORIGIN configured -> allow localhost dev origins only (never wide open).
const devOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:4173", "http://localhost:3000"];
const corsOptions = {
    origin: allowedOrigins.length > 0 ? allowedOrigins : devOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

// Health check — does not touch the DB, works even when the DB is down.
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use('/api', async (req, res, next) => {
    try {
        await ensureDbConnected();
        next();
    } catch (error) {
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/address', addressRoutes)
app.use('/api/orders', orderRoutes)
app.use("/api/admin", adminRoutes);

// Unknown API routes -> 404 (prevents HTML error pages from confusing the client)
app.use('/api', (req, res) => {
    res.status(404).json({ message: "API route not found" });
});

// Global error handler — never leaks stack traces to clients.
app.use((error, req, res, next) => {
    console.error("Unhandled error:", error.message);
    res.status(error.status || 500).json({ message: "Internal server error" });
});


const startServer = async () => {
    const port = process.env.PORT || 5001;

    try {
        await ensureDbConnected();
    } catch (error) {
        console.warn(`Starting without an active MongoDB connection: ${error.message}`);
    }

    app.listen(port,()=>{
        console.log(`server is running at ${port}`);
    });
};

if (!process.env.VERCEL) {
    startServer();
}

export default app;