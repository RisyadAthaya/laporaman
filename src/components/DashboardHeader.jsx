import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/useAuth.js";
import ConfirmDialog from "./ConfirmDialog.jsx";
import BrandLogo from "./BrandLogo.jsx";
import gearIcon from "../assets/gear.svg";

function NavBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const nameContainerRef = useRef(null);
  const nameTextRef = useRef(null);
  const [marqueeDistance, setMarqueeDistance] = useState(0);

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

  useEffect(() => {
    const containerEl = nameContainerRef.current;
    const textEl = nameTextRef.current;
    if (!containerEl || !textEl) return;

    const overflow = containerEl.clientWidth - textEl.scrollWidth;
    setMarqueeDistance(overflow < 0 ? overflow : 0);
  }, [displayName]);

  return (
      <header className="header1">
        <div className="w-full mxax-w-[1214px] mx-auto px-8 flex items-center justify-between">
          <a
              href="/"
              className="header-title hover:opacity-85 transition-opacity"
          >
            <BrandLogo
                className="flex items-center gap-[6.438px]"
                imgStyle={{ width: "32px", height: "38.5px" }}
            />
          </a>
          <div className="relative bg-background w-50 rounded-[10px]" ref={menuRef}>
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
              <div ref={nameContainerRef} className="overflow-hidden flex w-32">
              <span
                  ref={nameTextRef}
                  className={`text-sm text-text2 whitespace-nowrap ${
                      marqueeDistance < 0 ? "animate-marquee" : "truncate"
                  }`}
                  style={
                    marqueeDistance < 0
                        ? { "--marquee-distance": `${marqueeDistance}px` }
                        : undefined
                  }
              >
                {displayName}
              </span>
              </div>
              <ChevronDown
                  size={16}
                  className={`text-text3 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-50 rounded-[8px] border border-stroke bg-background shadow-lg overflow-hidden animate-scale-in">
                  {currentUser ? (
                      <>
                        <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              navigate("/settings");
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left cursor-pointer bg-white hover:bg-background border-none"
                        >
                          <img src={gearIcon} alt="Settings" className="w-4 h-4" />
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
