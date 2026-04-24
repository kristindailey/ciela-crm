import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";
import "./config/auth.js";
import authRoutes from "./routes/auth.js";
import metricsRoutes from "./routes/metrics.js";
import analyticsRoutes from "./routes/analytics.js";
import contactRoutes from "./routes/contacts.js";
import companyRoutes from "./routes/companies.js";
import interactionRoutes from "./routes/interactions.js";
import priorityRoutes from "./routes/priorities.js";
import winRoutes from "./routes/wins.js";
import applicationRoutes from "./routes/applications.js";

const app = express();
const PORT = process.env.PORT;

const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ error: "Not authenticated." });
    }
    next();
};

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
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.use("/metrics", requireAuth, metricsRoutes);
app.use("/analytics", requireAuth, analyticsRoutes);
app.use("/contacts", requireAuth, contactRoutes);
app.use("/companies", requireAuth, companyRoutes);
app.use("/interactions", requireAuth, interactionRoutes);
app.use("/priorities", requireAuth, priorityRoutes);
app.use("/wins", requireAuth, winRoutes);
app.use("/applications", requireAuth, applicationRoutes);
app.set("trust proxy", 1);

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