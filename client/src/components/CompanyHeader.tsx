import { BsBriefcase } from "react-icons/bs";
import { RiBlueskyLine } from "react-icons/ri";
import { FiGithub } from "react-icons/fi";
import { CiLinkedin, CiStar } from "react-icons/ci";
import { IoIosLink, IoIosCamera } from "react-icons/io";
import type { Company } from "../types/company";

interface CompanyHeaderProps {
    company: Company;
}

const CompanyHeader = ({ company }: CompanyHeaderProps) => {
    const socialLinks = [
        { url: company.careersPage, icon: BsBriefcase, label: "careersPage" },
        { url: company.website, icon: IoIosLink, label: "website" },
        { url: company.glassdoor, icon: CiStar, label: "glassdoor" },
        { url: company.github, icon: FiGithub, label: "github" },
        { url: company.linkedin, icon: CiLinkedin, label: "linkedin" },
        { url: company.bluesky, icon: RiBlueskyLine, label: "bluesky" },
    ];

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full mt-20 ml-5 mr-5">
                <div className="flex items-center gap-4 font-inter">
                    <h1 className="text-[var(--royal-blue)] font-bold text-4xl">{company.name}</h1>

                    <div className="w-11 h-11 rounded-full bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors ml-15">
                        <IoIosCamera className="text-2xl"/>
                    </div>

                    <div className="inline-flex h-10 px-6 items-center justify-center rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] text-lg font-bold ml-20">
                        {company.tier.toLowerCase().replace("_", " ")}
                    </div>

                    <div className="flex items-center gap-4 ml-35 text-2xl text-[var(--royal-blue)]">
                        {socialLinks.map(({ url, icon: Icon, label }) => (
                            <a 
                                key={label}
                                href={url || undefined}
                                target={url ? "_blank" : undefined}
                                rel={url ? "noopener noreferrer" : undefined}
                                className={`${url ? "hover:text-[var(--soft-lavender)]" : "text-gray-300 cursor-not-allowed"}`}
                            >
                                <Icon />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyHeader;