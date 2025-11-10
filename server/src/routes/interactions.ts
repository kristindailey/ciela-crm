import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

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
                interactionDate: new Date(interactionDate),
                followUpDate: followUpDate ? new Date(followUpDate) : null,
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

export default router;