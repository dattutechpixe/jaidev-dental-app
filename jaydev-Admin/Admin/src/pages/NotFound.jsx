import React from "react";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound({ homeHref = "/" }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-8xl font-bold">404</h1>
      <p className="mt-4 text-lg text-gray-400">Page not found</p>
      <Link
        to={homeHref}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2 font-medium text-gray-900 shadow hover:bg-gray-200"
      >
        <Home className="h-5 w-5" />
        Go Home
      </Link>
    </div>
  );
}
