import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { requireUser } from "../lib/hooks";

export default async function DashboradPage() {
  const session = await requireUser();
  
  return (
    <div>
      <h1>DashboardPage</h1>
    </div>
  );
}