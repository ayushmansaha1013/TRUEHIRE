import { Link } from "react-router-dom";
export default function NotFound() {
  return <section className="container-x grid min-h-[70vh] place-items-center text-center">
    <div><div className="text-7xl font-black text-cyan">404</div><h1 className="mt-3 text-2xl font-black">Page not found</h1><Link className="btn-primary mt-6" to="/">Back home</Link></div>
  </section>;
}