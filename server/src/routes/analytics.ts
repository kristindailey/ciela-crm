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

		res.json(companiesByTier);
	} catch (error) {
		console.error("Error fetching dashboard analytics:", error);
		res.status(500).json({ error: "Failed to fetch dashboard analytics." });
	}
});

export default router;