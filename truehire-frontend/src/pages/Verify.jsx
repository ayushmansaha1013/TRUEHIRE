// import { useState } from "react";
// import { Link } from "react-router-dom";
// import SectionTitle from "../components/SectionTitle";

// export default function Verify() {
//   const [submitted, setSubmitted] = useState(false);
//   return (
//     <section className="container-x py-14 sm:py-20">
//       <div className="grid gap-8 lg:grid-cols-2">
//         <div>
//           <SectionTitle eyebrow="Supply side" title="Verify your company." text="Onboard recruiters into the trusted jobs platform." />
//           <div className="panel p-6">
//             <div className="space-y-3">
//               <input className="input" placeholder="Company name" />
//               <input className="input" placeholder="CIN" />
//               <input className="input" type="email" placeholder="Contact email" />
//               <button className="btn-primary w-full" onClick={()=>setSubmitted(true)}>Verify your company →</button>
//               {submitted && <p className="rounded-xl bg-success/10 p-3 text-sm text-success">Verification request submitted (demo).</p>}
//             </div>
//           </div>
//         </div>
//         <div className="panel p-7">
//           <div className="eyebrow">Recruiter dashboard</div>
//           <h2 className="mt-2 text-2xl font-black">Acme Corp Pvt Ltd</h2>
//           <div className="mt-6 grid grid-cols-2 gap-3">
//             <div className="rounded-xl bg-white/5 p-4"><div className="text-2xl font-black">12</div><div className="text-sm text-slate-500">Active jobs</div></div>
//             <div className="rounded-xl bg-white/5 p-4"><div className="text-2xl font-black text-success">✓</div><div className="text-sm text-slate-500">Verified</div></div>
//           </div>
//           <Link to="/dashboard" className="btn-secondary mt-5 w-full">Open dashboard</Link>
//         </div>
//       </div>
//     </section>
//   );
// }


import { useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

export default function Verify() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    cin: "",
    email: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.companyName.trim() || !form.email.trim()) {
      alert("Please enter company name and contact email.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <section className="container-x py-14 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle
            eyebrow="Supply side"
            title="Verify your company."
            text="Onboard recruiters into the trusted jobs platform."
          />
          <div className="panel p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="input"
                placeholder="Company name *"
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Corporate Identification Number (CIN)"
                value={form.cin}
                onChange={(e) => setForm({ ...form, cin: e.target.value })}
              />
              <input
                className="input"
                type="email"
                placeholder="Contact email *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <button type="submit" className="btn-primary w-full">
                Verify your company →
              </button>
              {submitted && (
                <p className="rounded-xl bg-success/10 p-3 text-sm text-success">
                  Verification request submitted (demo).
                </p>
              )}
            </form>
          </div>
        </div>
        <div className="panel p-7">
          <div className="eyebrow">Recruiter dashboard</div>
          <h2 className="mt-2 text-2xl font-black">Acme Corp Pvt Ltd</h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-4">
              <div className="text-2xl font-black">12</div>
              <div className="text-sm text-slate-500">Active jobs</div>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <div className="text-2xl font-black text-success">✓</div>
              <div className="text-sm text-slate-500">Verified</div>
            </div>
          </div>
          <Link to="/dashboard" className="btn-secondary mt-5 w-full">
            Open dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
