import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSite } from "@/lib/prisma";
import { EditorLayout } from "@/components/editor/EditorLayout";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const session = await auth();
  const { siteId } = await params;

  if (!session?.user?.id) {
    redirect("/");
  }

  const site = await getSite(siteId);

  if (!site) {
    redirect("/dashboard");
  }

  // Check if user has access (owner or collaborator)
  const isOwner = site.userId === session.user.id;
  const isCollaborator = site.collaborators.some(
    (c) => c.userId === session.user.id
  );

  if (!isOwner && !isCollaborator) {
    redirect("/dashboard");
  }

  return <EditorLayout site={site} user={session.user} />;
}
