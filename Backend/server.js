import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/aouthrouts.js";
import productRoutes from "./routes/productroutes.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/addressrouts.js";
import orderRoutes from "./routes/orderRouts.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
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

app.use(cors());
app.use(express.json());

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