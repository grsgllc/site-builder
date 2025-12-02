import React from "react";
import Link from "next/link";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`btn btn-primary border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold  md:text-lg xl:text-2xl xl:p-6 mt-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const LinkButton: React.FC<
  React.LinkHTMLAttributes<HTMLAnchorElement>
> = ({ children, className = "", href, ...props }) => {
  return (
    <Link
      className={`btn btn-primary md:text-lg xl:text-2xl xl:p-6  ${className}`}
      href={href ?? "/"}
      {...props}
    >
      {children}
    </Link>
  );
};

export const H1 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="text-2xl md:text-4xl xl:text-6xl font-bold text-center">
      {children}
    </h1>
  );
};

export const H2 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="text-xl md:text-3xl xl:text-5xl text-center">{children}</h2>
  );
};

export const H3 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="text-lg md:text-2xl xl:text-4xl font-bold text-center mt-2">
      {children}
    </h3>
  );
};

export const Divider = () => {
  return <div className="divider" />;
};
export const Bold = ({ children }: { children: React.ReactNode }) => {
  return <span className="font-bold">{children}</span>;
};
export const Italic = ({ children }: { children: React.ReactNode }) => {
  return <span className="italic">{children}</span>;
};

export const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-md md:text-xl xl:text-3xl font-bold mt-4">
      {children}
    </div>
  );
};
export const List = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul className="list-disc list-inside md:space-y-2 md:text-lg xl:text-2xl mt-2">
      {children}
    </ul>
  );
};

export function Copy({ children }: { children: React.ReactNode }) {
  return <div className="md:text-lg xl:text-2xl mt-2">{children}</div>;
}
