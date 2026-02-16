import { Link } from "react-router";
import logo from "../assets/ciela-logo.png";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col bg-app text-primary font-inter">
			<nav className="flex justify-between sticky top-0 z-10 bg-sidebar w-full h-20 px-4">
				<Link 
					to="/" 
					className="flex items-center"
				>
					<img src={logo} alt="Ciela CRM logo" className="h-30 w-auto" />
				</Link>

				<div className="flex items-center gap-2 sm:gap-4">
					<ThemeToggle 
						className="text-sidebar-text hover:text-white transition-colors p-2"
						showLabel={false}
					/>

					<Link
						to="/login"
						className="text-primary bg-cancel hover:bg-cancel-hover text-sm font-medium px-4 py-2 rounded-lg transition-colors"
					>
						Sign In
					</Link>

					<Link
						to="/register"
						className="bg-lavender text-heading hover:bg-input-dropdown hover:text-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors"
					>
						Sign Up
					</Link>
				</div>
			</nav>

			<main>
				<section className="max-w-6xl mx-auto px-6 py-16 md:py-24">

				</section>

				<section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
					
				</section>

				<section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
					
				</section>
			</main>

			<footer>

			</footer>
        </div>
    );
};

export default Home;