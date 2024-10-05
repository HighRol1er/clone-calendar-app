import { nylas, nylasConfig } from "@/app/lib/nylas";
import { redirect } from "next/navigation";

// api route handler, and redirect end user to Nylas
export async function GET() {
  const authUrl = nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.redirectUri,
  });

  return redirect(authUrl);
}