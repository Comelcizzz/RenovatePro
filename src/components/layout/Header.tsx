import { getSession } from "@/lib/auth";
import ClientHeader from "./ClientHeader";

export default async function Header() {
  const session = await getSession();

  return <ClientHeader session={session} />;
}
