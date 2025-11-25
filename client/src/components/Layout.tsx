import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const Layout = () => {
	return (
		<div className="bg-gray-50 flex">
			<Sidebar />
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;