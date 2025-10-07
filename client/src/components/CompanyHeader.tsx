import { useState, useRef, useCallback } from "react";
import type { Company } from "../types/company";
import { BsBriefcase } from "react-icons/bs";
import { RiBlueskyLine } from "react-icons/ri";
import { FiGithub } from "react-icons/fi";
import { CiLinkedin, CiStar } from "react-icons/ci";
import { IoIosLink } from "react-icons/io";
import { IoImageOutline } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import SocialIcon from "./SocialIcon";

interface CompanyHeaderProps {
    company: Company;
    onCompanyUpdate: (updatedCompany: Company) => void;
    onSaveField: (field: string, newValue: string) => Promise<void>;
}

const CompanyHeader = ({ company, onCompanyUpdate, onSaveField }: CompanyHeaderProps) => {
    const [_selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isEditingTier, setIsEditingTier] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const socialLinks = [
        { url: company.careersPage, icon: BsBriefcase, label: "careersPage" },
        { url: company.website, icon: IoIosLink, label: "website" },
        { url: company.glassdoor, icon: CiStar, label: "glassdoor" },
        { url: company.github, icon: FiGithub, label: "github" },
        { url: company.linkedin, icon: CiLinkedin, label: "linkedin" },
        { url: company.bluesky, icon: RiBlueskyLine, label: "bluesky" },
    ];

    const uploadToCloudinary = useCallback(async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Upload failed:", error);
            return null;
        }
    }, []);

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (file) {
            setSelectedFile(file);

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            const cloudinaryUrl = await uploadToCloudinary(file);

            if (cloudinaryUrl) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${company.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ logoUrl: cloudinaryUrl }),
                        credentials: "include",
                    });

                    if (response.ok) {
                        const updatedCompany = await response.json();
                        onCompanyUpdate(updatedCompany);

                        if (previewUrl && previewUrl.startsWith("blob:")) {
                            URL.revokeObjectURL(previewUrl);
                        }

                        setPreviewUrl(null);
                    }                    
                } catch (error) {
                    console.error("Failed to save logo URL to database:", error);
                }
            }
        }
    };

    const handleSaveTier = async (newTier: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/${company.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier: newTier }),
                credentials: "include",
            });

            if (response.ok) {
                const updatedCompany = await response.json();
                onCompanyUpdate(updatedCompany);
            }
        } catch (error) {
            console.error("Failed to save tier:", error);
        }

        setIsEditingTier(false);
    };

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between w-full mt-20 ml-5 mr-5">
                <div className="flex items-center gap-4 font-inter">
                    <h1 className="text-[var(--royal-blue)] font-extrabold text-3xl mt-5">{company.name}</h1>

                    <div className="ml-8">
                        {(previewUrl || company.logoUrl) ? (
                            <div className="relative group">
                                <img 
                                    src={previewUrl || company.logoUrl} 
                                    alt="Company logo"
                                    className="h-15 object-contain group-hover:opacity-30 transition-opacity" 
                                />
                                
                                <div 
                                    onClick={handleLogoClick}
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                >
                                    <MdModeEditOutline className="text-xl text-black"/>    
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={handleLogoClick} 
                                className="w-13 h-13 rounded-full bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <IoImageOutline className="text-2xl"/>
                        
                            </div>
                        )}
                        <input 
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden" 
                        />
                    </div>

                    {isEditingTier ? (
                        <select 
                            value={company.tier}
                            onChange={(e) => handleSaveTier(e.target.value)}
                            onBlur={() => setIsEditingTier(false)}
                            className="h-10 px-6 rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] text-lg font-bold ml-8 mt-5 border-2 border-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                            autoFocus
                        >
                            <option value="TIER_1">tier 1</option>
                            <option value="TIER_2">tier 2</option>
                            <option value="TIER_3">tier 3</option>
                            <option value="BACKLOG">backlog</option>
                        </select>
                    ) : (
                        <div className="relative group inline-block ml-8 mt-5">
                            <div className="inline-flex h-10 px-6 items-center justify-center rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] text-lg font-bold">
                                {company.tier.toLowerCase().replace("_", " ")}
                            </div>

                            <button
                                onClick={() => setIsEditingTier(true)}
                                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                                aria-label="Edit tier"
                            >
                                <FiEdit2 className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-3xl text-[var(--royal-blue)] ml-120 mt-7">
                        {socialLinks.map(({ url, icon, label }) => (
                            <SocialIcon 
                                key={label}
                                url={url}
                                icon={icon}
                                label={label}
                                onSave={(newValue) => onSaveField(label, newValue)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-4 bg-[var(--soft-lavender)] mt-2 mx-5"></div>
        </div>
    );
};

export default CompanyHeader;