import express from "express";
import passport from "passport";

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

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed." });
        }

        res.json({ message: "Logged out successfully." });
    });
});

export default router;