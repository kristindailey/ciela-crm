import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;

		const companiesByTier = await prisma.company.groupBy({
			by: ["tier"],
			where: {
				userId,
			},
			_count: {
				tier: true,
			},
		});

		const interactions = await prisma.interaction.findMany({
			where: {
				userId,
			},
			include: {
				contact: {
					include: {
						company: {
							select: {
								tier: true,
							},
						},
					},
				},
			},
		});

		const interactionsByTier = interactions.reduce((acc, interaction) => {
			const tier = interaction.contact.company.tier;
			acc[tier] = (acc[tier] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		res.json({
			companiesByTier,
			interactionsByTier,
		});
	} catch (error) {
		console.error("Error fetching dashboard analytics:", error);
		res.status(500).json({ error: "Failed to fetch dashboard analytics." });
	}
});

export default router;