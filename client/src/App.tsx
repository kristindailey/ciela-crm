import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { RemindersProvider } from "./context/RemindersContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddContactPage from "./pages/AddContactPage";
import AddCompanyPage from "./pages/AddCompanyPage";
import Contacts from "./pages/Contacts";
import ContactDetail from "./pages/ContactDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Applications from "./pages/Applications";
import Reminders from "./pages/Reminders";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import AddApplicationPage from "./pages/AddApplicationPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />
	},
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/register",
		element: <Register />
	},
	{
		element: <ProtectedRoute><Layout /></ProtectedRoute>,
		children: [
			{
				path: "/dashboard",
				element: <Dashboard />,
			},
			{
				path: "/contacts",
				element: <Contacts />,
			},
			{
				path: "/contacts/new",
				element: <AddContactPage />,
			},
			{
				path: "/contacts/:id",
				element: <ContactDetail />,
			},
			{
				path: "/companies",
				element: <Companies />,
			},
			{
				path: "/companies/new",
				element: <AddCompanyPage />,
			},
			{
				path: "/companies/:id",
				element: <CompanyDetail />,
			},
			{
				path: "/applications",
				element: <Applications />,
			},
			{
				path: "/applications/new",
				element: <AddApplicationPage />,
			},
			{	
				path: "/reminders",
				element: <Reminders />,
			},
		],
	},
]);

const App = () => {
	return (
		<AuthProvider>
			<ThemeProvider>
				<RemindersProvider>
					<RouterProvider router={router} />
				</RemindersProvider>
			</ThemeProvider>
		</AuthProvider>
	);
};

export default App;