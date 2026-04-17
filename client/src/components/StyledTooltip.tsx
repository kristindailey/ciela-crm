import { Tooltip } from "recharts";

const StyledTooltip = () => {
	return (
		<Tooltip
			contentStyle={{ 
				backgroundColor: "var(--card)",
				border: "1px solid var(--card-border)",
				borderRadius: "8px",
				padding: "8px 12px",
				boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
			}}
			labelStyle={{
				color: "var(--primary)",
				fontWeight: "600",
				marginBottom: "4px"
			}}
			itemStyle={{
				color: "var(--muted)",
				fontSize: "14px"
			}}
			cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
			formatter={(value) => [`${value}`, "Count"]}
		/>
	);
};

export default StyledTooltip;