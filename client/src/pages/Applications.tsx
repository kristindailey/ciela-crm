import { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../components/PageHeader";
import TierTabs from "../components/TierTabs";

const Applications = () => {
    const [searchQuery, _setSearchQuery] = useState("");
    const [activeTier, setActiveTier] = useState("TIER_1");
    const tiers = ["TIER_1", "TIER_2", "TIER_3", "BACKLOG", "ALL"];
	const navigate = useNavigate();

	const handleAddApplication = () => {
        navigate("/applications/new");
    };

    const handleTierChange = (tier: string) => {
        setActiveTier(tier);
    };

    return (
        <>
			<PageHeader 
            	title="applications"
            	searchValue={searchQuery}
            	searchPlaceholder="Search applications..."
            	onSearchChange={() => {}}
            	onAddClick={handleAddApplication}
            	onUploadClick={() => {}}
        	/>

        	<TierTabs 
            	tiers={tiers}
            	activeTier={activeTier}
            	onTierChange={handleTierChange}
        	/>
        </>
    );
};

export default Applications;