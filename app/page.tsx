import { redirect } from "next/navigation";
import { Navbar } from "./components/Navbar";
import { auth } from "./lib/auth";

export default async function Home() {
  /**세션이 존재하면 /dashboard 페이지로 이동 */
  const session = await auth();
  if(session?.user) {
    return redirect("/dashboard");
  }
  return (
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
    </div>
  );
}
