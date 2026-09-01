import SectionTitle from "../components/SectionTitle";

export default function Dashboard() {
  return (
    <section className="container-x py-14 sm:py-20">
      <SectionTitle eyebrow="Recruiter portal" title="Dashboard." text="Basic recruiter dashboard page for the MVP." />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["12","Active listings"],["1,284","Views"],["97%","Profile trust"]
        ].map(([n,l])=><div key={l} className="panel p-6"><div className="text-3xl font-black text-cyan">{n}</div><div className="mt-2 text-sm text-slate-500">{l}</div></div>)}
      </div>
    </section>
  );
}