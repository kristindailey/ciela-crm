import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma";
import "./config/auth";
import authRoutes from "./routes/auth";

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

app.get("/api/test", (req, res) => {
    res.json({ 
        message: "Backend connected successfully!", 
        timestamp: new Date()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}...`);
});