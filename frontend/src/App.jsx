import React from "react";
import Homepage from "./Components/Homepage";
import SignUp from "./Components/SignUp";
import NotFound from "./Components/NotFound";
import VerifyOTP from "./Components/VerifyOTP";
import SignIn from "./Components/SignIn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import AddPropertyModal from "./Components/DashboardComponents/Landlorddashboard/AddPropertyModal";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />, // ADD: Use your Homepage component here
  },
  {
    path: "/signup",
    element: <SignUp />, // ADD: Use your SignUp component here
  },
  {
    path: "/verifyotp",
    element: <VerifyOTP />
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "dashboard",
    element: <Dashboard />
  },
  {
    path: "addproperty",
    element: <AddPropertyModal />
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}

export default App;
