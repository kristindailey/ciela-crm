import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		
		const wins = await prisma.win.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});

		res.json(wins);
	} catch (error) {
		console.error("Error fetching wins:", error);
		res.status(500).json({ error: "Failed to fetch wins." });
	}
});

router.post("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		const { text } = req.body;

		const win = await prisma.win.create({
			data: {
				userId,
				text,
			},
		});

		res.status(201).json(win);
	} catch (error) {
		console.error("Error creating win:", error);
		res.status(500).json({ error: "Failed to create win." });	
	}
});	

export default router;