import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";

/**
 * The main layout of the application
 * Contains the Navbar and Outlet for routing
 */

export default function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-auto dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
}
