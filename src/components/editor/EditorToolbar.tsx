"use client";

import Link from "next/link";
import { useState } from "react";
import { FaChevronLeft, FaFolder } from "react-icons/fa";
import { TbBackground } from "react-icons/tb";
import { FiPlus } from "react-icons/fi";
import { IoOptionsOutline } from "react-icons/io5";
import { MdFormatColorText } from "react-icons/md";
import { IoIosPhonePortrait, IoIosDocument } from "react-icons/io";
import { useRouter } from "next/navigation";

export function EditorToolbar() {
  const iconSize = 30;
  const router = useRouter();
  return (
    <div className="flex flex-row border-b-1 border-white w-full">
      <div className="shrink border-r-1 border-white p-2">
        <FaChevronLeft onClick={() => router.back()} size={iconSize} />
      </div>
      <div className="flex grow overflow-x-auto">
        <div className="grid auto-cols-min grid-flow-col">
          <ToolbarItem>
            <IoIosPhonePortrait size={iconSize} />
          </ToolbarItem>
          <ToolbarItem>
            <FiPlus size={iconSize} />
          </ToolbarItem>
          <ToolbarItem>
            <TbBackground size={iconSize} />
          </ToolbarItem>
          <ToolbarItem>
            <IoOptionsOutline size={iconSize} />
          </ToolbarItem>
          <ToolbarItem>
            <MdFormatColorText size={iconSize} />
          </ToolbarItem>
          <ToolbarItem>
            <IoIosDocument size={iconSize} />
          </ToolbarItem>
          <ToolbarItem>
            <FaFolder size={iconSize} />
          </ToolbarItem>
        </div>
      </div>
    </div>
  );
}

function ToolbarItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-r-1 border-white flex items-center px-3">
      {children}
    </div>
  );
}
