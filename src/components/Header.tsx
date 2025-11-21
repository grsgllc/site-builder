"use client";

import { CiMenuBurger } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { LinkButton } from "./Core";
import Image from "next/image";
import { UserDetails } from "@/types";
import { useState } from "react";

export default function Header({
  user,
  signOut,
  createPortalSession,
}: {
  user?: UserDetails | null;
  signOut: () => void;
  createPortalSession: () => Promise<void>;
}) {
  function toggleDrawer() {
    document.getElementById("main-nav-drawer")?.click();
  }
  return (
    <div className="drawer">
      <input id="main-nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100 w-full">
          {/* Mobile Header */}
          <div className="flex-none md:hidden">
            <label
              htmlFor="main-nav-drawer"
              className="btn btn-square btn-ghost"
            >
              <CiMenuBurger />
            </label>
          </div>
          <div className="ml-auto mr-[37%] my-auto md:mx-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="stickerch.art"
                width={100}
                height={100}
              />
            </Link>
          </div>
          {/* Desktop Header */}
          <div className="flex-row w-full gap-4 justify-end hidden md:flex pr-4">
            <UserDropdown
              user={user}
              signOut={signOut}
              createPortalSession={createPortalSession}
            />
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="main-nav-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul
          className="menu bg-base-200 min-h-full w-[80%] sm:w-80 p-4"
          onClick={() => {
            toggleDrawer();
          }}
        >
          <li>
            <LinkButton href="/blog">Blog</LinkButton>
          </li>
          <li className="mt-4">
            {!user ? (
              <LinkButton href="/signin">Sign In</LinkButton>
            ) : (
              user.email
            )}
          </li>

          <UserMenuItems
            user={user}
            signOut={signOut}
            createPortalSession={createPortalSession}
          />
        </ul>
      </div>
    </div>
  );
}

function UserMenuItems({
  user,
  signOut,
  createPortalSession,
}: {
  user?: UserDetails | null;
  signOut: () => void;
  createPortalSession: () => Promise<void>;
}) {
  if (!user) return null;

  const handleCreatePortalSession = async () => {
    await createPortalSession();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <li>
        <Link href="/dashboard">Dashboard</Link>
      </li>

      {/* {user.hasAccess && user.stripeCustomerId ? (
        <li>
          <div onClick={handleCreatePortalSession}>Manage Subscription</div>
        </li>
      ) : !user.hasAccess ? (
        <li>
          <Link href="/subscribe">Subscribe</Link>
        </li>
      ) : null} */}

      <li>
        <Link href="/feedback">Feedback</Link>
      </li>
      <li>
        <form action={handleSignOut}>
          <button type="submit">Log out</button>
        </form>
      </li>
    </>
  );
}

function UserDropdown({
  user,
  signOut,
  createPortalSession,
}: {
  user?: UserDetails | null;
  signOut: () => void;
  createPortalSession: () => Promise<void>;
}) {
  if (!user) {
    return <LinkButton href="/signin">Sign In</LinkButton>;
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="flex flex-row btn btn-primary rounded-none md:text-lg xl:text-2xl xl:p-6"
      >
        {user.email}
        <FaChevronDown />
      </div>
      <ul
        tabIndex={0}
        onClick={(e) => (e.target as HTMLUListElement).blur()}
        className="dropdown-content menu shadow bg-secondary text-secondary-content shadow-2xl md:text-lg xl:text-2xl"
      >
        <UserMenuItems
          user={user}
          signOut={signOut}
          createPortalSession={createPortalSession}
        />
      </ul>
    </div>
  );
}
