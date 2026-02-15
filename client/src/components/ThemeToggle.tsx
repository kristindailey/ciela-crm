import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
	className?: string;
	showLabel?: boolean;
}

const ThemeToggle = ({ className = "flex items-center pt-7 text-sidebar-text hover:text-white", showLabel = true}: ThemeToggleProps) => {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			onClick={toggleTheme}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			className={className}
		>
			{isDark ? <Sun className="text-xl mr-0 sm:mr-2" /> : <Moon className="text-xl mr-0 sm:mr-2" />}
			
			{showLabel && (
				<span className="hidden sm:block md:block">{isDark ? "Light" : "Dark"}</span>
			)}
		</button>
	);
};

export default ThemeToggle;