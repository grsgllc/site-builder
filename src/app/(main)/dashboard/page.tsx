import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserSites, getUserCollaboratingSites } from "@/lib/prisma";
import { Button, H1 } from "@/components/Core";
import Link from "next/link";
import { IoFilterSharp } from "react-icons/io5";
import { FaSort } from "react-icons/fa";

function DashboardToolbar() {
  /* return (
    <ul className="menu menu-horizontal menu-lg">
      <li>
        <IoFilterSharp />
      </li>
      <li>
        <FaSort />
      </li>
      <li>
        <Link href="/dashboard/new">+</Link>
      </li>
    </ul>
  ); */
  return (
    <div className="grid grid-cols-3 gap-6 w-full justify-center mb-2 px-8">
      <button className="btn btn-primary btn-ghost btn-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold font-mono md:text-lg xl:text-2xl xl:p-6 mt-2">
        <IoFilterSharp />
      </button>
      <button className="btn btn-primary btn-ghost btn-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold font-mono md:text-lg xl:text-2xl xl:p-6 mt-2">
        <FaSort />
      </button>
      <Link
        href="/dashboard/new"
        className="btn btn-primary btn-ghost btn-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold font-mono md:text-lg xl:text-2xl xl:p-6 mt-2"
      >
        +
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
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

  return (
    <div className="flex flex-col">
      <DashboardToolbar />

      {/* Sites List */}
      {allSites.length === 0 ? (
        <div className="text-center py-16 border-4 border-black bg-yellow-300">
          <p className="text-2xl font-bold font-mono mb-4">No sites yet</p>
          <p className="text-lg font-mono">
            Create your first site to get started
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {allSites.map((site) => (
            <SiteCard key={site.id} site={site} isOwner={site.isOwner} />
          ))}
        </div>
      )}
    </div>
  );
}

function SiteCard({ site, isOwner }: { site: any; isOwner: boolean }) {
  const publishedUrl = site.published
    ? `https://${site.subdomain}.yourapp.com`
    : null;

  return (
    <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden">
      {/* Preview Section */}
      <div className="bg-gradient-to-br from-yellow-300 via-pink-300 to-cyan-300 h-48 flex items-center justify-center border-b-4 border-black relative">
        <div className="text-6xl font-bold font-mono opacity-20">
          {site.name.charAt(0).toUpperCase()}
        </div>
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            site.published ? "bg-green-400" : "bg-gray-300"
          }`}
        >
          {site.published ? "LIVE" : "DRAFT"}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-2xl font-bold font-mono mb-2">{site.name}</h3>
        <p className="text-sm font-mono text-gray-600 mb-1">
          {site.subdomain}.yourapp.com
        </p>
        <p className="text-xs font-mono text-gray-500">
          {isOwner ? "Owner" : "Collaborator"} •{" "}
          {new Date(site.updatedAt).toLocaleDateString()}
        </p>

        {site.description && (
          <p className="text-sm font-mono mt-3 line-clamp-2 text-gray-700">
            {site.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t-4 border-black bg-gray-50 p-4 flex gap-2 flex-wrap">
        <Link
          href={`/editor/${site.id}`}
          className="btn btn-sm btn-primary border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold font-mono transition-all"
          title="Edit"
        >
          ✏️ Edit
        </Link>

        {publishedUrl && (
          <a
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold font-mono transition-all"
            title="View Live"
          >
            👁️ View
          </a>
        )}

        {isOwner && (
          <Link
            href={`/dashboard/${site.id}/settings`}
            className="btn btn-sm border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold font-mono transition-all"
            title="Settings"
          >
            ⚙️ Settings
          </Link>
        )}
      </div>
    </div>
  );
}
