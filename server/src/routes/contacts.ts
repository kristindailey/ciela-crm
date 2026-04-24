import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const userId = (req.user as any).id;

        const contacts = await prisma.contact.findMany({
            where: { userId },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        tier: true,
                        logoUrl: true,
                    },
                },
            },
            orderBy: [
                { lastName: "asc" },
                { firstName: "asc" },
            ],
        });

        res.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Failed to fetch contacts." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { id } = req.params;

        const contact = await prisma.contact.findFirst({
            where: {
                id, 
                userId,
            },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        tier: true,
                        logoUrl: true,
                    },
                },
            },
        });

        if (!contact) {
            return res.status(404).json({ error: "Contact not found." });
        }

        res.json(contact);
    } catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({ error: "Failed to fetch contact." });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { id } = req.params;
        const updateData = req.body;

        const existingContact = await prisma.contact.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!existingContact) {
            return res.status(404).json({ error: "Contact not found." });
        }

        const updatedContact = await prisma.contact.update({
            where: { id },
            data: updateData,
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        tier: true,
                        logoUrl: true,
                    },
                },
            },
        });

        res.json(updatedContact);
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ error: "Failed to update contact." });
    }
});

router.post("/", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { firstName, lastName, role, location, notes, email, bluesky, github, linkedin, website, companyId  } = req.body;

        const contact = await prisma.contact.create({
            data: {
                firstName,
                lastName,
                role,
                location,
                notes,
                email, 
                linkedin, 
                bluesky,
                github,
                website,
                userId,
                companyId,
            },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        tier: true,
                    },
                },
            },
        });

        res.status(201).json(contact);
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({ error: "Failed to create contact." });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { id } = req.params;

        const result = await prisma.contact.deleteMany({
            where: {
                id, 
                userId,
            },
        });

        if (result.count === 0) {
            return res.status(404).json({ error: "Contact not found." });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ error: "Failed to delete contact." });
    }
});

export default router;