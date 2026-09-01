// import { useEffect, useMemo, useState } from "react";

// const API_URL = "http://localhost:8000";

// const DEMO_SAFE = `Frontend Developer Intern

// Company: Nova Technologies
// Location: Bengaluru, India
// Work Mode: Hybrid

// We are looking for a motivated Frontend Developer Intern to join our engineering team.

// You will work with experienced developers to build and maintain responsive web applications using HTML, CSS, JavaScript, and React.

// Responsibilities:
// - Build frontend components
// - Fix bugs
// - Work with the development team

// Requirements:
// - Basic JavaScript knowledge
// - React fundamentals
// - Good communication skills

// No registration fee is required.
// Candidates will go through an interview process.`;

// const DEMO_SCAM = `Earn ₹50,000 per month with no experience required.
// Pay ₹999 registration fee.
// Contact only through WhatsApp.
// Send your Aadhaar and bank account details.
// No interview required.
// Limited slots available. Apply immediately.`;

// const INITIAL_RESULT = {
//   fraud_score: 0,
//   risk_level: "LOW",
//   ml_probability: 0,
//   signals_fired: [],
//   signals_passed: [],
//   company_name: null,
//   job_title: null,
//   salary_claimed: null,
//   location: null,
// };

// /* ---------------- RISK HELPERS ---------------- */

// function normalizeRisk(risk) {
//   if (!risk) return "LOW";

//   const value = String(risk).toUpperCase();

//   if (value.includes("CRITICAL")) return "CRITICAL";
//   if (value.includes("HIGH")) return "HIGH";
//   if (value.includes("MEDIUM")) return "MEDIUM";

//   return "LOW";
// }

// function getRiskLabel(risk) {
//   switch (normalizeRisk(risk)) {
//     case "CRITICAL":
//       return "CRITICAL RISK";
//     case "HIGH":
//       return "HIGH RISK";
//     case "MEDIUM":
//       return "MEDIUM RISK";
//     default:
//       return "LOW RISK";
//   }
// }

// function getRiskColor(risk) {
//   switch (normalizeRisk(risk)) {
//     case "CRITICAL":
//     case "HIGH":
//       return "#ff4d6d";

//     case "MEDIUM":
//       return "#ffd21c";

//     default:
//       return "#22d36b";
//   }
// }

// function getScoreColor(score) {
//   if (score >= 70) return "#ff4d6d";
//   if (score >= 30) return "#ffd21c";
//   return "#22d36b";
// }

// /* ---------------- SIGNAL CARD ---------------- */

// function SignalCard({ signal, fired }) {
//   const name =
//     typeof signal === "string"
//       ? signal
//       : signal?.label ||
//         signal?.name ||
//         signal?.title ||
//         "Suspicious signal";

//   const reason =
//     typeof signal === "string"
//       ? ""
//       : signal?.reason ||
//         signal?.description ||
//         signal?.message ||
//         "";

//   const category =
//     typeof signal === "string"
//       ? ""
//       : signal?.category || "";

//   return (
//     <div
//       className={`rounded-xl border p-4 ${
//         fired
//           ? "border-[#ff4d6d]/30 bg-[#ff4d6d]/5"
//           : "border-white/10 bg-white/[0.02]"
//       }`}
//     >
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="font-semibold text-white">
//             {name}
//           </p>

//           {reason && (
//             <p className="mt-2 text-sm leading-6 text-slate-400">
//               {reason}
//             </p>
//           )}

//           {category && (
//             <span className="mt-3 inline-block rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-500">
//               {category}
//             </span>
//           )}
//         </div>

//         <span
//           className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
//             fired
//               ? "bg-[#ff4d6d]/10 text-[#ff4d6d]"
//               : "bg-[#22d36b]/10 text-[#22d36b]"
//           }`}
//         >
//           {fired ? "FLAGGED" : "PASSED"}
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ---------------- MAIN COMPONENT ---------------- */

// export default function Scan() {
//   const [text, setText] = useState("");
//   const [result, setResult] = useState(INITIAL_RESULT);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [hasAnalyzed, setHasAnalyzed] = useState(false);

//   const score = Math.max(
//     0,
//     Math.min(100, Number(result?.fraud_score ?? result?.score ?? 0))
//   );

