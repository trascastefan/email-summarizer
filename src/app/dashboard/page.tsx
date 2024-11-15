import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirect: true, redirectTo: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {session.user?.name}
          </h1>
          <form action={handleSignOut}>
            <Button variant="destructive">
              Sign Out
            </Button>
          </form>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Email Summarization
            </h2>
            <p className="text-gray-600">
              Ready to analyze and summarize your emails?
            </p>
            <Button className="mt-4">
              Start Summarization
            </Button>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Connected Account
            </h2>
            <p>Email: {session.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
