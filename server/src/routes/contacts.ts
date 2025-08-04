import { Router } from "express";
import { prisma } from "../lib/prisma";

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

router.post("/", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { firstName, lastName, email, role, notes, companyId } = req.body;

        const contact = await prisma.contact.create({
            data: {
                firstName,
                lastName,
                email,
                role,
                notes,
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

export default router;