// import { useEffect, useMemo, useRef, useState } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import { communityReports } from "../data/mock";
// import SectionTitle from "../components/SectionTitle";

// const cityPoints = [
//   {
//     city: "Mumbai",
//     count: 412,
//     lat: 19.076,
//     lng: 72.8777,
//   },
//   {
//     city: "Bengaluru",
//     count: 207,
//     lat: 12.9716,
//     lng: 77.5946,
//   },
//   {
//     city: "Delhi",
//     count: 338,
//     lat: 28.6139,
//     lng: 77.209,
//   },
// ];

// export default function Community() {
//   const [city, setCity] = useState("All");
//   const [jobType, setJobType] = useState("All");
//   const [method, setMethod] = useState("All");
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [reports, setReports] = useState(communityReports);

//   const [form, setForm] = useState({
//     title: "",
//     city: "",
//     jobType: "",
//     method: "",
//     details: "",
//   });

//   const mapContainer = useRef(null);
//   const mapInstance = useRef(null);

//   const filtered = useMemo(() => {
//     return reports.filter((report) => {
//       const matchesCity =
//         city === "All" || report.city === city;

//       const matchesJobType =
//         jobType === "All" || report.jobType === jobType;

//       const matchesMethod =
//         method === "All" || report.method === method;

//       const matchesSearch =
//         report.title
//           .toLowerCase()
//           .includes(search.toLowerCase());

//       return (
//         matchesCity &&
//         matchesJobType &&
//         matchesMethod &&
//         matchesSearch
//       );
//     });
//   }, [city, jobType, method, search, reports]);

//   useEffect(() => {
//     if (!mapContainer.current || mapInstance.current) {
//       return;
//     }

//     const map = L.map(mapContainer.current, {
//       zoomControl: true,
//       attributionControl: true,
//     }).setView([22.5, 78.9], 5);

//     mapInstance.current = map;

//     L.tileLayer(
//       "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//       {
//         maxZoom: 18,
//         attribution: "&copy; OpenStreetMap contributors",
//       }
//     ).addTo(map);

//     cityPoints.forEach((point) => {
//       const size =
//         point.count > 350
//           ? 38
//           : point.count > 250
//           ? 30
//           : 24;

//       L.circleMarker([point.lat, point.lng], {
//         radius: size,
//         color: "#ff4d67",
//         weight: 2,
//         fillColor: "#ff4d67",
//         fillOpacity: 0.28,
//       })
//         .addTo(map)
//         .bindPopup(`
//           <div style="font-family: sans-serif;">
//             <strong>${point.city}</strong><br/>
//             ${point.count} scam reports
//           </div>
//         `);

//       L.circleMarker([point.lat, point.lng], {
//         radius: 7,
//         color: "#08d9ff",
//         weight: 2,
//         fillColor: "#08d9ff",
//         fillOpacity: 1,
//       }).addTo(map);
//     });

//     setTimeout(() => {
//       map.invalidateSize();
//     }, 150);

//     return () => {
//       map.remove();
//       mapInstance.current = null;
//     };
//   }, []);

//   function resetFilters() {
//     setCity("All");
//     setJobType("All");
//     setMethod("All");
//     setSearch("");
//   }

//   function submitReport(e) {
//     e.preventDefault();

//     if (
//       !form.title.trim() ||
//       !form.city.trim() ||
//       !form.details.trim()
//     ) {
//       alert("Please fill in the required fields.");
//       return;
//     }

//     const newReport = {
//       id: Date.now(),
//       title: form.title,
//       city: form.city,
//       jobType: form.jobType || "Other",
//       method: form.method || "Other",
//       score: 80,
//     };

//     setReports((previous) => [
//       newReport,
//       ...previous,
//     ]);

//     setForm({
//       title: "",
//       city: "",
//       jobType: "",
//       method: "",
//       details: "",
//     });

//     setShowModal(false);
//   }

//   return (
//     <section className="container-x py-14 sm:py-20">

//       {/* Header */}
//       <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
//         <SectionTitle
//           eyebrow="Community Watch"
//           title="Scam reports from job seekers."
//           text="Explore suspicious job reports shared by the community and discover scam activity across cities."
//         />

