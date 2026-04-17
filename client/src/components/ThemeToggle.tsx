import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			onClick={toggleTheme}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			className="flex items-center pt-7 text-sidebar-text hover:text-white"
		>
			{isDark ? <Sun className="text-xl mr-0 sm:mr-2" /> : <Moon className="text-xl mr-0 sm:mr-2" />}
			<span className="hidden sm:block md:block">{isDark ? "Light" : "Dark"}</span>
		</button>
	);
};

export default ThemeToggle;