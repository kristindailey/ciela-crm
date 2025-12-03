import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import InfoPill from "../components/InfoPill";

const Dashboard = () => {
	const [tier1Count, setTier1Count] = useState<number | undefined>(undefined);
	const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
	const [weekOverWeek, setWeekOverWeek] = useState<string | undefined>(undefined);
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

	const getCurrentWeekRange = () => {
		const now = new Date();
		const dayOfWeek = now.getUTCDay();
		const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

		const monday = new Date(now);
		monday.setUTCDate(now.getUTCDate() + diffToMonday);
		monday.setUTCHours(0, 0, 0, 0);

		const sunday = new Date(monday);
		sunday.setUTCDate(monday.getUTCDate() + 6);
		sunday.setUTCHours(23, 59, 59, 999);

		return { start: monday, end: sunday };
	};

	const getPreviousWeekRange = () => {
		const { start } = getCurrentWeekRange();
		const prevMonday = new Date(start);
		prevMonday.setUTCDate(start.getUTCDate() - 7);

		const prevSunday = new Date(prevMonday);
		prevSunday.setUTCDate(prevMonday.getUTCDate() + 6);
		prevSunday.setUTCHours(23, 59, 59, 999);

		return { start: prevMonday, end: prevSunday };
	};

	const fetchDashboardMetrics = async () => {
		try {
			const currentWeek = getCurrentWeekRange();
			const previousWeek = getPreviousWeekRange();

			const response = await fetch(
				`${API_BASE_URL}/dashboard?` +
				`currentStart=${currentWeek.start.toISOString()}&` +
				`currentEnd=${currentWeek.end.toISOString()}&` +
				`previousStart=${previousWeek.start.toISOString()}&` +
				`previousEnd=${previousWeek.end.toISOString()}`,
				{ credentials: "include" },
			);

			if (response.ok) {
				const data = await response.json();
				setTier1Count(data.tier1Count);
				setTotalCount(data.currentWeekTotal);

				const diff = data.currentWeekTotal - data.previousWeekTotal;
				setWeekOverWeek(diff >= 0 ? `+${diff} vs. last week` : `${diff} vs. last week`);
			}
		} catch (error) {
			console.error("Error fetching dashboard metrics:", error);
		}
	};
	
	useEffect(() => {
		fetchDashboardMetrics();
	}, []);
 
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