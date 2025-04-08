import { NavLink } from "react-router-dom";

export default function NavItem({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-2 rounded-md transition ${
          isActive ? "bg-amber-800 text-white" : "hover:bg-amber-950 text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
