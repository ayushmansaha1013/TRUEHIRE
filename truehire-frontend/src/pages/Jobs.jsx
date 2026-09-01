import { useMemo, useState } from "react";
import { jobs } from "../data/mock";
import SectionTitle from "../components/SectionTitle";

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [mode, setMode] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const jobTypes = [
    "All",
    ...new Set(jobs.map((job) => job.type)),
  ];

  const jobModes = [
    "All",
    ...new Set(jobs.map((job) => job.mode)),
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText);

      const matchesType =
        type === "All" || job.type === type;

      const matchesMode =
        mode === "All" || job.mode === mode;

      return (
        matchesSearch &&
        matchesType &&
        matchesMode
      );
    });
  }, [search, type, mode]);

  function resetFilters() {
    setSearch("");
    setType("All");
    setMode("All");
  }

  return (
    <section className="container-x py-14 sm:py-20">

      {/* Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionTitle
          eyebrow="Verified Jobs"
          title="Find jobs with a trust signal."
          text="Browse job listings that have passed TrueHire's verification checks."
        />

        <div className="mb-8 rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
          ✓ Verified listings only
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">

        <div className="panel p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500">
            Verified jobs
          </div>

          <div className="mt-2 text-3xl font-black text-cyan">
            {jobs.length}
          </div>
        </div>

        <div className="panel p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500">
            Companies
          </div>

          <div className="mt-2 text-3xl font-black">
            {new Set(jobs.map((job) => job.company)).size}
          </div>
        </div>

        <div className="panel p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500">
            Showing
          </div>

          <div className="mt-2 text-3xl font-black text-success">
            {filteredJobs.length}
          </div>
        </div>

      </div>

      {/* Search + Filters */}
      <div className="panel mb-8 grid gap-4 p-4 md:grid-cols-[2fr_1fr_1fr_auto]">

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-400">
            Search
          </label>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            placeholder="Search jobs or companies..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-400">
            Job type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input"
          >
            {jobTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-400">
            Work mode
          </label>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="input"
          >
            {jobModes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="btn-secondary w-full"
          >
            Reset
          </button>
        </div>

      </div>

      {/* Job list */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">
          Verified opportunities
        </h2>

        <span className="text-sm text-slate-500">
          {filteredJobs.length} jobs
        </span>
      </div>

      <div className="grid gap-4">

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="panel p-6 transition duration-200 hover:border-cyan/30 hover:bg-white/[0.025]"
          >

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              {/* Job information */}
              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-xs font-bold uppercase tracking-wider text-cyan">
                    {job.type}
                  </span>

                  <span className="text-slate-600">
                    ·
                  </span>

                  <span className="text-xs font-semibold text-slate-400">
                    {job.mode}
                  </span>

                </div>

                <h2 className="mt-2 text-xl font-black">
                  {job.title}
                </h2>

                <p className="mt-1 text-slate-400">
                  {job.company}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  <span className="rounded-full border border-success/20 bg-success/5 px-3 py-1.5 text-xs font-bold text-success">
                    ✓ Identity checked
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
                    ✓ Job details checked
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
                    ✓ No upfront fee
                  </span>

                </div>

              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-3">

                <span className="rounded-full border border-success/30 bg-success/10 px-3 py-2 text-xs font-bold text-success">
                  ✓ VERIFIED
                </span>

                <button
                  className="btn-primary"
                  onClick={() => setSelectedJob(job)}
                >
                  View Job →
                </button>

              </div>

            </div>

          </div>
        ))}

        {!filteredJobs.length && (
          <div className="panel p-12 text-center">

            <div className="text-4xl">
              🔎
            </div>

            <h3 className="mt-4 text-lg font-bold">
              No verified jobs found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={resetFilters}
              className="btn-secondary mt-5"
            >
              Clear filters
            </button>

          </div>
        )}

      </div>

      {/* Job details modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-5 backdrop-blur-sm"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="panel w-full max-w-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-start justify-between gap-4">

              <div>
                <div className="eyebrow">
                  Verified opportunity
                </div>

                <h2 className="mt-2 text-2xl font-black">
                  {selectedJob.title}
                </h2>

                <p className="mt-1 text-slate-400">
                  {selectedJob.company}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="text-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-slate-500">
                  Job type
                </div>

                <div className="mt-1 font-bold">
                  {selectedJob.type}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-slate-500">
                  Work mode
                </div>

                <div className="mt-1 font-bold">
                  {selectedJob.mode}
                </div>
              </div>

            </div>

            <div className="mt-5 rounded-xl border border-success/20 bg-success/5 p-4">

              <div className="font-bold text-success">
                ✓ TrueHire verification
              </div>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                This listing has passed the available verification
                checks. Never pay an employer an upfront registration
                or processing fee.
              </p>

            </div>

            <div className="mt-5 flex gap-3">

              <button
                className="btn-primary flex-1"
                onClick={() =>
                  alert("Application flow can be connected to the backend here.")
                }
              >
                Apply Now
              </button>

              <button
                className="btn-secondary"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}