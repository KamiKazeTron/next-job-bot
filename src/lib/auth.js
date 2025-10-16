import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get the current authenticated user session
 * @returns {Promise<Session | null>}
 */
export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session;
}