//   const risk = normalizeRisk(
//     result?.risk_level ??
//       result?.risk ??
//       result?.verdict
//   );

//   const firedSignals = Array.isArray(result?.signals_fired)
//     ? result.signals_fired
//     : Array.isArray(result?.signals)
//     ? result.signals
//     : [];

//   const passedSignals = Array.isArray(result?.signals_passed)
//     ? result.signals_passed
//     : [];

//   const scoreColor = getScoreColor(score);

//   const circumference = 2 * Math.PI * 105;

//   const dashOffset =
//     circumference - (score / 100) * circumference;

//   const progressStyle = useMemo(
//     () => ({
//       strokeDasharray: circumference,
//       strokeDashoffset: dashOffset,
//       stroke: scoreColor,
//     }),
//     [circumference, dashOffset, scoreColor]
//   );

//   /* ---------------- ANALYZE ---------------- */

//   async function analyzeJob() {
//     if (!text.trim()) {
//       setError(
//         "Please paste a job posting or recruiter message first."
//       );
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       console.log("Sending scan request...");

//       /*
//        * IMPORTANT:
//        * Your FastAPI Swagger shows that /api/scan
//        * expects:
//        *
//        * {
//        *   "input_type": "text",
//        *   "content": "..."
//        * }
//        */

//       const response = await fetch(
//         `${API_URL}/api/scan`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },

//           body: JSON.stringify({
//             input_type: "text",
//             content: text.trim(),
//           }),
//         }
//       );

//       console.log(
//         "Backend response status:",
//         response.status
//       );

//       const responseText = await response.text();

//       let data = {};

//       try {
//         data = responseText
//           ? JSON.parse(responseText)
//           : {};
//       } catch {
//         throw new Error(
//           "Backend returned an invalid JSON response."
//         );
//       }

//       console.log("Scan result:", data);

//       if (!response.ok) {
//         let message = `Server error: ${response.status}`;

//         if (data?.detail) {
//           message =
//             typeof data.detail === "string"
//               ? data.detail
//               : JSON.stringify(data.detail);
//         }

//         if (data?.message) {
//           message = data.message;
//         }

//         throw new Error(message);
//       }

//       /*
//        * Normalize backend response.
//        * This allows the frontend to work even if
//        * some response field names are slightly different.
//        */

//       const normalizedResult = {
//         ...INITIAL_RESULT,
//         ...data,

//         fraud_score: Number(
//           data?.fraud_score ??
//             data?.score ??
//             data?.fraudScore ??
//             data?.risk_score ??
//             0
//         ),

//         risk_level: normalizeRisk(
//           data?.risk_level ??
//             data?.risk ??
//             data?.verdict ??
//             "LOW"
//         ),

//         ml_probability: Number(
//           data?.ml_probability ?? 0
//         ),

//         signals_fired: Array.isArray(
//           data?.signals_fired
//         )
//           ? data.signals_fired
//           : Array.isArray(data?.signals)
//           ? data.signals
//           : Array.isArray(
//               data?.suspicious_signals
//             )
//           ? data.suspicious_signals
//           : [],

//         signals_passed: Array.isArray(
//           data?.signals_passed
//         )
//           ? data.signals_passed
//           : [],

//         company_name:
//           data?.company_name ??
//           data?.company ??
//           null,

//         job_title:
//           data?.job_title ??
//           data?.jobTitle ??
//           null,

//         salary_claimed:
//           data?.salary_claimed ??
//           data?.salary ??
//           data?.stipend ??
//           null,

//         location:
//           data?.location ??
//           null,
//       };

//       setResult(normalizedResult);
//       setHasAnalyzed(true);
//     } catch (err) {
//       console.error("Scan failed:", err);

//       if (
//         err?.message?.includes("Failed to fetch")
//       ) {
//         setError(
//           "Cannot connect to the backend. Make sure FastAPI is running on http://localhost:8000."
//         );
//       } else {
//         setError(
//           err?.message ||
//             "Unable to analyze this job."
//         );
//       }

//       setHasAnalyzed(false);
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ---------------- DEMOS ---------------- */

//   function loadSafeDemo() {
//     setText(DEMO_SAFE);
//     setError("");
//     setHasAnalyzed(false);
//   }

