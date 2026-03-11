import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LoginPage from "@/app/auth/login/page";
import Dashboard from "./Dashboard/page";
import Navbar from "@/components/Navbar/Navbar";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // If user is not logged in, show Login page
    return <LoginPage />;
  }

  // If user is logged in, show Dashboard
  return (
    <>
      <Navbar />
      <Dashboard />
    </>
  );
}
