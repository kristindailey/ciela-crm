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

		const companiesWithInteractions = await prisma.company.findMany({
			where: {
				userId,
			},
			select: {
				id: true,
				name: true,
				contacts: {
					select: {
						interactions: {
							select: {
								id: true,
							}
						},
					},
				},
			},
		});

		const topCompanies = companiesWithInteractions
			.map((company) => ({
				id: company.id,
				name: company.name,
				interactionCount: company.contacts.reduce((acc, contact) => acc + contact.interactions.length, 0),
			}))
			.sort((a, b) => b.interactionCount - a.interactionCount)
			.slice(0, 5);

		const topContacts = await prisma.contact.findMany({
			where: {
				userId,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				_count: {
					select: {
						interactions: true,
					},
				},
			},
			orderBy: {
				interactions: {
					_count: "desc",
				},
			},
			take: 5,
		});

		const formattedTopContacts = topContacts.map((contact) => ({
			id: contact.id,
			name: `${contact.firstName} ${contact.lastName}`,
			interactionCount: contact._count.interactions,
		}));

		res.json({
			companiesByTier,
			interactionsByTier,
			topCompanies,
			topContacts: formattedTopContacts,
		});
	} catch (error) {
		console.error("Error fetching dashboard analytics:", error);
		res.status(500).json({ error: "Failed to fetch dashboard analytics." });
	}
});

export default router;