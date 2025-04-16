import { NavLink } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { memo } from "react";

const NavItem = memo(function NavItem({
  icon,
  label,
  to
}: {
  icon: React.ReactNode;
  label: string;
  to: string
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 rounded-md transition ${
          isActive ? "bg-amber-800 text-white" : "hover:bg-amber-950 text-white"
        } ${isCollapsed ? "justify-center" : "space-x-3"}`
      }
      title={isCollapsed ? label : undefined}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );
});

export default NavItem;