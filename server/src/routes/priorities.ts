import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		
		const priorities = await prisma.priority.findMany({
			where: { userId },
			orderBy: { createdAt: "asc" },
		});

		res.json(priorities);
	} catch (error) {
		console.error("Error fetching priorities:", error);
		res.status(500).json({ error: "Failed to fetch priorities." });
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		const { id } = req.params;
		const { text } = req.body;

		const updatedPriority = await prisma.priority.update({
			where: {
				id,
				userId,
			},
			data: { text },
		});

		res.json(updatedPriority);
	} catch (error) {
		console.error("Error updating priority:", error);
		res.status(500).json({ error: "Failed to update priority." });
	}
});

router.post("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		const { text } = req.body;

		const existingCount = await prisma.priority.count({
			where: { userId },
		});

		if (existingCount >= 3) {
			return res.status(400).json({ error: "Maximum of 3 priorities allowed." });
		}

		const priority = await prisma.priority.create({
			data: {
				userId,
				text,
			},
		});

		res.status(201).json(priority);
	} catch (error) {
		console.error("Error creating priority:", error);
		res.status(500).json({ error: "Failed to create priority." });	
	}
});	

router.delete("/:id", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		const { id } = req.params;

		const result = await prisma.priority.deleteMany({
			where: {
				id,
				userId,
			},
		});

		if (result.count === 0) {
			return res.status(404).json({ error: "Priority not found." });
		}

		res.sendStatus(204);
	} catch (error) {
		console.error("Error deleting priority:", error);
		res.status(500).json({ error: "Failed to delete priority." });
	}
});

router.delete("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;

		const result = await prisma.priority.deleteMany({
			where: { userId },
		});

		if (result.count === 0) {
			return res.status(404).json({ error: "No priorities found." });
		}

		res.sendStatus(204);
	} catch (error) {
		console.error("Error clearing priorities:", error);
		res.status(500).json({ error: "Failed to clear priorities." });
	}
});

export default router;