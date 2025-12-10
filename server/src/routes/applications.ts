import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;

		const applications = await prisma.application.findMany({
			where: {
				userId,
			},
			include: {
				company: true,
			},
			orderBy: {
				appliedDate: "desc",
			},
		});

		res.json(applications);
	} catch (error) {
		console.error("Error fetching applications:", error);
		res.status(500).json({ error: "Failed to fetch applications." });	
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const userId = (req.user as any).id;
        const { id } = req.params;
		const updateData = req.body;

		const existingApplication = await prisma.application.findFirst({
			where: { id },
		});

		if (!existingApplication || existingApplication.userId !== userId) {
			return res.status(404).json({ error: "Application not found." });
		}

		const updatedApplication = await prisma.application.update({
			where: { id },
			data: updateData,
			include: {
				company: true,
			},
		});

		res.json(updatedApplication);
	} catch (error) {
		console.error("Error updating applications:", error);
		res.status(500).json({ error: "Failed to update application." });
	}
});

router.post("/", async (req, res) => {
	try {
		const userId = (req.user as any).id;

		const {
			companyId, 
			jobTitle,
			status,
			appliedDate,
			resumeUrl,
			coverLetterUrl,
			projectDocsUrl,
			notes,
		} = req.body;

		const application = await prisma.application.create({
			data: {
				userId,
				companyId,
				jobTitle,
				status: status || "APPLIED",
				appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
				resumeUrl,
				coverLetterUrl,
				projectDocsUrl,
				notes,
			},
			include: {
				company: true,
			},
		});

		res.status(201).json(application);
	} catch (error) {
		console.error("Error creating application:", error);
		res.status(500).json({ error: "Failed to create application." });
	}
});

export default router;