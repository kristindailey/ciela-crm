import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const userId = (req.user as any).id;

        const interactions = await prisma.interaction.findMany({
            where: {
                userId,
                followUpDate: {
                    not: null,
                }
            },
            include: {
                contact: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                                tier: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                followUpDate: "asc",
            },
        });

        res.json(interactions);
    } catch (error) {
        console.error("Error fetching interactions:", error);
        res.status(500).json({ error: "Failed to fetch interactions." });
    }
});

router.get("/:contactId", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { contactId } = req.params;

        const contact = await prisma.contact.findFirst({
            where: { 
                id: contactId,
                userId, 
            },
        });

        if (!contact) {
            return res.status(404).json({ error: "Contact not found." });
        }

        const interactions = await prisma.interaction.findMany({
            where: {
                contactId,
                userId,
            },
            orderBy: {
                interactionDate: "desc",
            },
        });

        res.json(interactions);
    } catch (error) {
        console.error("Error fetching interactions:", error);
        res.status(500).json({ error: "Failed to fetch interactions." });
    }
});

router.patch("/:interactionId", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { interactionId } = req.params;
        const { type, subject, message, interactionDate, followUpDate } = req.body;

        const existingInteraction = await prisma.interaction.findFirst({
            where: {
                id: interactionId,
                userId,
            },
        });

        if (!existingInteraction) {
            return res.status(404).json({ error: "Interaction not found." });
        }

        const updatedInteraction = await prisma.interaction.update({
            where: {
                id: interactionId,
            },
            data: {
                ...(type && { type }),
                ...(subject !== undefined && { subject }),
                ...(message && { message }),
                ...(interactionDate && { interactionDate: new Date(interactionDate + "T00:00:00Z") }),
                ...(followUpDate !== undefined && { followUpDate: followUpDate ? new Date(followUpDate + "T00:00:00Z") : null }),
            },
			include: {
                contact: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                                tier: true,
                            },
                        },
                    },
                },
            },
        });

        res.json(updatedInteraction);
    } catch (error) {
        console.error("Error updating interaction:", error);
        res.status(500).json({ error: "Failed to update interaction." });
    }
});

router.post("/", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { type, subject, message, interactionDate, followUpDate, contactId } = req.body;

        if (!type || !message || !contactId || !interactionDate) {
            return res.status(400).json({ error: "Type, message, contactId, and interactionDate are required." });
        }

        const contact = await prisma.contact.findFirst({
            where: { 
                id: contactId,
                userId, 
            },
        });

        if (!contact) {
            return res.status(404).json({ error: "Contact not found." });
        }

        const interaction = await prisma.interaction.create({
            data: {
                type,
                subject,
                message,
                interactionDate: new Date(interactionDate + "T00:00:00Z"),
                followUpDate: followUpDate ? new Date(followUpDate + "T00:00:00Z") : null,
                userId,
                contactId,
            },
        });

        res.status(201).json(interaction);
    } catch (error) {
        console.error("Error creating interaction:", error);
        res.status(500).json({ error: "Failed to create interaction." });
    }
});

router.delete("/:interactionId", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { interactionId } = req.params;

        const result = await prisma.interaction.deleteMany({
            where: {
                id: interactionId,
                userId,
            },
        });

        if (result.count === 0) {
            return res.status(404).json({ error: "Interaction not found." });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting interaction:", error);
        res.status(500).json({ error: "Failed to delete interaction." });
    }
});

export default router;