import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/metrics", async (req, res) => {
	try {
		const userId = (req.user as any).id;
		const { currentStart, currentEnd, previousStart, previousEnd } = req.query;

		const currentWeekInteractions = await prisma.interaction.findMany({
			where: {
				userId,
				interactionDate: {
					gte: new Date(currentStart as string),
					lte: new Date(currentEnd as string),
				},
			},
			include: {
				contact: {
					select: {
						company: {
							select: {
								tier: true,
							},
						},
					},
				},
			},
		});

		const previousWeekCount = await prisma.interaction.count({
			where: {
				userId,
				interactionDate: {
					gte: new Date(previousStart as string),
					lte: new Date(previousEnd as string),
				},
			},
		});

		const tier1Count = currentWeekInteractions.filter(
			(interaction) => interaction.contact.company.tier === "TIER_1"
		).length;

		const currentWeekTotal = currentWeekInteractions.length;

		res.json({
			tier1Count,
			currentWeekTotal,
			previousWeekTotal: previousWeekCount,
		});
	} catch (error) {
		console.error("Error fetching dashboard metrics:", error);
		res.status(500).json({ error: "Failed to fetch dashboard metrics." });	
	}
});

router.get("/priorities", async (req, res) => {
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

router.get("/wins", async (req, res) => {
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

router.patch("/priorities/:id", async (req, res) => {
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

router.post("/priorities", async (req, res) => {
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

export default router;