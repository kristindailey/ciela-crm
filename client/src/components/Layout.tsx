import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const Layout = () => {
	return (
		<div className="bg-app flex min-h-screen">
			<Sidebar />
			<div className="flex-1 ml-20 sm:ml-35 md:ml-48">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;