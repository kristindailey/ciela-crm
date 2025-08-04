import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddContactPage from "./pages/AddContactPage";
import AddCompanyPage from "./pages/AddCompanyPage";
import Contacts from "./pages/Contacts";
import Companies from "./pages/Companies";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
    path: "/contacts",
    element: <ProtectedRoute><Contacts /></ProtectedRoute>,
  },
  {
    path: "/contacts/new",
    element: <ProtectedRoute><AddContactPage /></ProtectedRoute>,
  },
  // {
  //   path: "/contacts/:id",
  //   element: <ProtectedRoute><AddContactPage /></ProtectedRoute>,
  // },
  {
    path: "/companies/new",
    element: <ProtectedRoute><AddCompanyPage /></ProtectedRoute>,
  },
  // {
  //   path: "/companies/:id",
  //   element: <ProtectedRoute><AddCompanyPage /></ProtectedRoute>,
  // },
  {
    path: "/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>,
  },
  {
    path: "/applications",
    element: <ProtectedRoute><Applications /></ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;