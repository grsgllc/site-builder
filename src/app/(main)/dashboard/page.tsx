import DashboardPage from "./DashboardPage";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserSites, getUserCollaboratingSites } from "@/lib/prisma";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const [ownedSites, collaboratingSites] = await Promise.all([
    getUserSites(session.user.id),
    getUserCollaboratingSites(session.user.id),
  ]);

  const allSites = [
    ...ownedSites.map((site) => ({ ...site, isOwner: true })),
    ...collaboratingSites.map((site) => ({ ...site, isOwner: false })),
  ];

  return <DashboardPage sites={allSites} />;
}
