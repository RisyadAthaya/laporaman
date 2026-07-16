import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/useAuth.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

function NavBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setShowLogoutConfirm(false);
    await logout();
    navigate("/");
  }

  const displayName = currentUser
    ? currentUser.displayName || currentUser.email
    : "Guest";

  return (
    <header className="header1">
      <div className="w-full max-w-[1214px] mx-auto px-8 flex items-center justify-between">
        <a
          href="/"
          className="header-title hover:opacity-85 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="39"
            viewBox="0 0 39 47"
            fill="none"
            style={{ width: "32px", height: "38.5px" }}
          >
            <path
              d="M36.0265 30.3538C32.3642 31.4685 27.2687 37.0549 25.1788 39.7088C24.3826 38.9126 23.31 38.0169 22.0936 36.9222C21.596 36.4744 21.2311 36.491 20.9989 36.6236C20.634 36.9222 19.8843 37.6189 19.8046 38.0169C19.725 38.415 19.9705 38.8463 20.1032 39.0121C21.1979 40.3059 23.6063 43.1124 24.4821 43.9882C25.3579 44.864 26.1076 44.3531 26.373 43.9882C32.9812 36.0265 35.5621 31.5813 36.0265 30.3538Z"
              fill="#028F65"
            />
            <path
              d="M19.2075 0C10.2108 5.33431 2.65389 7.13232 0 7.36454V21.2975C0 32.4438 12.3406 42.3959 18.5109 45.9786C18.9886 46.3767 19.5724 46.1445 19.8046 45.9786L22.2927 44.4858L19.8046 41.4007L19.2075 41.8983C5.83192 34.0958 3.35053 24.5816 3.78179 20.7998V10.4497C10.7084 8.77773 16.9517 5.57316 19.2075 4.17987C25.338 8.00147 32.0457 9.95208 34.6332 10.4497V19.8046C34.7925 23.7855 33.1736 27.7663 32.3443 29.2591C34.892 26.4725 36.4578 27.5673 36.9222 28.4629C38.0368 25.3579 38.3155 22.3922 38.3155 21.2975V7.36454C31.7869 6.72761 22.8566 2.18946 19.2075 0Z"
              fill="#028F65"
            />
            <circle cx="19.108" cy="16.3214" r="4.67748" fill="#052849" />
            <path
              d="M27.7663 30.7519C24.9797 16.62 9.95209 22.2926 10.6487 30.7519L17.2171 36.7232C19.0085 31.6476 22.8234 33.1072 23.9845 34.7328L27.7663 30.7519Z"
              fill="#052849"
            />
          </svg>
          <span>Lapor Aman</span>
        </a>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stroke text-text3">
                <User size={18} />
              </span>
            )}
            <span className="text-sm text-text2">{displayName}</span>
            <ChevronDown
              size={16}
              className={`text-text3 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 rounded-[8px] border border-stroke bg-white shadow-lg overflow-hidden animate-scale-in">
              {currentUser ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left cursor-pointer bg-white hover:bg-background border-none"
                  >
                    <LogOut size={16} />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left cursor-pointer bg-white hover:bg-background border-none"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-background"
                >
                  <LogIn size={16} />
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </header>
  );
}

export default NavBar;