//   function loadScamDemo() {
//     setText(DEMO_SCAM);
//     setError("");
//     setHasAnalyzed(false);
//   }

//   function loadDemo() {
//     setText(DEMO_SCAM);
//     setError("");
//     setHasAnalyzed(false);
//   }

//   /* ---------------- CLEAR ---------------- */

//   function clearAll() {
//     setText("");
//     setResult(INITIAL_RESULT);
//     setError("");
//     setHasAnalyzed(false);
//   }

//   /* ---------------- URL TEXT ---------------- */

//   useEffect(() => {
//     const params = new URLSearchParams(
//       window.location.search
//     );

//     const queryText = params.get("text");

//     if (queryText) {
//       setText(queryText);
//     }
//   }, []);

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="min-h-screen bg-[#070b20] text-white">

//       {/* Background */}

//       <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

//         <div className="absolute left-[-180px] top-[100px] h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[130px]" />

//         <div className="absolute right-[-180px] top-[100px] h-[550px] w-[550px] rounded-full bg-purple-600/10 blur-[130px]" />

//         <div
//           className="absolute inset-0 opacity-30"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
//             backgroundSize: "54px 54px",
//           }}
//         />
//       </div>

//       <main className="mx-auto w-full max-w-[1240px] px-5 pb-24 pt-16 sm:px-8 lg:px-10">

//         {/* HEADER */}

//         <section className="mb-10">

//           <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#00e5ff]">
//             Scanner → Report
//           </p>

//           <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
//             Check a job in seconds.
//           </h1>

//           <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">
//             Analyze job postings and recruiter
//             messages for suspicious signals before
//             you apply.
//           </p>

//         </section>

//         {/* MAIN GRID */}

//         <section className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(340px,0.8fr)]">

//           {/* LEFT SIDE */}

//           <div className="rounded-2xl border border-white/10 bg-[#11162f]/90 p-5 shadow-2xl sm:p-8">

//             <div className="mb-5 flex items-center justify-between">

//               <h2 className="text-base font-bold text-white">
//                 Job posting / recruiter message
//               </h2>

//               <span className="text-xs text-slate-500">
//                 TrueHire Scanner
//               </span>

//             </div>

//             {/* TEXTAREA */}

//             <textarea
//               value={text}
//               onChange={(e) => {
//                 setText(e.target.value);
//                 setError("");
//               }}
//               placeholder="Paste the job posting or recruiter message here..."
//               className="min-h-[340px] w-full resize-y rounded-xl border border-white/10 bg-[#080d24] p-5 text-[16px] leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]/60 focus:ring-1 focus:ring-[#00e5ff]/30"
//             />

//             {/* CHARACTER COUNT */}

//             <div className="mt-3 flex items-center justify-between text-xs text-slate-600">

//               <span>
//                 {text.length} characters
//               </span>

//               <span>
//                 {loading
//                   ? "ANALYZING..."
//                   : "TrueHire Scanner"}
//               </span>

//             </div>

//             {/* ERROR */}

//             {error && (
//               <div className="mt-4 rounded-xl border border-[#ff4d6d]/30 bg-[#ff4d6d]/10 px-4 py-3 text-sm text-[#ff8ba0]">
//                 {error}
//               </div>
//             )}

//             {/* BUTTONS */}

//             <div className="mt-5 flex flex-col gap-3 sm:flex-row">

//               <button
//                 onClick={analyzeJob}
//                 disabled={loading}
//                 className="flex min-h-[58px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#10dff0] px-6 font-bold text-[#06101e] transition hover:bg-[#2be5f4] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 <span className="text-lg">
//                   ϟ
//                 </span>

//                 {loading
//                   ? "Analyzing..."
//                   : "Analyze Now"}
//               </button>

//               <button
//                 onClick={loadDemo}
//                 disabled={loading}
//                 className="min-h-[58px] rounded-xl border border-white/10 bg-white/[0.03] px-7 font-medium text-slate-200 transition hover:bg-white/[0.07]"
//               >
//                 Load demo
//               </button>

//               <button
//                 onClick={clearAll}
//                 disabled={loading}
//                 className="min-h-[58px] rounded-xl border border-white/10 bg-white/[0.03] px-7 font-medium text-slate-200 transition hover:bg-white/[0.07]"
//               >
//                 Clear
//               </button>

