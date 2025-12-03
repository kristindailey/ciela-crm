import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import InfoPill from "../components/InfoPill";

const Dashboard = () => {
	const [tier1Count, setTier1Count] = useState<number | undefined>(undefined);
	const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
	const [weekOverWeek, setWeekOverWeek] = useState<number | undefined>(undefined);
	const { isLoading } = useAuth();
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

	return (
		<>
			<h1 className="text-[var(--royal-blue)] font-pacifico text-5xl mt-20 ml-5 mb-4">home</h1>
                
			<div className="grid grid-cols-3 gap-6 px-5 mt-5">
				<InfoPill
					label="Tier 1 Interactions"
                    value={undefined}
                    placeholder="No data yet"
                    onSave={() => {}}
                    readOnly={true}
				/>

				<InfoPill
					label="Total Interactions"
                    value={undefined}
                    placeholder="No data yet"
                    onSave={() => {}}
                    readOnly={true}
				/>

				<InfoPill
					label="Week-Over-Week Comparison"
                    value={undefined}
                    placeholder="No data yet"
                    onSave={() => {}}
                    readOnly={true}
				/>
			</div>
		</>
	);
};

export default Dashboard;