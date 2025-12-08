import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import InfoPill from "../components/InfoPill";
import List from "../components/List";

const Dashboard = () => {
	const [tier1Count, setTier1Count] = useState<number | undefined>(undefined);
	const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
	const [weekOverWeek, setWeekOverWeek] = useState<string | undefined>(undefined);
	const [priorities, setPriorities] = useState<Array<{ id?: string; text: string }>>([]);
	const [wins, setWins] = useState<Array<{ id?: string; text: string }>>([]);
	const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
	const [isLoadingPriorities, setIsLoadingPriorities] = useState(true);
	const [isLoadingWins, setIsLoadingWins] = useState(true);
	const [showClearModal, setShowClearModal] = useState(false);
	const [clearTarget, setClearTarget] = useState<"priorities" | "wins" | null>(null);
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
				`${API_BASE_URL}/dashboard/metrics?` +
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
		} finally {
			setIsLoadingMetrics(false);
		}
	};

	const fetchPriorities = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/priorities`, {
				credentials: "include",
			});

			if (response.ok) {
				const prioritiesData = await response.json();
				setPriorities(prioritiesData);
			}
		} catch (error) {
			console.error("Error fetching priorities:", error);
		} finally {
			setIsLoadingPriorities(false);
		}
	};

	const fetchWins = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/wins`, {
				credentials: "include",
			});

			if (response.ok) {
				const winsData = await response.json();
				setWins(winsData);
			}
		} catch (error) {
			console.error("Error fetching wins:", error);
		} finally {
			setIsLoadingWins(false);
		}
	};

	const handleCreatePriority = async (text: string) => {
		const tempId = `temp-${Date.now()}`;
		setPriorities((prev) => [...prev, { id: tempId, text} ]);

		try {
			const response = await fetch(`${API_BASE_URL}/priorities`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text }),
				credentials: "include",
			});

			if (response.ok) {
				const newPriority = await response.json();
				setPriorities((prev) => prev.map((p) => p.id === tempId ? newPriority : p));
			}
		} catch (error) {
			console.error("Error creating priority:", error);
			setPriorities((prev) => prev.filter((p) => p.id !== tempId));
		}
	};

	const handleUpdatePriority = async (id: string, text: string) => {
		setPriorities((prev) => prev.map((p) => p.id === id ? { ...p, text } : p));

		try {
			await fetch(`${API_BASE_URL}/priorities/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text }),
				credentials: "include",
			});
		} catch (error) {
			console.error("Error updating priority:", error);
		}
	};

	const handleDeletePriority = async (id: string) => {
		setPriorities(prev => prev.filter(p => p.id !== id));

		try {
			const response = await fetch(`${API_BASE_URL}/priorities/${id}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
                throw new Error("Failed to delete priority.");
            }
		} catch (error) {
			console.error("Error deleting priority:", error);
		}
	};

	const handleClearAllPriorities = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/priorities`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to clear priorities.");
			}

			setPriorities([]);
			setShowClearModal(false);
			setClearTarget(null);
		} catch (error) {
			console.error("Error clearing priorities:", error);
		}
	};

	const handleCreateWin = async (text: string) => {
		const tempId = `temp-${Date.now()}`;
		setWins((prev) => [...prev, { id: tempId, text} ]);

		try {
			const response = await fetch(`${API_BASE_URL}/wins`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text }),
				credentials: "include",
			});

			if (response.ok) {
				const newWin = await response.json();
				setWins((prev) => prev.map((win) => win.id === tempId ? newWin : win));
			}
		} catch (error) {
			console.error("Error creating win:", error);
			setWins((prev) => prev.filter((win) => win.id !== tempId));
		}
	};

	const handleUpdateWin = async (id: string, text: string) => {
		setWins((prev) => prev.map((win) => win.id === id ? { ...win, text } : win));

		try {
			await fetch(`${API_BASE_URL}/wins/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text }),
				credentials: "include",
			});
		} catch (error) {
			console.error("Error updating win:", error);
		}
	};

	const handleDeleteWin = async (id: string) => {
		setWins(prev => prev.filter(w => w.id !== id));

		try {
			const response = await fetch(`${API_BASE_URL}/wins/${id}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
                throw new Error("Failed to delete win.");
            }
		} catch (error) {
			console.error("Error deleting win:", error);
		}
	};

	const handleClearAllWins = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/wins`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to clear wins.");
			}

			setWins([]);
			setShowClearModal(false);
			setClearTarget(null);
		} catch (error) {
			console.error("Error clearing wins:", error);
		}
	};
	
	useEffect(() => {
		fetchDashboardMetrics();
		fetchPriorities();
		fetchWins();
	}, []);
 
	return (
		<>
			<h1 className="text-[var(--royal-blue)] font-pacifico text-4xl mt-20 ml-5 mb-2">this week</h1>

			<hr className="border-[var(--royal-blue)] border-2 ml-5 mr-5"/>
                
			<div className="grid grid-cols-3 gap-6 px-5 mt-5 text-center font-inter font-medium text-lg">
				<InfoPill
					label="Tier 1 Interactions"
                    value={tier1Count?.toString()}
                    placeholder={isLoadingMetrics ? "Loading..." : "No data yet"}
                    onSave={() => {}}
                    readOnly={true}
				/>

				<InfoPill
					label="Total Interactions"
                    value={totalCount?.toString()}
                    placeholder={isLoadingMetrics ? "Loading..." : "No data yet"}
                    onSave={() => {}}
                    readOnly={true}
				/>

				<InfoPill
					label="Week-Over-Week Comparison"
                    value={weekOverWeek}
                    placeholder={isLoadingMetrics ? "Loading..." : "No data yet"}
                    onSave={() => {}}
                    readOnly={true}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 mt-5 font-inter">
				<List
					title="This Week's Priorities"
					items={priorities}
					maxItems={3}
					onCreate={handleCreatePriority}
					onChange={handleUpdatePriority}
					onDelete={handleDeletePriority}
					onClearAll={() => {
						setClearTarget("priorities");
						setShowClearModal(true);
					}}
				/>

				<List
					title="This Week's Wins"
					items={wins}
					onCreate={handleCreateWin}
					onChange={handleUpdateWin}
					onDelete={handleDeleteWin}
					onClearAll={() => {
						setClearTarget("wins");
						setShowClearModal(true);
					}}
				/>
			</div>
		</>
	);
};

export default Dashboard;