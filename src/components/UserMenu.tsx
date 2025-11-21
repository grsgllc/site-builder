"use client";

import { UserDetails } from "@/types";
import Link from "next/link";
import { useEffect } from "react";

interface UserMenuProps {
  user?: UserDetails | null;
  signOut: () => void;
  createPortalSession: () => Promise<void>;
}

export default function UserMenu({
  user,
  signOut,
  createPortalSession,
}: UserMenuProps) {
  /* if (user) {
    storeUserDetails(user);
  }
  if (!user) {
    user = getUserDetails();
  } */

  if (!user) {
    return (
      <Link href="/signin" className={`btn btn-primary`}>
        Sign In
      </Link>
    );
  }

  const handleCreatePortalSession = async () => {
    await createPortalSession();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="flex items-center gap-2 cursor-pointer">
        <span className="flex flex-row text-sm font-bold btn btn-primary rounded-none p-3 shadow 2-xl">
          {user.email}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 mt-2 shadow bg-secondary w-52 text-secondary-content font-bold shadow-2xl"
      >
        <li>
          <Link href="/charts">Sticker Charts</Link>
        </li>

        {user.hasAccess && user.stripeCustomerId ? (
          <li>
            <div onClick={handleCreatePortalSession}>Manage Subscription</div>
          </li>
        ) : !user.hasAccess ? (
          <li>
            <Link href="/subscribe">Subscribe</Link>
          </li>
        ) : null}

        <li>
          <Link href="/feedback">Feedback</Link>
        </li>
        <li>
          <form action={handleSignOut}>
            <button type="submit">Log out</button>
          </form>
        </li>
      </ul>
    </div>
  );
}
