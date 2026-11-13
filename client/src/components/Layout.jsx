import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ChevronDown, Home, LogOut, Package, Settings, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Dashboard", icon: Home, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Layout = () => {
  const { user, organization, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <aside className="flex w-52 shrink-0 flex-col bg-sidebar px-3 py-5 lg:w-56">
        <div className="mb-8 px-2">
          <Logo />
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <link.icon size={20} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* main area */}
      <div className="flex-1 overflow-x-hidden">
        <header className="flex justify-end border-b border-slate-200 bg-white px-8 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Store size={20} />
              {organization?.name}
              <ChevronDown size={16} />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-semibold text-white">
              {user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
