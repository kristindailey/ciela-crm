import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
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

export default router;