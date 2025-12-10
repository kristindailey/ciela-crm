import { Tooltip } from "recharts";

const StyledTooltip = () => {
	return (
		<Tooltip
			contentStyle={{ 
				backgroundColor: "white",
				border: "1px solid #e5e7eb",
				borderRadius: "8px",
				padding: "8px 12px",
				boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
			}}
			labelStyle={{
				color: "#374151",
				fontWeight: "600",
				marginBottom: "4px"
			}}
			itemStyle={{
				color: "#6b7280",
				fontSize: "14px"
			}}
			cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
			formatter={(value) => [`${value}`, "Count"]}
		/>
	);
};

export default StyledTooltip;