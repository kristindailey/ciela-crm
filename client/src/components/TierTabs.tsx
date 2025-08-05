interface TierTabsProps {
    tiers: string[];
    activeTier: string;
    onTierChange: (tier: string) => void;
}

const TierTabs = ({ tiers, activeTier, onTierChange }: TierTabsProps) => {
    const formatTierName = (tier: string) => {
        if (tier === "ALL") {
            return "all";
        }

        if (tier === "BACKLOG") {
            return "backlog";
        }

        return tier.toLowerCase().replace("tier_", "tier ");
    };

    return (
        <div className="bg-[var(--royal-blue)] mx-5 mt-5 mb-4">
            <div className="flex">
                {tiers.map((tier) => (
                    <button
                        key={tier}
                        onClick={() => onTierChange(tier)}
                        className={`flex-1 py-2 px-4 text-center font-pacifico text-2xl transition-colors text-[var(--soft-lavender)] relative ${
                            activeTier === tier
                                ? "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[5px] after:bg-[var(--soft-lavender)] after:-mb-2"
                                : "hover:bg-white/10"
                        }`}
                    >
                        {formatTierName(tier)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TierTabs;