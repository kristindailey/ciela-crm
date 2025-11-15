import { useState, useRef, useEffect,  useMemo } from "react";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import type { Interaction } from "../types/interaction";
import InteractionModal from "./InteractionModal";
import InteractionCard from "./InteractionCard";

interface OutreachHistoryProps {
    label: string;
    contactId: string;
    searchValue: string;
    searchPlaceholder: string;
    onSearchChange: (value: string) => void;
    onInteractionAdded?: (interaction: any) => void;
}

const OutreachHistory = ({ label, contactId, searchValue, searchPlaceholder, onSearchChange, onInteractionAdded }: OutreachHistoryProps) => {
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingInteraction, setEditingInteration] = useState<Interaction | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const filteredInteractions = useMemo(() => {
        if (searchValue === "") {
            return interactions;
        }
    
        return interactions.filter((interaction) => {
            const searchLower = searchValue.toLowerCase();

            return (
                interaction.type.toLowerCase().includes(searchLower) ||
                interaction.subject?.toLowerCase().includes(searchLower) ||
                interaction.message.toLowerCase().includes(searchLower)
            );
        });
    }, [interactions, searchValue]);

    useEffect(() => {
        const fetchInteractions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/interactions/${contactId}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch interactions.");
                }

                const data = await response.json();
                setInteractions(data);
            } catch (error) {
                console.error("Error fetching interactions:", error);
                setError("Failed to load interactions.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInteractions();
    }, [contactId, API_BASE_URL]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setAddModalOpen(false);
            }
        };
    
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setAddModalOpen(false);
            }
        };
    
        if (isAddModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }
    }, [isAddModalOpen]);

    return (
        <div>
            <label className="font-inter text-sm text-gray-600 block">{label}</label>

            <div className="bg-white rounded-xl shadow-md p-4 h-70 w-full overflow-y-auto">
                <div className="flex items-center gap-3 mt-1 mb-4">
                    <div className="relative flex-1">
                        <input 
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder} 
                            className="pl-9 py-1 w-full border border-2 border-[var(--royal-blue)] rounded-full text-black"
                        />
                
                        <div className="absolute left-3 top-1/2 translate -translate-y-1/2">
                            <FaMagnifyingGlass className="text-[var(--royal-blue)]"/>
                        </div>
                    </div>

                    <button 
                        onClick={() => setAddModalOpen(!isAddModalOpen)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] drop-shadow-sm transition-colors duration-150 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] ml-auto"
                    >
                        <FaPlus size={16} />
                    </button>
                </div>

                {error && (
                    <div className="text-red-600 text-sm mb-2">{error}</div>
                )}

                {isLoading ? (
                    <div className="flex justify-center text-gray-500 text-sm">Loading...</div>
                ) : filteredInteractions.length === 0 ? (
                    <div className="flex justify-center text-gray-500 text-sm">
                        {searchValue ? "No interactions found matching your search." : "No interactions yet."}
                    </div>
                ) : (
                    filteredInteractions.map((interaction) => (
                        <InteractionCard 
                            key={interaction.id} 
                            interaction={interaction} 
                            onEdit={(interaction) => {
                                setEditingInteration(interaction);
                            }}
                        />
                    ))
                )}
            </div>

            {(isAddModalOpen || editingInteraction) &&
                <InteractionModal 
                    isOpen={isAddModalOpen || !!editingInteraction}
                    contactId={contactId}
                    editingInteraction={editingInteraction}
                    onClose={() => {
                        setAddModalOpen(false);
                        setEditingInteration(null);
                    }}
                    onConfirm={(updatedInteraction) => {
                        if (updatedInteraction.deleted) {
                            setInteractions((prev) => prev.filter((interaction) => interaction.id !== updatedInteraction.id));
                        } else {
                            setInteractions((prev) => {
                            const filtered = editingInteraction
                                ? prev.filter((interaction) => interaction.id !== updatedInteraction.id)
                                : prev;

                            return [...filtered, updatedInteraction]
                                .sort((a, b) => new Date(b.interactionDate).getTime() - new Date(a.interactionDate).getTime());
                            });
                        }
                        onInteractionAdded?.(updatedInteraction);
                        setAddModalOpen(false);
                        setEditingInteration(null);
                    }}
                />
            }
        </div>
    );
};

export default OutreachHistory;