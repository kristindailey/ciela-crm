interface Tab {
    value: string;
	label: string;
}

interface TabBarProps {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (tab: string) => void;
}

const TabBar = ({ tabs, activeTab, onTabChange }: TabBarProps) => {
	return (
		<div className="bg-[var(--royal-blue)] mx-5 mt-2 mb-6">
			<div className="flex">
				{tabs.map((tab) => (
					<button
						key={tab.value}
						onClick={() => onTabChange(tab.value)}
						className={`flex-1 py-2 px-4 text-center font-pacifico text-2xl transition-colors text-[var(--soft-lavender)] relative ${
                            activeTab === tab.value
							? "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[5px] after:bg-[var(--soft-lavender)] after:-mb-2"
							: "hover:bg-white/10"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>
		</div>
	);
};

export default TabBar;