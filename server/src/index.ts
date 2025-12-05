import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma";
import "./config/auth";
import authRoutes from "./routes/auth";
import metricRoutes from "./routes/metrics";
import contactRoutes from "./routes/contacts";
import companyRoutes from "./routes/companies";
import interactionRoutes from "./routes/interactions";
import priorityRoutes from "./routes/priorities";
import winRoutes from "./routes/wins";

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
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.use("/metrics", requireAuth, metricRoutes);
app.use("/contacts", requireAuth, contactRoutes);
app.use("/companies", requireAuth, companyRoutes);
app.use("/interactions", requireAuth, interactionRoutes);
app.use("/priorities", requireAuth, priorityRoutes);
app.use("/wins", requireAuth, winRoutes);

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