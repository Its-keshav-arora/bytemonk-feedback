"use client";

import { useEffect, useMemo, useState } from "react";

// Small helper for classNames
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Clickable star rating input (1..5)
function StarRating({ value, onChange, idPrefix = "rating" }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1" aria-label="Rating">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          aria-label={`${s} star${s > 1 ? "s" : ""}`}
          onClick={() => onChange(s.toString())}
          className={cx(
            "transition-transform hover:scale-110",
            s <= Number(value)
              ? "text-yellow-400"
              : "text-gray-500 hover:text-gray-400"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 drop-shadow"
          >
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// Simple skeleton for feedback cards
function FeedbackSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-800/60 border border-gray-700 p-5 rounded-2xl shadow-md animate-pulse"
        >
          <div className="h-5 w-24 bg-gray-700 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-700 rounded mb-4" />
          <div className="h-16 w-full bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dummy = [
    {
      name: "Keshav",
      email: "keshav11y@gmail.com",
      course: "System Design",
      rating: 5,
      howHeard: "LinkedIn",
      message: "I loved the way Bytemonk teaches me each and every topic !!",
      canContact: false,
    },
    {
      name: "Himalay",
      email: "himalay@gmail.com",
      course: "Spring Boot",
      rating: 4,
      howHeard: "Youtube",
      message: "The animations are awesome !! I loved how I am getting broader knowledge of all the topics in animated way",
      canContact: false,
    },
  ];
  const [feedbacks, setFeedbacks] = useState(dummy);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    rating: "",
    howHeard: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/feedback");
        if (!res.ok) throw new Error("Failed to load feedback");
        const data = await res.json();
        if (mounted) setFeedbacks(data || []);
      } catch (e) {
        if (mounted) setErrorMsg("Couldn't load feedback. Try again later.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowForm(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      errs.email = "Valid email required";
    if (!formData.course) errs.course = "Please select a course";
    if (!formData.rating) errs.rating = "Please select a rating";
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      setSuccess("✅ Thank you for your feedback!");
      setFormData({
        name: "",
        email: "",
        course: "",
        rating: "",
        howHeard: "",
        message: "",
      });
      setErrors({});
      const updated = await res.json();
      setFeedbacks(updated || []);
      setShowForm(false);

      // auto-hide success banner
      setTimeout(() => setSuccess(""), 3500);
    } catch (e) {
      setErrorMsg("Submission failed. Please try again.");
      setTimeout(() => setErrorMsg(""), 3500);
    }
  };

  const courses = useMemo(
    () => ["System Design", "Spring Boot", "GenAI", "Security"],
    []
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] bg-black from-indigo-900 via-gray-900 to-black text-white">
      {/* Glow background accents */}
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-600 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-600 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative w-full py-10 flex flex-col items-center text-center px-4">
        <img
          src="/logo.png"
          alt="ByteMonk Logo"
          className="h-16 mb-3 drop-shadow-lg"
        />
        <h1 className="text-4xl pb-2 md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-emerald-300">
          ByteMonk Course Feedback
        </h1>
        <p className="text-gray-300 mt-2 max-w-xl">
          Your thoughts make us better{" "}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </p>

        {/* CTA Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowForm(true)}
            className="group cursor-pointer relative inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-600 to-fuchsia-600 px-6 py-3 text-base font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <span>Send Feedback</span>
            <span className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-white/20 transition" />
          </button>
        </div>

        {/* Success / Error banner */}
        <div className="mt-4 h-6">
          {success && (
            <p className="text-emerald-300/90 text-sm md:text-base">
              {success}
            </p>
          )}
          {errorMsg && (
            <p className="text-rose-300/90 text-sm md:text-base">{errorMsg}</p>
          )}
        </div>
      </header>

      {/* Modal Form */}
      {showForm && (
        <div
          id="modal-overlay"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target.id === "modal-overlay") setShowForm(false);
          }}
        >
          <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl">
            {/* Card */}
            <form
              onSubmit={handleSubmit}
              className="relative mx-auto w-full rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/95 to-black/90 p-6 md:p-8 shadow-2xl backdrop-blur-lg max-h-[90vh] overflow-y-auto overscroll-contain"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl md:text-2xl font-bold">
                    Submit Feedback
                </h2>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close"
                  className="rounded-xl cursor-pointer border border-white/10 px-3 py-1 text-sm text-gray-200 hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              {/* Grid layout */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-1">
                  <label className="mb-1 block text-sm font-semibold">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={cx(
                      "w-full rounded-xl border bg-gray-800/70 p-3 py-2 outline-none",
                      "border-gray-700 focus:ring-2 focus:ring-cyan-500"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-rose-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="col-span-1">
                  <label className="mb-1 block text-sm font-semibold">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={cx(
                      "w-full rounded-xl border bg-gray-800/70 p-3 py-2 outline-none",
                      "border-gray-700 focus:ring-2 focus:ring-cyan-500"
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-rose-400">{errors.email}</p>
                  )}
                </div>

                {/* Course */}
                <div className="col-span-1">
                  <label className="mb-1 block text-sm font-semibold">
                    Course *
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({ ...formData, course: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/70 p-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">-- Choose a course --</option>
                    {courses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.course && (
                    <p className="mt-1 text-sm text-rose-400">
                      {errors.course}
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div className="col-span-1">
                  <label className="mb-1 block text-sm font-semibold">
                    Rating *
                  </label>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-700 bg-gray-800/50 p-3 py-2">
                    <StarRating
                      value={formData.rating}
                      onChange={(v) => setFormData({ ...formData, rating: v })}
                    />
                  </div>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-rose-400">
                      {errors.rating}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold ">
                    How did you hear about us? (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.howHeard}
                    onChange={(e) =>
                      setFormData({ ...formData, howHeard: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/70 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold">
                    Feedback Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="h-28 w-full rounded-xl border border-gray-700 bg-gray-800/70 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-rose-400">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border cursor-pointer border-gray-600 px-4 py-2 text-gray-200 transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl cursor-pointer bg-gradient-to-r from-cyan-600 to-fuchsia-600 px-5 py-2 font-semibold shadow-lg transition hover:brightness-110"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Feedback */}
      <section className="relative px-4 pb-16">
        <h3 className="mx-auto mb-6 max-w-4xl text-center text-2xl md:text-3xl font-bold">
          ⭐ Latest Feedback
        </h3>
        <div className="mx-auto max-w-6xl">
          {isLoading ? (
            <FeedbackSkeleton />
          ) : feedbacks.length === 0 ? (
            <p className="text-center text-gray-400">No feedback yet.</p>
          ) : (
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
              {feedbacks.map((f) => (
                <article
                  key={f.id || `${f.name}-${f.email}-${Math.random()}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-5 shadow-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  {/* Accent gradient ring */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />

                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-cyan-600 font-bold">
                      {String(f.name || "?")
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold leading-tight">{f.name}</p>
                      <p className="text-xs text-gray-400">
                        {f.course} · ⭐ {f.rating}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-200 break-words">
                    <span className="italic">“{f.message}”</span>
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
