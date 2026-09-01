// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import SectionTitle from "../components/SectionTitle";
// import StatTicker from "../components/StatTicker";

// export default function Home() {
//   const navigate = useNavigate();

//   function analyzeJob() {
//     const text = document.getElementById("homeJob").value;

//     if (!text.trim()) {
//       navigate("/scan");
//       return;
//     }

//     navigate(`/scan?text=${encodeURIComponent(text)}`);
//   }

//   function loadSuspiciousJob() {
//     document.getElementById("homeJob").value =
//       "Earn ₹80,000/month from home. Contact our recruiter only on WhatsApp. Pay ₹2,999 registration fee today.";
//   }

//   return (
//     <>
//       <section className="container-x pt-20 pb-16 sm:pt-28">
//         <div className="mx-auto max-w-4xl text-center">

//           <motion.div
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="eyebrow"
//           >
//             AI-powered job safety
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="mt-5 text-5xl font-black leading-[.95] tracking-[-.04em] sm:text-7xl"
//           >
//             Spot the scam
//             <br />
//             <span className="text-cyan">before they spot you.</span>
//           </motion.h1>

//           <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
//             Paste any job posting. Get an instant fraud score and understand
//             exactly which signals look suspicious.
//           </p>

//           <div className="mx-auto mt-9 max-w-3xl panel p-3 shadow-glow">

//             <textarea
//               id="homeJob"
//               className="input min-h-28 resize-none border-0 bg-transparent"
//               placeholder="Paste a job description or recruiter message..."
//             />

//             <div className="mt-3 flex flex-col gap-3 sm:flex-row">

//               <button
//                 className="btn-primary flex-1"
//                 onClick={analyzeJob}
//               >
//                 ⚡ Analyze Now
//               </button>

//               <button
//                 className="btn-secondary"
//                 onClick={loadSuspiciousJob}
//               >
//                 Try suspicious job
//               </button>

//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="container-x pb-20">
//         <StatTicker />
//       </section>

//       <section className="container-x py-16">
//         <SectionTitle
//           eyebrow="How it works"
//           title="Three steps to a safer job search."
//           text="A simple flow from job posting to explainable fraud report."
//         />

//         <div className="grid gap-4 md:grid-cols-3">

//           {[
//             [
//               "01",
//               "Paste",
//               "Drop in a job description, recruiter message or URL.",
//             ],
//             [
//               "02",
//               "Analyze",
//               "TrueHire checks suspicious signals and patterns.",
//             ],
//             [
//               "03",
//               "Understand",
//               "See the score, red flags and checks that passed.",
//             ],
//           ].map(([number, title, description]) => (
//             <div
//               key={number}
//               className="panel p-6"
//             >
//               <div className="text-sm font-black text-cyan">
//                 {number}
//               </div>

//               <h3 className="mt-5 text-xl font-bold">
//                 {title}
//               </h3>

//               <p className="mt-2 leading-6 text-slate-400">
//                 {description}
//               </p>
//             </div>
//           ))}

//         </div>
//       </section>

//       <section className="container-x py-16">
//         <div className="panel flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">

//           <div>
//             <div className="eyebrow">
//               Not sure about a listing?
//             </div>

//             <h2 className="mt-2 text-2xl font-black">
//               Check it before you apply.
//             </h2>
//           </div>

//           <Link
//             to="/scan"
//             className="btn-primary"
//           >
//             Open Scanner →
//           </Link>

//         </div>
//       </section>
//     </>
//   );

import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import StatTicker from "../components/StatTicker";

export default function Home() {
  const navigate = useNavigate();
  const [jobText, setJobText] = useState("");

  function analyzeJob() {
    if (!jobText.trim()) {
      navigate("/scan");
      return;
    }

    navigate(`/scan?text=${encodeURIComponent(jobText)}`);
  }

  function loadSuspiciousJob() {
    setJobText(
      "Earn ₹80,000/month from home. Contact our recruiter only on WhatsApp. Pay ₹2,999 registration fee today."
    );
  }

  return (
    <>
      <section className="container-x pt-20 pb-16 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow"
          >
            AI-powered job safety
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-5xl font-black leading-[.95] tracking-[-.04em] sm:text-7xl"
          >
            Spot the scam
            <br />
            <span className="text-cyan">before they spot you.</span>
          </motion.h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Paste any job posting. Get an instant fraud score and understand
            exactly which signals look suspicious.
          </p>

          <div className="mx-auto mt-9 max-w-3xl panel p-3 shadow-glow">
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              className="input min-h-28 resize-none border-0 bg-transparent"
              placeholder="Paste a job description or recruiter message..."
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary flex-1" onClick={analyzeJob}>
                ⚡ Analyze Now
              </button>

              <button className="btn-secondary" onClick={loadSuspiciousJob}>
                Try suspicious job
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pb-20">
        <StatTicker />
      </section>

      <section className="container-x py-16">
        <SectionTitle
          eyebrow="How it works"
          title="Three steps to a safer job search."
          text="A simple flow from job posting to explainable fraud report."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "01",
              "Paste",
              "Drop in a job description, recruiter message or URL.",
            ],
            [
              "02",
              "Analyze",
              "TrueHire checks suspicious signals and patterns.",
            ],
            [
              "03",
              "Understand",
              "See the score, red flags and checks that passed.",
            ],
          ].map(([number, title, description]) => (
            <div key={number} className="panel p-6">
              <div className="text-sm font-black text-cyan">{number}</div>

              <h3 className="mt-5 text-xl font-bold">{title}</h3>

              <p className="mt-2 leading-6 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-16">
        <div className="panel flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div>
            <div className="eyebrow">Not sure about a listing?</div>

            <h2 className="mt-2 text-2xl font-black">
              Check it before you apply.
            </h2>
          </div>

          <Link to="/scan" className="btn-primary">
            Open Scanner →
          </Link>
        </div>
      </section>
    </>
  );
}
// }