//             </div>

//             {/* EXAMPLE BUTTONS */}

//             <div className="mt-4 flex flex-wrap gap-2">

//               <button
//                 onClick={loadSafeDemo}
//                 disabled={loading}
//                 className="rounded-lg border border-[#22d36b]/20 bg-[#22d36b]/5 px-3 py-2 text-xs text-[#22d36b] transition hover:bg-[#22d36b]/10"
//               >
//                 Load safe example
//               </button>

//               <button
//                 onClick={loadScamDemo}
//                 disabled={loading}
//                 className="rounded-lg border border-[#ff4d6d]/20 bg-[#ff4d6d]/5 px-3 py-2 text-xs text-[#ff8ba0] transition hover:bg-[#ff4d6d]/10"
//               >
//                 Load scam example
//               </button>

//             </div>

//           </div>

//           {/* RIGHT SCORE CARD */}

//           <div className="rounded-2xl border border-white/10 bg-[#11162f]/90 p-6 shadow-2xl sm:p-8">

//             <div className="flex min-h-full flex-col items-center justify-center">

//               {/* GAUGE */}

//               <div className="relative h-[250px] w-[250px]">

//                 <svg
//                   className="h-full w-full -rotate-90"
//                   viewBox="0 0 250 250"
//                 >

//                   {/* BACKGROUND */}

//                   <circle
//                     cx="125"
//                     cy="125"
//                     r="105"
//                     fill="none"
//                     stroke="#29304b"
//                     strokeWidth="18"
//                   />

//                   {/* SCORE */}

//                   <circle
//                     cx="125"
//                     cy="125"
//                     r="105"
//                     fill="none"
//                     strokeWidth="18"
//                     strokeLinecap="round"
//                     style={{
//                       ...progressStyle,
//                       transition:
//                         "stroke-dashoffset 700ms ease, stroke 300ms ease",
//                     }}
//                   />

//                 </svg>

//                 {/* CENTER */}

//                 <div className="absolute inset-0 flex flex-col items-center justify-center">

//                   <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.45em] text-slate-500">
//                     Fraud Score
//                   </p>

//                   <div className="text-7xl font-black tracking-tight">
//                     {score}
//                   </div>

//                   <div
//                     className="mt-1 text-sm font-bold uppercase"
//                     style={{
//                       color: scoreColor,
//                     }}
//                   >
//                     {getRiskLabel(risk)}
//                   </div>

//                 </div>

//               </div>

//               {/* RISK */}

//               <div className="mt-7 text-center">

//                 <p
//                   className="text-xl font-black uppercase tracking-wider"
//                   style={{
//                     color: scoreColor,
//                   }}
//                 >
//                   {getRiskLabel(risk)}
//                 </p>

//                 <p className="mt-3 text-sm text-slate-500">

//                   {firedSignals.length} suspicious
//                   signal
//                   {firedSignals.length === 1
//                     ? ""
//                     : "s"} detected

//                 </p>

//               </div>

//               {/* ML PROBABILITY */}

//               {result.ml_probability > 0 && (
//                 <div className="mt-7 w-full rounded-xl border border-white/10 bg-white/[0.02] p-4">

//                   <div className="mb-2 flex items-center justify-between text-xs">

//                     <span className="text-slate-500">
//                       ML probability
//                     </span>

//                     <span className="font-semibold text-slate-300">

//                       {Math.round(
//                         result.ml_probability <= 1
//                           ? result.ml_probability * 100
//                           : result.ml_probability
//                       )}
//                       %

//                     </span>

//                   </div>

//                   <div className="h-2 overflow-hidden rounded-full bg-white/10">

//                     <div
//                       className="h-full rounded-full transition-all duration-700"
//                       style={{
//                         width: `${Math.min(
//                           100,
//                           result.ml_probability <= 1
//                             ? result.ml_probability * 100
//                             : result.ml_probability
//                         )}%`,
//                         backgroundColor:
//                           scoreColor,
//                       }}
//                     />

//                   </div>

//                 </div>
//               )}

//             </div>

//           </div>

//         </section>

//         {/* REPORT */}

//         {hasAnalyzed && (
//           <section className="mt-7 rounded-2xl border border-white/10 bg-[#11162f]/90 p-6 shadow-2xl sm:p-8">

