import { Link } from "react-router";
import logo from "../assets/ciela-text.png";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col bg-app text-primary font-inter">
			<nav className="flex justify-between sticky top-0 z-10 bg-sidebar w-full h-18 px-4">
				<Link 
					to="/" 
					className="flex items-center"
				>
					<img src={logo} alt="Ciela CRM logo" className="h-18 w-auto" />
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
				<section className="max-w-6xl mx-auto px-6 py-1 md:py-16">
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

				<section className="bg-lavender border-y border-card-border mt-6 md:mt-10">
					<div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
							<div className="bg-card border border-card-border rounded-2xl p-6 md:p-8 shadow-xl">
								<h3 className="text-lg md:text-xl font-semibold text-heading mb-2">
									Focus on who matters most
								</h3>

								<p className="text-sm md:text-base text-muted leading-relaxed mb-4">
									Sort contacts and companies into tiers so your energy goes where it counts.
								</p>

								<div className="bg-app rounded-lg p-4 border border-card-border">
									<div className="flex items-center justify-between mb-1">
										<h4 className="text-base font-semibold text-heading">Priya Shah</h4>

										<div className="h-8 w-8 bg-lavender rounded-md flex items-center justify-center text-heading font-semibold text-sm">
											AC
										</div>
									</div>

									<div className="text-xs text-muted font-medium">Acme Corp</div>
									<div className="text-xs text-muted font-medium">Engineering Manager</div>

									<div className="text-xs text-muted font-medium mt-3 pt-3 border-t border-muted">
										Tier 1 - Dream
									</div>
								</div>
							</div>

							<div className="flex flex-col bg-card border border-card-border rounded-2xl p-6 md:p-8 shadow-xl">
								<h3 className="text-lg md:text-xl font-semibold text-heading mb-2">
									Start with your whole network
								</h3>

								<p className="text-sm md:text-base text-muted leading-relaxed mb-4">
									Bring your contacts over in a single CSV upload. Ciela handles the rest.
								</p>

								<div className="flex flex-1 items-center justify-center gap-3 py-4 bg-app rounded-lg border border-card-border">
									<div className="bg-blush rounded-lg px-4 py-3 text-xs font-semibold text-heading shadow-sm">
										contacts.csv
									</div>

									<span className="text-muted text-lg">→</span>

									<div className="flex flex-col gap-1">
										<div className="h-2 w-20 bg-lavender rounded"></div>
										<div className="h-2 w-20 bg-lavender rounded opacity-70"></div>
										<div className="h-2 w-20 bg-lavender rounded opacity-40"></div>
									</div>
								</div>
							</div>

							<div className="flex flex-col bg-card border border-card-border rounded-2xl p-6 md:p-8 shadow-xl">
								<h3 className="text-lg md:text-xl font-semibold text-heading mb-2">
									Never let a warm lead go cold
								</h3>

								<p className="text-sm md:text-base text-muted leading-relaxed mb-4">
									Gentle nudges to follow up and stay top of mind so the right people remember you when it counts.
								</p>

								<div className="flex flex-col flex-1 bg-app rounded-lg p-4 border border-card-border">
									<div className="flex items-center justify-between mb-1">
										<span className="text-sm font-semibold text-heading">Pepper Potts</span>
										<span className="text-xs text-muted">Apr 20</span>
									</div>

									<div className="flex items-center justify-between mb-1">
										<span className="text-sm font-semibold text-muted">Stark Industries</span>
										<span className="text-xs text-primary bg-lavender rounded-sm px-1.5 py-0.5">Due: Apr 24</span>
									</div>

									<hr className="border-muted my-2" />

									<div>
										<span className="text-xs text-muted">Thank Pepper for meeting this week</span>
									</div>

									<div className="flex justify-end gap-2 mt-3">
										<div className="px-3 py-2 text-sm text-primary bg-cancel rounded">Clear</div>
										<div className="px-3 py-2 text-sm text-white bg-sidebar rounded">Snooze</div>
									</div>
								</div>
							</div>

							<div className="flex flex-col bg-card border border-card-border rounded-2xl p-6 md:p-8 shadow-xl">
								<h3 className="text-lg md:text-xl font-semibold text-heading mb-2">
									See your search take shape
								</h3>

								<p className="text-sm md:text-base text-muted leading-relaxed mb-4">
									Weekly trends, tier breakdowns, and momentum metrics that turn "am I doing enough?" into a clear answer.
								</p>

								<div className="flex flex-1 flex-col bg-app rounded-lg p-4 border border-card-border">
									<div className="flex items-end justify-around gap-3 h-24 mt-auto">
										<div className="flex flex-col items-center justify-end gap-1 flex-1 h-full">
											<div className="w-full bg-lavender rounded-t" style={{ height: "90%" }}></div>
											<span className="text-xs text-muted">Tier 1</span>
										</div>

										<div className="flex flex-col items-center justify-end gap-1 flex-1 h-full">
											<div className="w-full bg-cream rounded-t" style={{ height: "60%" }} />
											<span className="text-xs text-muted">Tier 2</span>
										</div>

										<div className="flex flex-col items-center justify-end gap-1 flex-1 h-full">
											<div className="w-full bg-blush rounded-t" style={{ height: "35%" }} />
											<span className="text-xs text-muted">Tier 3</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
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