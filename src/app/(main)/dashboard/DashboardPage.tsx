import { BsPencilFill } from "react-icons/bs";
import Link from "next/link";
import { IoFilterSharp } from "react-icons/io5";
import { FaSort, FaEye } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { Site } from "@/types";
import Image from "next/image";

export default async function DashboardPage({ sites }: { sites: Site[] }) {
  return (
    <div className="flex flex-col">
      <DashboardToolbar />

      {/* Sites List */}
      {sites.length === 0 ? (
        <NoSitesFound />
      ) : (
        <div className="flex flex-col md:flex-row gap-6 md:p-6">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} isOwner={site.isOwner} />
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardToolbar() {
  return (
    <div className="grid grid-cols-3 gap-6 w-full justify-center mb-2 px-8 md:max-w-lg">
      <button className="btn btn-primary btn-ghost btn-xl">
        <IoFilterSharp className="size-3/4" />
      </button>
      <button className="btn btn-primary btn-ghost btn-xl">
        <FaSort className="size-3/4" />
      </button>
      <Link
        href="/templates"
        className="btn btn-primary btn-ghost btn-xl text-4xl"
      >
        +
      </Link>
    </div>
  );
}

function NoSitesFound() {
  return (
    <div className="text-center py-16">
      <p className="text-2xl font-bold  mb-4">No sites yet</p>
      <p className="text-lg ">Click the + to get started</p>
    </div>
  );
}

function SiteCard({ site, isOwner }: { site: Site; isOwner: boolean }) {
  const publishedUrl = site.published
    ? `https://${site.subdomain}.yourapp.com`
    : null;

  return (
    <div className="card rounded-none border-1 border-white overflow-hidden md:max-w-xs">
      <figure>
        <Image
          width={1000}
          height={1000}
          src={site.ogImage ?? "/default-site-preview.jpg"}
          alt={site.name}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title ">
          {site.name}
          <div
            className={`badge rounded-none  ${
              site.published ? "badge-secondary" : "badge-primary"
            }`}
          >
            {site.published ? "LIVE" : "DRAFT"}
          </div>
        </h2>
        <p className="text-sm  mb-1">{site.subdomain}.yourapp.com</p>
        <p className="text-xs  text-gray-500">
          {isOwner ? "Owner" : "Collaborator"} •{" "}
          {site.updatedAt.toLocaleDateString()}
        </p>
        {site.description && (
          <p className="text-sm  mt-3 line-clamp-2 text-gray-700">
            {site.description}
          </p>
        )}
        <div className="card-actions">
          <Link
            href={`/editor/${site.id}`}
            className="btn btn-primary btn-ghost btn-md border-4 border-white"
            title="Edit"
          >
            <BsPencilFill />
          </Link>
          {publishedUrl && (
            <Link
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-ghost btn-md border-4 border-white"
              title="View Live"
            >
              <FaEye />
            </Link>
          )}
          {isOwner && (
            <Link
              href={`/dashboard/${site.id}/settings`}
              className="btn btn-primary btn-ghost btn-md border-4 border-white"
              title="Settings"
            >
              <FaGear />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
