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

router.get("/:id", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { id } = req.params;

        const company = await prisma.company.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!company) {
            return res.status(404).json({ error: "Company not found." });
        }

        res.json(company);
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({ error: "Failed to fetch company." });
    }
});

router.get("/:id/contacts", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { id } = req.params;

        const company = await prisma.company.findFirst({
            where: {
                id, 
                userId,
            },
        });    
        
        if (!company) {
            return res.status(404).json({ error: "Company not found." });
        }

        const contacts = await prisma.contact.findMany({
            where: {
                companyId: id,
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
            orderBy: [
                { lastName: "asc" },
                { firstName: "asc" },
            ],
        });

        res.json(contacts);
    } catch (error) {
        console.error("Error fetching company contacts:", error);
        res.status(500).json({ error: "Failed to fetch company contacts." });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { id } = req.params;
        const updateData = req.body;
        
        const existingCompany = await prisma.company.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!existingCompany) {
            return res.status(404).json({ error: "Company not found." });
        }

        const updatedCompany = await prisma.company.update({
            where: { id },
            data: updateData,
        });

        res.json(updatedCompany);
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({ error: "Failed to update company." });
    }
});

router.post("/", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { name, website, tier, employeeCount, hqLocation, localLocation, description } = req.body;

        const company = await prisma.company.create({
            data: {
                name, 
                website, 
                tier,
                employeeCount, 
                hqLocation, 
                localLocation,
                description, 
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

router.delete("/:id", async (req, res) => {
    try {
        const userId = (req.user as any).id;
        const { id } = req.params;

        const company = await prisma.company.deleteMany({
            where: {
                id,
                userId,
            },
        });

        if (!company) {
            return res.status(404).json({ error: "Company not found." });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting company:", error);
        res.status(500).json({ error: "Failed to delete company." });
    }
});

export default router;