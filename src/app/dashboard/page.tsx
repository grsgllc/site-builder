import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserSites, getUserCollaboratingSites } from "@/lib/prisma";
import { H1, H2 } from "@/components/Core";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const [ownedSites, collaboratingSites] = await Promise.all([
    getUserSites(session.user.id),
    getUserCollaboratingSites(session.user.id),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <H1>Your Sites</H1>
        <Link
          href="/dashboard/new"
          className="btn btn-primary font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          + Create New Site
        </Link>
      </div>

      {ownedSites.length === 0 && collaboratingSites.length === 0 ? (
        <div className="text-center py-16 border-4 border-black bg-yellow-300">
          <H2>No sites yet</H2>
          <p className="mt-4 text-lg font-mono">
            Create your first site to get started
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {ownedSites.length > 0 && (
            <div>
              <H2>My Sites</H2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {ownedSites.map((site) => (
                  <SiteCard
                    key={site.id}
                    site={site}
                    isOwner={true}
                  />
                ))}
              </div>
            </div>
          )}

          {collaboratingSites.length > 0 && (
            <div>
              <H2>Collaborating Sites</H2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {collaboratingSites.map((site) => (
                  <SiteCard
                    key={site.id}
                    site={site}
                    isOwner={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SiteCard({
  site,
  isOwner,
}: {
  site: any;
  isOwner: boolean;
}) {
  const publishedUrl = site.published
    ? `https://${site.subdomain}.yourapp.com`
    : null;

  return (
    <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold font-mono">{site.name}</h3>
          <span
            className={`px-2 py-1 text-xs font-bold border-2 border-black ${
              site.published ? "bg-green-400" : "bg-gray-300"
            }`}
          >
            {site.published ? "LIVE" : "DRAFT"}
          </span>
        </div>

        {site.description && (
          <p className="text-sm font-mono mb-4 line-clamp-2">
            {site.description}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Link
            href={`/editor/${site.id}`}
            className="btn btn-sm btn-primary border-2 border-black font-bold"
          >
            Edit Site
          </Link>

          {publishedUrl && (
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline border-2 border-black font-bold"
            >
              View Live
            </a>
          )}

          {isOwner && (
            <Link
              href={`/dashboard/${site.id}/settings`}
              className="btn btn-sm btn-ghost border-2 border-black font-bold"
            >
              Settings
            </Link>
          )}
        </div>

        <div className="mt-4 pt-4 border-t-2 border-black">
          <p className="text-xs font-mono text-gray-600">
            {site.subdomain}.yourapp.com
          </p>
          <p className="text-xs font-mono text-gray-500 mt-1">
            {isOwner ? "Owner" : "Collaborator"} •{" "}
            {new Date(site.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