//         <button
//           className="btn-primary mb-8"
//           onClick={() => setShowModal(true)}
//         >
//           ＋ Report Scam
//         </button>
//       </div>

//       {/* Summary */}
//       <div className="mb-6 grid gap-4 sm:grid-cols-3">
//         <div className="panel p-5">
//           <div className="text-xs uppercase tracking-wider text-slate-500">
//             Community reports
//           </div>

//           <div className="mt-2 text-3xl font-black text-cyan">
//             {reports.length}
//           </div>
//         </div>

//         <div className="panel p-5">
//           <div className="text-xs uppercase tracking-wider text-slate-500">
//             Highest activity
//           </div>

//           <div className="mt-2 text-2xl font-black">
//             Mumbai
//           </div>
//         </div>

//         <div className="panel p-5">
//           <div className="text-xs uppercase tracking-wider text-slate-500">
//             Reports flagged
//           </div>

//           <div className="mt-2 text-3xl font-black text-danger">
//             957
//           </div>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="panel mb-4 p-4">
//         <input
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//           className="input"
//           placeholder="Search scam reports..."
//         />
//       </div>

//       {/* Filters */}
//       <div className="panel mb-6 grid gap-3 p-4 md:grid-cols-[1fr_1fr_1fr_auto]">

//         {[
//           [
//             "City",
//             city,
//             setCity,
//             ["All", "Mumbai", "Bengaluru", "Delhi"],
//           ],

//           [
//             "Job type",
//             jobType,
//             setJobType,
//             [
//               "All",
//               "Data Entry",
//               "Software",
//               "Marketing",
//               "Sales",
//             ],
//           ],

//           [
//             "Method",
//             method,
//             setMethod,
//             [
//               "All",
//               "WhatsApp",
//               "Telegram",
//               "Email",
//             ],
//           ],
//         ].map(
//           ([
//             label,
//             value,
//             setter,
//             options,
//           ]) => (
//             <label
//               key={label}
//               className="text-sm font-semibold"
//             >
//               <span className="mb-2 block text-slate-400">
//                 {label}
//               </span>

//               <select
//                 value={value}
//                 onChange={(e) =>
//                   setter(e.target.value)
//                 }
//                 className="input"
//               >
//                 {options.map((option) => (
//                   <option
//                     key={option}
//                     value={option}
//                   >
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           )
//         )}

//         <div className="flex items-end">
//           <button
//             onClick={resetFilters}
//             className="btn-secondary w-full"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* Feed + Map */}
//       <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">

//         {/* Feed */}
//         <div>
//           <div className="mb-3 flex items-center justify-between">
//             <h2 className="font-black">
//               Recent reports
//             </h2>

//             <span className="text-sm text-slate-500">
//               {filtered.length} results
//             </span>
//           </div>

//           <div className="space-y-3">
//             {filtered.map((report) => (
//               <div
//                 key={report.id}
//                 className="panel p-5 transition hover:border-cyan/30"
//               >
//                 <div className="flex items-start justify-between gap-4">

//                   <div>
//                     <div className="text-xs font-bold uppercase tracking-wider text-cyan">
//                       {report.city}
//                       {" · "}
//                       {report.jobType}
//                     </div>

//                     <h3 className="mt-2 text-lg font-bold">
//                       {report.title}
//                     </h3>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
//                         {report.method}
//                       </span>

//                       <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
//                         Community report
//                       </span>
//                     </div>
//                   </div>

//                   <span className="shrink-0 rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
//                     {report.score}/100
//                   </span>
//                 </div>
//               </div>
//             ))}

//             {!filtered.length && (
//               <div className="panel p-12 text-center">
//                 <div className="text-3xl">
//                   🔎
//                 </div>

//                 <h3 className="mt-3 font-bold">
//                   No reports found
//                 </h3>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Try changing your search or filters.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Map */}
//         <div>
//           <div className="mb-3">
//             <h2 className="font-black">
//               Scam activity map
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               Community scam density by city.
//             </p>
//           </div>

