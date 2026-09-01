import { NavLink, Link } from "react-router-dom";

const links = [
  ["Scan", "/scan"],
  ["Community", "/community"],
  ["Verified Jobs", "/jobs"],
  ["Recruiter", "/verify"]
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tight">
          True<span className="text-cyan">Hire</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path}
              className={({isActive}) => `rounded-lg px-3 py-2 text-sm transition ${isActive ? "bg-cyan/10 text-cyan" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        <Link to="/scan" className="btn-primary px-4 py-2 text-sm">Check a Job</Link>
      </div>
    </header>
  );
}