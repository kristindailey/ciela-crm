import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker, DateSegment, Dialog, Group, Heading, Popover } from "react-aria-components";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarDate } from "@internationalized/date";
import type { Company } from "../types/company";
import type { Application } from "../types/application";
import { normalizeUrl } from "../utils/urlHelpers";

const AddApplicationPage = () => {
    const [formData, setFormData] = useState({
        jobTitle: "",
		status: "APPLIED" as Application["status"],
		resumeUrl: "",
		coverLetterUrl: "",
		projectDocsUrl: "",
        notes: "",
    });
	const [appliedDate, setAppliedDate] = useState<CalendarDate | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [showNewCompany, setShowNewCompany] = useState(false);
    const [newCompanyData, setNewCompanyData] = useState({
        name: "",
        website: "",
        description: "",
    });
    const [error, setError] = useState<string>("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCompanySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        if (value === "create-new") {
            setShowNewCompany(true);
            setSelectedCompany("");
        } else {
            setShowNewCompany(false);
            setSelectedCompany(value);
        }
    };

    const handleNewCompanyChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setNewCompanyData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "name" && error) {
            setError("");
        }
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();

        try { 
            let companyId = selectedCompany;

            if (showNewCompany) {
                const existingCompany = companies.find((c) => {
                    return c.name.toLowerCase() === newCompanyData.name.toLowerCase();
                });

                if (existingCompany) {
                    setError("Company already exists! Please select it from the dropdown.");
                    return;
                }

                setError("");

                const companyResponse = await fetch(`${API_BASE_URL}/companies`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...newCompanyData,
                        website: normalizeUrl(newCompanyData.website),
                    }),
                    credentials: "include",
                });

                const newCompany = await companyResponse.json();
                companyId = newCompany.id;
            }

            const applicationResponse = await fetch(`${API_BASE_URL}/applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    companyId,
					appliedDate: appliedDate ? appliedDate.toString() : new Date().toISOString(),
                    resumeUrl: normalizeUrl(formData.resumeUrl),
                    coverLetterUrl: normalizeUrl(formData.coverLetterUrl),
                    projectDocsUrl: normalizeUrl(formData.projectDocsUrl),
                }),
                credentials: "include",
            });

            await applicationResponse.json();
            navigate("/applications");
        } catch (error) {
            console.error("Error creating application:", error);
        }
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/companies`, {
                    credentials: "include",
                });
    
                if (response.ok) {
                    const companiesData = await response.json();
                        setCompanies(companiesData);
                    } 
                } catch (error) {
                    console.error("Error fetching companies:", error);
                }
            };
    
            fetchCompanies();
    }, []);

    return (
        <div className="p-6 text-primary">
            <h1 className="text-2xl font-bold mt-20 mb-4">Add New Application</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSave}>
                <div className="flex gap-5 mt-5">
                    <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">Job Title</label>
                        <input
                            type="text"
                            id="jobTitle"
                            name="jobTitle"
                            required
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                        <select
                            name="company"
                            id="company"
                            value={selectedCompany}
                            onChange={handleCompanySelect}
                            required={!showNewCompany}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        >
                            <option value="">Choose a company...</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}

                            <option value="create-new">Create New Company</option>
                        </select>
                        {showNewCompany && (
                            <div className="mt-4 p-4 border border-2 border-[var(--card-border)] rounded-md">
                                <h3 className="text-lg font-medium mb-4">New Company Details</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            id="companyName"
                                            name="name"
                                            required
                                            value={newCompanyData.name}
                                            onChange={handleNewCompanyChange}
                                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="companyWebsite" className="block text-sm font-medium mb-1">Company Website</label>
                                        <input
                                            type="text"
                                            id="companyWebsite"
                                            name="website"
                                            required
                                            value={newCompanyData.website}
                                            onChange={handleNewCompanyChange}
                                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-5 mt-8">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        >
							<option value="APPLIED">Applied</option>
							<option value="PHONE_SCREEN">Phone Screen</option>
							<option value="TECHNICAL">Tehnical</option>
							<option value="ONSITE">Onsite</option>
							<option value="OFFER">Offer</option>
							<option value="REJECTED">Rejected</option>
							<option value="WITHDRAWN">Withdrawn</option>
						</select>
                    </div>

                    <div>
                        <label htmlFor="appliedDate" className="block text-sm font-medium mb-1">Applied Date</label>
                        
						<DatePicker value={appliedDate} onChange={setAppliedDate} aria-label="Applied Date">
							<Group className="flex w-fit items-center border-2 border-[var(--card-border)] rounded-md px-2 py-2">
								<DateInput className="py-1 pr-10 pl-2">
									{(segment) => <DateSegment segment={segment} />}
								</DateInput>
								<Button className="bg-[var(--sidebar)] text-white rounded ml-3 hover:bg-[var(--lavender)] hover:text-[var(--heading)] transition-colors">
									<ChevronDown size={20} />
								</Button>
							</Group>
							<Popover className="max-w-none bg-card shadow-lg rounded-lg border border-2 border-[var(--sidebar)] p-4 text-primary">
								<Dialog>
									<Calendar>
										<header className="flex justify-center mb-5">
											<Button slot="previous" className="bg-[var(--sidebar)] text-white rounded ml-3 mr-3 hover:bg-[var(--lavender)] hover:text-[var(--heading)] transition-colors">
												<ChevronLeft size={20} />
											</Button>
											<Heading />
											<Button slot="next" className="bg-[var(--sidebar)] text-white rounded ml-3 hover:bg-[var(--lavender)] hover:text-[var(--heading)] transition-colors">
												<ChevronRight size={20} />
											</Button>
										</header>
										<CalendarGrid>
											{(date) => 
												<CalendarCell date={date} className="flex justify-center">
													{({ isOutsideMonth }) => (
														<span className={isOutsideMonth ? "text-placeholder" : "p-2 rounded-md hover:bg-[var(--sidebar)] hover:text-white transition-colors duration-150"}>{date.day}</span>
													)}
												</CalendarCell>
											}
										</CalendarGrid>
									</Calendar>
								</Dialog>
							</Popover>
						</DatePicker>
                    </div>
                </div>

                <div className="flex gap-5 mt-8">
                    <div>
                        <label htmlFor="resumeUrl" className="block text-sm font-medium mb-1">Resume URL</label>
                        <input
                            type="text"
                            id="resumeUrl"
                            name="resumeUrl"
                            value={formData.resumeUrl}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="coverLetterUrl" className="block text-sm font-medium mb-1">Cover Letter URL</label>
                        <input
                            type="text"
                            id="coverLetterUrl"
                            name="coverLetterUrl"
                            value={formData.coverLetterUrl}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="projectDocsUrl" className="block text-sm font-medium mb-1">Project Docs URL</label>
                        <input
                            type="text"
                            id="projectDocsUrl"
                            name="projectDocsUrl"
                            value={formData.projectDocsUrl}
                            onChange={handleInputChange}
                            className="w-full md:w-[18rem] px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-2 border-[var(--input-border)] rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-[var(--sidebar)] text-white rounded-md hover:bg-[var(--lavender)] hover:text-[var(--heading)] hover:font-medium"
                >
                    Create Application
                </button>
            </form>
        </div>
    );
};

export default AddApplicationPage;