//           <div className="panel overflow-hidden p-2">
//             <div
//               ref={mapContainer}
//               className="h-[480px] w-full rounded-xl"
//             />
//           </div>

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { communityReports } from "../data/mock";
import SectionTitle from "../components/SectionTitle";

// Fix Leaflet's default marker icon issue in React/Vite builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const cityPoints = [
  { city: "Mumbai", count: 412, lat: 19.076, lng: 72.8777 },
  { city: "Bengaluru", count: 207, lat: 12.9716, lng: 77.5946 },
  { city: "Delhi", count: 338, lat: 28.6139, lng: 77.209 },
];

export default function Community() {
  const [city, setCity] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [method, setMethod] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [reports, setReports] = useState(communityReports);

  const [form, setForm] = useState({
    title: "",
    city: "",
    jobType: "",
    method: "",
    details: "",
  });

  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  const filtered = useMemo(() => {
    return reports.filter((report) => {
      const matchesCity = city === "All" || report.city === city;
      const matchesJobType = jobType === "All" || report.jobType === jobType;
      const matchesMethod = method === "All" || report.method === method;
      const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase());

      return matchesCity && matchesJobType && matchesMethod && matchesSearch;
    });
  }, [city, jobType, method, search, reports]);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Initialize map instance
    const map = L.map(mapContainer.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([22.5, 78.9], 5);

    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    cityPoints.forEach((point) => {
      const size = point.count > 350 ? 38 : point.count > 250 ? 30 : 24;

      L.circleMarker([point.lat, point.lng], {
        radius: size,
        color: "#ff4d67",
        weight: 2,
        fillColor: "#ff4d67",
        fillOpacity: 0.28,
      })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; color: #111;">
            <strong>${point.city}</strong><br/>
            ${point.count} scam reports
          </div>
        `);

      L.circleMarker([point.lat, point.lng], {
        radius: 7,
        color: "#08d9ff",
        weight: 2,
        fillColor: "#08d9ff",
        fillOpacity: 1,
      }).addTo(map);
    });

    const timer = setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  function resetFilters() {
    setCity("All");
    setJobType("All");
    setMethod("All");
    setSearch("");
  }

  function submitReport(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.city.trim() || !form.details.trim()) {
      alert("Please fill in all required fields (*).");
      return;
    }

    const newReport = {
      id: Date.now(),
      title: form.title,
      city: form.city,
      jobType: form.jobType || "Other",
      method: form.method || "Other",
      score: 80,
    };

    setReports((previous) => [newReport, ...previous]);
    setForm({ title: "", city: "", jobType: "", method: "", details: "" });
    setShowModal(false);
  }

  return (
    <section className="container-x py-14 sm:py-20">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <SectionTitle
          eyebrow="Community Watch"
          title="Scam reports from job seekers."
          text="Explore suspicious job reports shared by the community and discover scam activity across cities."
        />

        <button className="btn-primary mb-8" onClick={() => setShowModal(true)}>
          ＋ Report Scam
        </button>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500">Community reports</div>
          <div className="mt-2 text-3xl font-black text-cyan">{reports.length}</div>
        </div>

        <div className="panel p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500">Highest activity</div>
          <div className="mt-2 text-2xl font-black">Mumbai</div>
        </div>

        <div className="panel p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500">Reports flagged</div>
          <div className="mt-2 text-3xl font-black text-danger">957</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="panel mb-4 p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          placeholder="Search scam reports..."
        />
      </div>

      {/* Filter Selectors */}
      <div className="panel mb-6 grid gap-3 p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
        {[
          ["City", city, setCity, ["All", "Mumbai", "Bengaluru", "Delhi"]],
          ["Job type", jobType, setJobType, ["All", "Data Entry", "Software", "Marketing", "Sales"]],
          ["Method", method, setMethod, ["All", "WhatsApp", "Telegram", "Email"]],
        ].map(([label, value, setter, options]) => (
          <label key={label} className="text-sm font-semibold">
            <span className="mb-2 block text-slate-400">{label}</span>
            <select value={value} onChange={(e) => setter(e.target.value)} className="input">
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}

        <div className="flex items-end">
          <button onClick={resetFilters} className="btn-secondary w-full">
            Reset
          </button>
        </div>
      </div>

      {/* Feed & Interactive Map */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Reports Feed */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-black">Recent reports</h2>
            <span className="text-sm text-slate-500">{filtered.length} results</span>
          </div>

          <div className="space-y-3">
            {filtered.map((report) => (
              <div key={report.id} className="panel p-5 transition hover:border-cyan/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan">
                      {report.city} · {report.jobType}
                    </div>

                    <h3 className="mt-2 text-lg font-bold">{report.title}</h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                        {report.method}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                        Community report
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
                    {report.score}/100
                  </span>
                </div>
              </div>
            ))}

            {!filtered.length && (
              <div className="panel p-12 text-center">
                <div className="text-3xl">🔎</div>
                <h3 className="mt-3 font-bold">No reports found</h3>
                <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Leaflet Map Column */}
        <div>
          <div className="mb-3">
            <h2 className="font-black">Scam activity map</h2>
            <p className="mt-1 text-sm text-slate-500">Community scam density by city.</p>
          </div>

          <div className="panel overflow-hidden p-2">
            <div ref={mapContainer} className="h-[480px] w-full rounded-xl" />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {cityPoints.map((point) => (
              <div key={point.city} className="panel p-3 text-center">
                <div className="text-xs text-slate-500">{point.city}</div>
                <div className="mt-1 text-xl font-black text-cyan">{point.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-5 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <form
            onSubmit={submitReport}
            onClick={(e) => e.stopPropagation()}
            className="panel w-full max-w-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="eyebrow">Community report</div>
                <h2 className="mt-1 text-2xl font-black">Report a scam</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
                placeholder="Job title / scam title *"
              />

              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input"
                placeholder="City *"
              />

              <select
                value={form.jobType}
                onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                className="input"
              >
                <option value="">Select job type</option>
                <option>Data Entry</option>
                <option>Software</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Other</option>
              </select>

              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                className="input"
              >
                <option value="">Contact method</option>
                <option>WhatsApp</option>
                <option>Telegram</option>
                <option>Email</option>
                <option>Other</option>
              </select>

              <textarea
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className="input min-h-32"
                placeholder="What happened? *"
              />

              <button type="submit" className="btn-primary w-full">
                Submit Scam Report
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
          <div className="mt-3 grid grid-cols-3 gap-3">
            {cityPoints.map((point) => (
              <div
                key={point.city}
                className="panel p-3 text-center"
              >
                <div className="text-xs text-slate-500">
                  {point.city}
                </div>

                <div className="mt-1 text-xl font-black text-cyan">
                  {point.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-5 backdrop-blur-sm"
          onClick={() =>
            setShowModal(false)
          }
        >
          <form
            onSubmit={submitReport}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="panel w-full max-w-xl p-6"
          >

            <div className="flex items-center justify-between">
              <div>
                <div className="eyebrow">
                  Community report
                </div>

                <h2 className="mt-1 text-2xl font-black">
                  Report a scam
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="text-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="input"
                placeholder="Job title / scam title *"
              />

              <input
                value={form.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    city: e.target.value,
                  })
                }
                className="input"
                placeholder="City *"
              />

              <select
                value={form.jobType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    jobType:
                      e.target.value,
                  })
                }
                className="input"
              >
                <option value="">
                  Select job type
                </option>

                <option>
                  Data Entry
                </option>

                <option>
                  Software
                </option>

                <option>
                  Marketing
                </option>

                <option>
                  Sales
                </option>

                <option>
                  Other
                </option>
              </select>

              <select
                value={form.method}
                onChange={(e) =>
                  setForm({
                    ...form,
                    method:
                      e.target.value,
                  })
                }
                className="input"
              >
                <option value="">
                  Contact method
                </option>

                <option>
                  WhatsApp
                </option>

                <option>
                  Telegram
                </option>

                <option>
                  Email
                </option>

                <option>
                  Other
                </option>
              </select>

              <textarea
                value={form.details}
                onChange={(e) =>
                  setForm({
                    ...form,
                    details:
                      e.target.value,
                  })
                }
                className="input min-h-32"
                placeholder="What happened? *"
              />

              <button
                type="submit"
                className="btn-primary w-full"
              >
                Submit Scam Report
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
