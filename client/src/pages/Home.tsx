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
						className="bg-lavender text-heading hover:text-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors"
					>
						Sign Up
					</Link>
				</div>
			</nav>

			<main>
				<section className="max-w-6xl mx-auto px-6 py-12 md:py-20">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
						<div className="text-center md:text-left">
							<h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-heading tracking-tight">
								Your network is your next opportunity.
							</h1>

							<p className="mt-6 text-lg md:text-xl text-muted leading-relaxed max-w-xl mx-auto md:mx-0">
								Ciela is built for job seekers. Track the contacts and companies that matter, and turn every conversation into a step forward.
							</p>
						</div>

						<div className="bg-card border border-card-border rounded-2xl shadow-xl p-6 md:p-8">
							<h2 className="font-pacifico text-script text-2xl mb-2">this week</h2>
							<hr className="border-divider border-2 mb-5" />

							<dl className="grid grid-cols-3 gap-3 text-center font-inter mb-6">
								<div className="flex flex-col justify-center bg-lavender rounded-lg py-4 px-2">
									<dd className="text-2xl font-semibold text-heading">107</dd>
									<dt className="text-xs text-heading mt-1">Tier 1 Interactions</dt>
								</div>

								<div className="flex flex-col justify-center bg-cream rounded-lg py-4 px-2">
									<dd className="text-2xl font-semibold text-heading">233</dd>
									<dt className="text-xs text-heading mt-1">Total Interactions</dt>
								</div>

								<div className="flex flex-col justify-center bg-blush rounded-lg py-4 px-2">
									<dd className="text-2xl font-semibold text-heading">+15%</dd>
									<dt className="text-xs text-heading mt-1">Week-Over-Week Comparison</dt>
								</div>
							</dl>

							<div>
								<h3 className="font-semibold text-sm text-heading mb-3">This Week's Priorities</h3>
								<ul className="space-y-2">
									<li className="flex items-center gap-2">
										<div className="flex-1 px-3 py-2 border border-card-border rounded-lg text-primary text-sm">
											Follow up with Stark Industries recruiter
										</div>
										<span className="text-sm font-medium text-heading px-1">X</span>
									</li>

									<li className="flex items-center gap-2">
										<div className="flex-1 px-3 py-2 border border-card-border rounded-lg text-primary text-sm">
											Coffee chat with Priya at Acme Corp
										</div>
										<span className="text-sm font-medium text-heading px-1">X</span>
									</li>

									<li className="flex items-center gap-2">
										<div className="flex-1 px-3 py-2 border border-card-border rounded-lg text-primary text-sm">
											Research Sterling's engineering team
										</div>
										<span className="text-sm font-medium text-heading px-1">X</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
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