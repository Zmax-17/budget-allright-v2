import { NavLink, useNavigate } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

const getUsernameFromEmail = (email?: string): string => {
  if (!email) return "Guest";
  const name = email.split("@")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const navigate = useNavigate(); // For redirect after logout

  const username = getUsernameFromEmail(
    user?.email ?? "Guest",
  );
  const navLinkClasses = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `relative pb-1 text-sm transition-colors w-fit ${
      isActive
        ? "text-emerald-700 dark:text-emerald-300 font-medium"
        : "text-gray-600 dark:text-gray-400 hover:text-emerald-600"
    } after:absolute after:left-0 after:-bottom-[2px] after:h-[2px]
     after:transition-all after:duration-200 ${
       isActive
         ? "after:w-full after:bg-emerald-600"
         : "after:w-0 hover:after:w-full after:bg-emerald-400"
     }`;

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  const handleLogout =
    useCallback(async (): Promise<void> => {
      try {
        await logout(); // Call logout from context
        navigate("/login");
      } catch {
        toast.error("Logout failed");
      }
    }, [logout, navigate]);

  return (
    <nav
      ref={menuRef}
      className="sticky top-0 z-50 px-4 py-3
  bg-emerald-50 dark:bg-gray-900
  border-b border-emerald-200 dark:border-emerald-800"
    >
      <div className="flex items-center justify-between">
        {/* Burger menu and greeting */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2"
            aria-label={
              isMenuOpen ? "Close menu" : "Open menu"
            }
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <span className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
            Hi,{" "}
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {username}
            </span>
          </span>
        </div>

        {/* Nav */}
        <div
          className={`
      absolute md:static top-14 left-0 right-0
      flex flex-col md:flex-row gap-4 md:gap-6
      px-4 py-4 md:p-0
      bg-emerald-50 dark:bg-gray-900 md:bg-transparent
      border-b md:border-none border-emerald-200 dark:border-gray-800
      ${isMenuOpen ? "flex" : "hidden md:flex"}
    `}
        >
          {isMenuOpen && (
            <span className="md:hidden font-semibold text-xl text-emerald-700 dark:text-emerald-300 mb-4">
              Hi, {username}
            </span>
          )}
          <NavLink
            to="/dashboard"
            className={navLinkClasses}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className={navLinkClasses}
          >
            Transactions
          </NavLink>
          <NavLink
            to="/savings"
            className={navLinkClasses}
          >
            Savings
          </NavLink>
          <NavLink
            to="/settings"
            className={navLinkClasses}
          >
            Settings
          </NavLink>

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 transition-colors cursor-pointer"
              title="Logout"
            >
              <RxExit size={18} />
            </button>
          ) : (
            <NavLink
              to="/login"
              className={navLinkClasses}
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Theme */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="p-2 text-emerald-700 dark:text-emerald-300 hover:opacity-70 transition cursor-pointer"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
}
