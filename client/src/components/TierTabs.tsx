import TabBar from "./TabBar";

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
        <TabBar
            tabs={tiers.map((tier) => ({
                value: tier,
                label: formatTierName(tier)
            }))}
            activeTab={activeTier}
            onTabChange={onTierChange}
        />
    );
};

export default TierTabs;