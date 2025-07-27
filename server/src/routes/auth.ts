import express from "express";
import passport from "passport";
import { hashPassword } from "../lib/auth";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.get("/google",   
    passport.authenticate("google", { scope: [ "profile", "email" ] }),
);

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
    (req, res) => {
        res.redirect(process.env.FRONTEND_URL!);
    }
);

router.get("/github",
    passport.authenticate("github", { scope: [ "user:email" ] })
);

router.get("/github/callback", 
    passport.authenticate("github", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
    (req, res) => {
        res.redirect(process.env.FRONTEND_URL!);
    }
);

router.get("/me", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Not authenticated." });
    }

    const { password, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
            return res.status(500).json({ error: "Authentication error." });
        }

        if (!user) {
            const errorMessage = info?.message || "Invalid email or password.";
            return res.status(401).json({ error: errorMessage });
        }

        req.login(user, (loginError) => {
            if (loginError) {
                return res.status(500).json({ error: "Login failed." });
            } 

            res.json({
                message: "Login successful.",
                user, 
            });
        });
    })(req, res, next);
});

router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name,
            }
        });

        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ error: "Registration successful but login failed." });
            }
            res.status(201).json({
                message: "Registration successful.",
                user,
            });
        });
    } catch (err) {
        res.status(500).json({ error: "Registration failed." });
    }
});

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed." });
        }

        res.json({ message: "Logged out successfully." });
    });
});

export default router;