//             {/* REPORT HEADER */}

//             <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//               <div>

//                 <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00e5ff]">
//                   Fraud Report
//                 </p>

//                 <h2 className="mt-2 text-2xl font-bold text-white">
//                   Analysis details
//                 </h2>

//               </div>

//               <div
//                 className="rounded-full border px-4 py-2 text-xs font-bold uppercase"
//                 style={{
//                   borderColor: scoreColor,
//                   color: scoreColor,
//                 }}
//               >
//                 {risk}
//               </div>

//             </div>

//             {/* JOB DETAILS */}

//             <div className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

//               <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

//                 <p className="text-xs uppercase tracking-wider text-slate-600">
//                   Job title
//                 </p>

//                 <p className="mt-2 font-semibold text-slate-200">
//                   {result.job_title ||
//                     "Unknown Role"}
//                 </p>

//               </div>

//               <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

//                 <p className="text-xs uppercase tracking-wider text-slate-600">
//                   Company
//                 </p>

//                 <p className="mt-2 font-semibold text-slate-200">
//                   {result.company_name ||
//                     "Unknown Company"}
//                 </p>

//               </div>

//               <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

//                 <p className="text-xs uppercase tracking-wider text-slate-600">
//                   Salary claimed
//                 </p>

//                 <p className="mt-2 font-semibold text-slate-200">
//                   {result.salary_claimed ||
//                     "Not specified"}
//                 </p>

//               </div>

//               <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

//                 <p className="text-xs uppercase tracking-wider text-slate-600">
//                   Location
//                 </p>

//                 <p className="mt-2 font-semibold text-slate-200">
//                   {result.location ||
//                     "Not specified"}
//                 </p>

//               </div>

//             </div>

//             {/* SUSPICIOUS SIGNALS */}

//             <div>

//               <div className="mb-4 flex items-center justify-between">

//                 <h3 className="font-bold text-white">
//                   Suspicious signals
//                 </h3>

//                 <span className="rounded-full bg-[#ff4d6d]/10 px-3 py-1 text-xs font-bold text-[#ff4d6d]">
//                   {firedSignals.length} flagged
//                 </span>

//               </div>

//               {firedSignals.length > 0 ? (

//                 <div className="grid gap-3 md:grid-cols-2">

//                   {firedSignals.map(
//                     (signal, index) => (
//                       <SignalCard
//                         key={
//                           signal?.id ??
//                           signal?.name ??
//                           `fired-${index}`
//                         }
//                         signal={signal}
//                         fired={true}
//                       />
//                     )
//                   )}

//                 </div>

//               ) : (

//                 <div className="rounded-xl border border-[#22d36b]/20 bg-[#22d36b]/5 p-5">

//                   <p className="font-semibold text-[#22d36b]">
//                     No suspicious signals detected.
//                   </p>

//                   <p className="mt-1 text-sm text-slate-400">
//                     The provided job posting did not
//                     trigger any configured fraud signals.
//                   </p>

//                 </div>

//               )}

//             </div>

//             {/* PASSED SIGNALS */}

//             {passedSignals.length > 0 && (

//               <div className="mt-8">

//                 <div className="mb-4 flex items-center justify-between">

//                   <h3 className="font-bold text-white">
//                     Signals passed
//                   </h3>

//                   <span className="rounded-full bg-[#22d36b]/10 px-3 py-1 text-xs font-bold text-[#22d36b]">
//                     {passedSignals.length} passed
//                   </span>

//                 </div>

//                 <div className="grid gap-3 md:grid-cols-2">

//                   {passedSignals.map(
//                     (signal, index) => (
//                       <SignalCard
//                         key={
//                           signal?.id ??
//                           signal?.name ??
//                           `passed-${index}`
//                         }
//                         signal={signal}
//                         fired={false}
//                       />
//                     )
//                   )}

//                 </div>

//               </div>

//             )}

//           </section>
//         )}

//       </main>

//     </div>
//   );
// }


// At the top of Scan.jsx - reading dynamic URL from Vite env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Inside your scan handle submission function (around lines 240-250)
const response = await fetch(`${API_URL}/api/scan`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Bypasses Ngrok warning page for API requests
  },
  body: JSON.stringify({
    input_type: "text",
    content: text.trim(),
  }),
});
