import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useAuth } from "../context/AuthContext";
import InfoPill from "../components/InfoPill";
import List from "../components/List";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import StyledTooltip from "../components/StyledTooltip";

const Dashboard = () => {
	const [tier1Count, setTier1Count] = useState<number | undefined>(undefined);
	const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
	const [weekOverWeek, setWeekOverWeek] = useState<string | undefined>(undefined);
	const [priorities, setPriorities] = useState<Array<{ id?: string; text: string, position: number }>>([]);
	const [wins, setWins] = useState<Array<{ id?: string; text: string }>>([]);
	const [companiesByTier, setCompaniesByTier] = useState<Array<{ tier: string, _count: { tier: number } }>>([]);
	const [interactionsByTier, setInteractionsByTier] = useState<Record<string, number>>({});
	const [topCompanies, setTopCompanies] = useState<Array<{ id: string; name: string; interactionCount: number; }>>([]);
	const [topContacts, setTopContacts] = useState<Array<{ id: string; name: string; interactionCount: number; }>>([]);
	const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
	const [isLoadingPriorities, setIsLoadingPriorities] = useState(true);
	const [isLoadingWins, setIsLoadingWins] = useState(true);
	const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
	const [showClearModal, setShowClearModal] = useState(false);
	const [clearTarget, setClearTarget] = useState<"priorities" | "wins" | null>(null);
	const { isLoading } = useAuth();
	const navigate = useNavigate();
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const colors = ["var(--royal-blue)", "var(--soft-lavender)", "var(--cream-moon)", "var(--blush-pink)"];

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
				const positionedPriorities = [1, 2, 3].map((position) => {
					const existing = prioritiesData.find((p: any) => p.position === position);
					return existing || { position, text: "" };
				});
				setPriorities(positionedPriorities);
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

	const fetchAnalytics = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/analytics`, {
				credentials: "include",
			});

			if (response.ok) {
				const data = await response.json();
				setCompaniesByTier(data.companiesByTier);
				setInteractionsByTier(data.interactionsByTier);
				setTopCompanies(data.topCompanies);
				setTopContacts(data.topContacts);
			}
		} catch (error) {
			console.error("Error fetching analytics:", error);
		} finally {
			setIsLoadingAnalytics(false);
		}
	};

	const handleCreatePriority = async (text: string, position?: number) => {
		const tempId = `temp-${Date.now()}`;
		setPriorities((prev) => prev.map((p) => p.position === position ? { ...p, id: tempId, text } : p));

		try {
			const response = await fetch(`${API_BASE_URL}/priorities`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text, position }),
				credentials: "include",
			});

			if (response.ok) {
				const newPriority = await response.json();
				setPriorities((prev) => prev.map((p) => p.position === position ? newPriority : p));
			}
		} catch (error) {
			console.error("Error creating priority:", error);
			setPriorities((prev) => prev.map((p) => p.position === position ? { position, text: "" } : p));
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
		const priorityToDelete = priorities.find((p) => p.id === id);
		if (!priorityToDelete) return;

		setPriorities((prev) => prev.map((p) => p.id === id ? { position: priorityToDelete.position, text: "" } : p));

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

			setPriorities([
				{ position: 1, text: ""},
				{ position: 2, text: ""},
				{ position: 3, text: ""},
			]);
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

	const getTierChartData = () => {
		const tierOrder = ["TIER_1", "TIER_2", "TIER_3", "BACKLOG"];

		return tierOrder.map((tier) => {
			const found = companiesByTier.find((item) => item.tier === tier);
			return {
				tier: tier.replace("TIER_", "Tier ").replace("BACKLOG", "Backlog"),
				count: found?._count.tier || 0,
			};
		});
	};

	const getInteractionsChartData = () => {
		const tierOrder = ["TIER_1", "TIER_2", "TIER_3", "BACKLOG"];

		return tierOrder.map((tier) => {
			return {
				tier: tier.replace("TIER_", "Tier ").replace("BACKLOG", "Backlog"),
				count: interactionsByTier[tier] || 0,
			};
		});
	};

	useEffect(() => {
		fetchDashboardMetrics();
		fetchPriorities();
		fetchWins();
		fetchAnalytics();
	}, []);
 
	return (
		<>
			<h1 className="text-[var(--royal-blue)] font-pacifico text-3xl mt-20 ml-5 mb-2">this week</h1>

			<hr className="border-[var(--royal-blue)] border-2 ml-5 mr-5" />
                
			<div className="grid grid-cols-3 gap-6 px-5 mt-5 text-center font-inter font-medium text-lg">
				<InfoPill
					label="Tier 1 Interactions"
                    value={tier1Count?.toString()}
                    placeholder={isLoadingMetrics ? "Loading..." : "No data yet"}
                    onSave={() => {}}
                    readOnly={true}
					bgColor="bg-[var(--soft-lavender)]"
				/>

				<InfoPill
					label="Total Interactions"
                    value={totalCount?.toString()}
                    placeholder={isLoadingMetrics ? "Loading..." : "No data yet"}
                    onSave={() => {}}
                    readOnly={true}
					bgColor="bg-[var(--cream-moon)]"
				/>

				<InfoPill
					label="Week-Over-Week Comparison"
                    value={weekOverWeek}
                    placeholder={isLoadingMetrics ? "Loading..." : "No data yet"}
                    onSave={() => {}}
                    readOnly={true}
					bgColor="bg-[var(--blush-pink)]"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 mt-5 font-inter">
				<List
					title="This Week's Priorities"
					items={priorities}
					itemPlaceholder="Add new priority..."
					isLoading={isLoadingPriorities}
					scrollable={false}
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
					minRows={3}
					itemPlaceholder="Add new win..."
					isLoading={isLoadingWins}
					scrollable={true}
					onCreate={handleCreateWin}
					onChange={handleUpdateWin}
					onDelete={handleDeleteWin}
					onClearAll={() => {
						setClearTarget("wins");
						setShowClearModal(true);
					}}
				/>
			</div>

			<div className="mt-5 mb-5">
				<h2 className="text-[var(--royal-blue)] font-pacifico text-3xl ml-5 mb-4">analytics</h2>
				<hr className="border-[var(--royal-blue)] border-2 ml-5 mr-5 mb-5" />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-5 mr-5 font-inter">
					<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[300px]">
						<h3 className="font-inter font-semibold text-lg mb-4 text-gray-500">Company Count by Tier</h3>

						{isLoadingAnalytics ? (
							<div className="flex items-center justify-center h-[200px]">
								<p className="text-medium font-semibold text-[var(--royal-blue)]">Loading chart...</p>
							</div>
						) : (
							<ResponsiveContainer width="100%" height={200}>
								<BarChart data={getTierChartData()}>
									<XAxis dataKey="tier" tickLine={false} />
									<YAxis allowDecimals={false} tickLine={false} />
									<StyledTooltip />
									<Bar dataKey="count">
										{getTierChartData().map((_, index) => (
											<Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						)}
					</div>

					<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[300px]">
						<h3 className="font-inter font-semibold text-lg mb-4 text-gray-500">Interaction Count by Tier</h3>

						{isLoadingAnalytics ? (
							<div className="flex items-center justify-center h-[200px]">
								<p className="text-medium font-semibold text-[var(--royal-blue)]">Loading chart...</p>
							</div>
						) : (
							<ResponsiveContainer width="100%" height={200}>
								<BarChart data={getInteractionsChartData()}>
									<XAxis dataKey="tier" tickLine={false} />
									<YAxis allowDecimals={false} tickLine={false} />
									<StyledTooltip />
									<Bar dataKey="count">
										{getInteractionsChartData().map((_, index) => (
											<Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						)}
					</div>
				
					<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[300px]">
						<h3 className="font-inter font-semibold text-lg mb-4 text-gray-500">Top Companies by Interactions</h3>

						{isLoadingAnalytics || topContacts.length === 0 ? (
							<div className="flex items-center justify-center h-[200px]">
								<p className="text-medium font-semibold text-[var(--royal-blue)]">
									{isLoadingAnalytics ? "Loading chart..." : "No interaction data yet."}
								</p>
							</div>
						) : (
							<ResponsiveContainer width="100%" height={200}>
								<BarChart data={topCompanies} layout="vertical">
									<XAxis type="number" allowDecimals={false} tickLine={false} />
									<YAxis 
										type="category"
										dataKey="name"
										width={65}
										tick={{ cursor: "pointer" }}
										tickLine={false}
										onClick={(data) => {
											if (data && data.value) {
												const company = topCompanies.find((company) => company.name === data.value);
												if (company) navigate(`/companies/${company.id}`);
											}
										}}
									/>
									<StyledTooltip />
									<Bar dataKey="interactionCount">
										{topCompanies.map((_, index) => (
											<Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						)}
					</div>

					<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[300px]">
						<h3 className="font-inter font-semibold text-lg mb-4 text-gray-500">Top Contacts by Interactions</h3>

						{isLoadingAnalytics || topContacts.length === 0 ? (
							<div className="flex items-center justify-center h-[200px]">
								<p className="text-medium font-semibold text-[var(--royal-blue)]">
									{isLoadingAnalytics ? "Loading chart..." : "No interaction data yet."}
								</p>
							</div>
						) : (
							<ResponsiveContainer width="100%" height={200}>
								<BarChart data={topContacts} layout="vertical">
									<XAxis type="number" allowDecimals={false} tickLine={false} />
									<YAxis 
										type="category"
										dataKey="name"
										width={65}
										tick={{ cursor: "pointer" }}
										tickLine={false}
										onClick={(data) => {
											if (data && data.value) {
												const contact = topContacts.find((contact) => contact.name === data.value);
												if (contact) navigate(`/contacts/${contact.id}`);
											}
										}}
									/>
									<StyledTooltip />
									<Bar dataKey="interactionCount">
										{topContacts.map((_, index) => (
											<Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						)}
					</div>
				</div>
			</div>

			<DeleteConfirmationModal
				isOpen={showClearModal}
                itemName={clearTarget === "priorities" ? "all priorities" : "all wins"}
                itemType={clearTarget === "priorities" ? "Priorities" : "Wins"}
                onClose={() => {
					setShowClearModal(false);
					setClearTarget(null);
				}}
                onConfirm={() => {
                    if (clearTarget === "priorities") {
						handleClearAllPriorities();
					} else if (clearTarget === "wins") {
						handleClearAllWins();
					}
                }}
			/>
		</>
	);
};

export default Dashboard;