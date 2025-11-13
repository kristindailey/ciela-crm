import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import type { Interaction } from "../types/interaction";
import AddInteractionModal from "./AddInteractionModal";
import InteractionCard from "./InteractionCard";

interface OutreachHistoryProps {
    label: string;
    contactId: string;
    onInteractionAdded?: (interaction: any) => void;
}

const OutreachHistory = ({ label, contactId, onInteractionAdded }: OutreachHistoryProps) => {
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingInteraction, setEditingInteration] = useState<Interaction | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
                <div className="flex justify-end mb-3">
                    <button 
                        onClick={() => setAddModalOpen(!isAddModalOpen)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] drop-shadow-sm transition-colors duration-150 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)]"
                    >
                        <FaPlus size={14} />
                    </button>
                </div>

                {error && (
                    <div className="text-red-600 text-sm mb-2">{error}</div>
                )}

                {isLoading ? (
                    <div className="flex justify-center text-gray-500 text-sm">Loading...</div>
                ) : interactions.length === 0 ? (
                    <div className="flex justify-center text-gray-500 text-sm">No interactions yet.</div>
                ) : (
                    interactions.map((interaction) => (
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
                <AddInteractionModal 
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
                            onInteractionAdded?.(updatedInteraction);
                        }
                        setAddModalOpen(false);
                        setEditingInteration(null);
                    }}
                />
            }
        </div>
    );
};

export default OutreachHistory;