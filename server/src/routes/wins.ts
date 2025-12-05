import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		
		const wins = await prisma.win.findMany({
			where: { userId },
		});

		res.json(wins);
	} catch (error) {
		console.error("Error fetching wins:", error);
		res.status(500).json({ error: "Failed to fetch wins." });
	}
});

export default router;