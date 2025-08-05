import { Router } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const userId = (req.user as any).id;

        const companies = await prisma.company.findMany({
            where: { userId },
            orderBy: { name: "asc" }, 
        });

        res.json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ error: "Failed to fetch companies." });
    }
});

router.post("/", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { name, website, description, tier } = req.body;

        const company = await prisma.company.create({
            data: {
                name, 
                website, 
                description, 
                tier,
                userId,
            },
        });

        res.status(201).json(company);
    } catch (error) {
        console.error("Error creating company:", error);

        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            return res.status(400).json({ error: "A company with this name already exists." });
        }

        res.status(500).json({ error: "Failed to create company." });
    }
});

export default router;