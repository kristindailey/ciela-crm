import { useState, useRef, useCallback, useEffect } from "react";
import type { Company } from "../types/company";
import { BsBriefcase, BsThreeDotsVertical } from "react-icons/bs";
import { RiBlueskyLine } from "react-icons/ri";
import { FiGithub, FiEdit2 } from "react-icons/fi";
import { CiLinkedin } from "react-icons/ci";
import { IoIosLink } from "react-icons/io";
import { IoImageOutline } from "react-icons/io5";
import Icon from "./Icon";
import BlindIcon from "../icons/BlindIcon";
import GlassdoorIcon from "../icons/GlassdoorIcon";
import DropdownMenu from "./DropdownMenu";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface CompanyHeaderProps {
    company: Company;
    onCompanyUpdate: (updatedCompany: Company) => void;
    onSaveField: (field: string, newValue: string) => Promise<void>;
    onDelete: () => void;
}

const CompanyHeader = ({ company, onCompanyUpdate, onSaveField, onDelete }: CompanyHeaderProps) => {
    const [_selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [nameValue, setNameValue] = useState(company.name);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingTier, setIsEditingTier] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const iconLinks = [
        { url: company.careersPage, icon: BsBriefcase, label: "careersPage" },
        { url: company.website, icon: IoIosLink, label: "website" },
        { url: company.glassdoor, icon: GlassdoorIcon, label: "glassdoor" },
        { url: company.blind, icon: BlindIcon, label: "blind" },
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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        if (file) {
            setSelectedFile(file);

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            const cloudinaryUrl = await uploadToCloudinary(file);

            if (cloudinaryUrl) {
                try {
                    const response = await fetch(`${API_BASE_URL}/companies/${company.id}`, {
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
            const response = await fetch(`${API_BASE_URL}/companies/${company.id}`, {
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

    const handleSaveName = async () => {
        if (nameValue !== company.name) {
            try {
                const response = await fetch(`${API_BASE_URL}/companies/${company.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: nameValue }),
                    credentials: "include",
                });

                if (response.ok) {
                    const updatedCompany = await response.json();
                    onCompanyUpdate(updatedCompany);
                }
            } catch (error) {
                console.error("Failed to save company name:", error);
            }
        }

        setIsEditingName(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isDropdownOpen]);

    return (
        <div className="flex items-end w-full mt-20 px-5">
            <div className="flex items-end gap-6 font-inter">
                {isEditingName ? (
                    <input 
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveName();
                            if (e.key === "Escape") {
                                setNameValue(company.name);
                                setIsEditingName(false);
                            }
                        }} 
                        className="text-[var(--heading)] font-extrabold text-3xl bg-transparent focus:outline-none focus:border-b-2 focus:border-[var(--lavender)]"
                        style={{ width: `${nameValue.length * 0.6}em` }}
                        autoFocus
                    />
                ) : (
                    <h1 className="relative group text-[var(--heading)] font-extrabold text-3xl">
                        {company.name}
                        <button
                            onClick={() => setIsEditingName(true)}
                            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-card border border-card-border rounded-full text-muted hover:bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Edit company name"
                        >
                            <FiEdit2 className="w-3 h-3"/>
                        </button>    
                    </h1>
                )}

                <div>
                    <div 
                        onClick={handleLogoClick}
                        className="relative group cursor-pointer"
                    >
                        {(previewUrl || company.logoUrl) ? (                            
                            <img 
                                src={previewUrl || company.logoUrl} 
                                alt="Company logo"
                                className="h-15 object-contain" 
                            />
                        ) : (
                            <div
                                className="w-13 h-13 rounded-full bg-gray-200 border border-dashed border-input-border flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <IoImageOutline className="text-2xl"/>
                            </div>
                        )}
                        
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLogoClick();
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-card border border-card-border rounded-full text-muted hover:bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Edit logo"
                        >
                            <FiEdit2 className="w-3 h-3"/> 
                        </button>
                    </div>

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
                        className="h-10 px-6 rounded-full bg-[var(--sidebar)] text-[var(--lavender)] text-lg font-bold ml-8 border-2 border-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                        autoFocus
                    >
                        <option value="TIER_1">tier 1</option>
                        <option value="TIER_2">tier 2</option>
                        <option value="TIER_3">tier 3</option>
                        <option value="BACKLOG">backlog</option>
                    </select>
                ) : (
                    <div className="relative group inline-block">
                        <div className="inline-flex h-10 px-6 items-center justify-center rounded-full bg-[var(--sidebar)] text-[var(--lavender)] text-lg font-bold">
                            {company.tier.toLowerCase().replace("_", " ")}
                        </div>

                        <button
                            onClick={() => setIsEditingTier(true)}
                            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-card border border-card-border rounded-full text-muted hover:bg-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Edit tier"
                        >
                            <FiEdit2 className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 text-2xl text-[var(--heading)] ml-auto">
                {iconLinks.map(({ url, icon, label }) => (
                    <Icon 
                        key={label}
                        url={url}
                        icon={icon}
                        label={label}
                        onSave={(newValue) => onSaveField(label, newValue)}
                    />
                ))}
            </div>
            
            <div className="relative" ref={dropdownRef}>
                <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-300 hover:bg-gray-400 text-muted hover:text-gray-50 shadow-md transition-colors ml-10"
                >
                    <BsThreeDotsVertical size={22} />
                </div>

                {isDropdownOpen && 
                    <DropdownMenu 
                        itemType="Company" 
                        onDeleteClick={() => {
                            setIsDeleteModalOpen(true);
                            setIsDropdownOpen(false);
                        }} 
                    />
                }
            </div>

            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                itemName={company.name}
                itemType="Company"
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    onDelete();
                    setIsDeleteModalOpen(false);
                }}
            />
        </div>
    );
};

export default CompanyHeader;