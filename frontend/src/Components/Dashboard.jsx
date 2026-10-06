import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import LandlordDashboard from "./DashboardComponents/LandlordDashboard";
import TenantDashboard from "./DashboardComponents/TenantDashboard";

export default function Dashboard() {
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard", "user"],
    queryFn: async () => {
      const response = await api.get("/dashboard/populateDashboard");
      return response.data.userData;
    },
  });

  if (isLoading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#f7f5f0] text-sm font-medium text-[#004741]"
        role="status"
      >
        Loading your dashboard...
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f7f5f0] px-6 text-center">
        <h1 className="text-xl font-bold text-slate-900">
          Couldn't load your dashboard
        </h1>
        <p className="text-sm text-slate-600">
          Please sign in again and try once more.
        </p>
        <Link
          to="/signin"
          className="rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  switch (userData?.role?.toLowerCase()) {
    case "landlord":
      return <LandlordDashboard />;
    case "tenant":
      return <TenantDashboard accountData={userData} />;
    default:
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-6 text-center">
          <p className="max-w-md text-sm font-medium text-slate-700">
            Your account role doesn't have a dashboard yet. Please contact
            support for help.
          </p>
        </main>
      );
  }
}