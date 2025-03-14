export default function NavItem({ icon, label, ref }: { icon: React.ReactNode; label: string; ref: string }) {
    return (
      <a href={ref} className="flex items-center space-x-3 p-2 text-white rounded-md hover:bg-amber-950 transition">
        {icon}
        <span>{label}</span>
      </a>
    );
  }