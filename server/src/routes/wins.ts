import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		
		const wins = await prisma.win.findMany({
			where: { userId },
			orderBy: { createdAt: "asc" },
		});

		res.json(wins);
	} catch (error) {
		console.error("Error fetching wins:", error);
		res.status(500).json({ error: "Failed to fetch wins." });
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		const { id } = req.params;
		const { text } = req.body;

		const updatedWin = await prisma.win.update({
			where: {
				id,
				userId,
			},
			data: { text },
		});

		res.json(updatedWin);
	} catch (error) {
		console.error("Error updating win:", error);
		res.status(500).json({ error: "Failed to update win." });
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

router.delete("/:id", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		const { id } = req.params;

		const result = await prisma.win.deleteMany({
			where: {
				id,
				userId,
			},
		});

		if (result.count === 0) {
			return res.status(404).json({ error: "Win not found." });
		}

		res.sendStatus(204);
	} catch (error) {
		console.error("Error deleting win:", error);
		res.status(500).json({ error: "Failed to delete win." });
	}
});

router.delete("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;

		const result = await prisma.win.deleteMany({
			where: { userId },
		});

		if (result.count === 0) {
			return res.status(404).json({ error: "No wins found." });
		}

		res.sendStatus(204);
	} catch (error) {
		console.error("Error clearing wins:", error);
		res.status(500).json({ error: "Failed to clear wins." });
	}
});

export default router;