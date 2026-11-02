

import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  GraduationCap,
  BookOpen,
  Code2,
  Brain,
  Database,
  Globe,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  PlayCircle,
  CheckCircle2,
  Star,
  Laptop,
  Award,
  Clock,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const ROLES = [
  {
    label: "Student",
    icon: GraduationCap,
    description: "Learn and grow",
  },
  {
    label: "Staff",
    icon: BriefcaseBusiness,
    description: "Manage learning",
  },
  {
    label: "Admin",
    icon: ShieldCheck,
    description: "Manage platform",
  },
];

const COURSES = [
  {
    title: "Full Stack Web Development",
    category: "Web Development",
    description:
      "Learn HTML, CSS, JavaScript, React and backend development.",
    icon: Code2,
    duration: "12 Weeks",
    level: "Beginner",
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Artificial Intelligence",
    category: "AI & Technology",
    description:
      "Explore AI fundamentals, machine learning and intelligent applications.",
    icon: Brain,
    duration: "10 Weeks",
    level: "Intermediate",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Database Management",
    category: "Computer Science",
    description:
      "Understand SQL, database design, queries and data management.",
    icon: Database,
    duration: "8 Weeks",
    level: "Beginner",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Programming Fundamentals",
    category: "Programming",
    description:
      "Build strong programming fundamentals and problem-solving skills.",
    icon: Laptop,
    duration: "6 Weeks",
    level: "Beginner",
    color: "from-orange-500 to-pink-500",
  },
];

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [role, setRole] = useState("Student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const openLogin = (selectedRole = "Student") => {
    setRole(selectedRole);
    setErrorMessage("");
    setShowLogin(true);
    setMobileMenu(false);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setErrorMessage("");
    setPassword("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!identifier.trim() || !password) {
      setErrorMessage(
        "Please enter your email/phone and password."
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(
        identifier.trim(),
        password,
        rememberMe,
        role
      );

      if (!result || !result.success) {
        setErrorMessage(
          result?.message ||
            "Invalid credentials or selected role."
        );
        return;
      }

      const requestedPath =
        location.state?.from?.pathname;

      const destination =
        requestedPath ||
        (role === "Admin" ? "/admin" : "/dashboard");

      setShowLogin(false);

      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToCourses = () => {
    document
      .getElementById("courses")
      ?.scrollIntoView({ behavior: "smooth" });

    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080719] text-white">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080719]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <Link
            to="/login"
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-2.5">
              <GraduationCap size={27} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Learnova
              </h1>

              <p className="text-[11px] text-slate-400">
                LEARN. GROW. ACHIEVE.
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Home
            </a>

            <button
              type="button"
              onClick={scrollToCourses}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Courses
            </button>

            <a
              href="#features"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              About
            </a>
          </nav>

          {/* Header buttons */}

          <div className="hidden items-center gap-3 md:flex">

            <button
              type="button"
              onClick={() => openLogin()}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Login
            </button>

            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-900/20 transition hover:brightness-110"
            >
              Create Account
            </Link>

          </div>

          {/* Mobile menu button */}

          <button
            type="button"
            onClick={() =>
              setMobileMenu((previous) => !previous)
            }
            aria-label="Toggle navigation"
            className="rounded-lg border border-white/10 p-2 md:hidden"
          >
            {mobileMenu ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>

        {/* Mobile navigation */}

        {mobileMenu && (
          <div className="border-t border-white/10 bg-[#100e25] p-5 md:hidden">

            <nav className="flex flex-col gap-4">

              <a
                href="#home"
                onClick={() => setMobileMenu(false)}
                className="text-sm text-slate-300"
              >
                Home
              </a>

              <button
                type="button"
                onClick={scrollToCourses}
                className="text-left text-sm text-slate-300"
              >
                Courses
              </button>

              <a
                href="#features"
                onClick={() => setMobileMenu(false)}
                className="text-sm text-slate-300"
              >
                Features
              </a>

              <a
                href="#about"
                onClick={() => setMobileMenu(false)}
                className="text-sm text-slate-300"
              >
                About
              </a>

              <button
                type="button"
                onClick={() => openLogin()}
                className="rounded-xl border border-white/10 py-3 font-semibold"
              >
                Login
              </button>

              <Link
                to="/register"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl bg-violet-600 py-3 text-center font-semibold"
              >
                Create Account
              </Link>

            </nav>

          </div>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}

      <section
        id="home"
        className="relative isolate overflow-hidden"
      >

        {/* Background effects */}

        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

          <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-700/25 blur-[120px]" />

          <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[120px]" />

          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-600/15 blur-[120px]" />

        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:py-32">

          {/* Hero text */}

          <div>

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">

              <Sparkles size={16} />

              Your future starts with learning

            </div>

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">

              Unlock Your

              <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                Learning Potential
              </span>

              With Learnova

            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Learn new skills, explore technology and build
              your future with an organized learning platform
              designed for students and educators.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              <button
                type="button"
                onClick={() => openLogin("Student")}
                className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-4 font-semibold shadow-xl shadow-violet-900/30 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Start Learning

                <ArrowRight
                  size={19}
                  className="transition group-hover:translate-x-1"
                />

              </button>

              <button
                type="button"
                onClick={scrollToCourses}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 font-semibold transition hover:bg-white/[0.08]"
              >
                <PlayCircle size={20} />

                Explore Courses

              </button>

            </div>

            {/* Quick benefits */}

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">

              {[
                "Flexible learning",
                "Practical skills",
                "Progress tracking",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <CheckCircle2
                    size={17}
                    className="text-emerald-400"
                  />

                  {item}
                </div>
              ))}

            </div>

          </div>

          {/* Hero visual */}

          <div className="relative mx-auto w-full max-w-xl">

            <div className="absolute -inset-5 rounded-[35px] bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-[#121126]/90 p-5 shadow-2xl shadow-violet-950/30 backdrop-blur-xl sm:p-7">

              <div className="mb-7 flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-400">
                    LEARNING SPACE
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Your next chapter
                  </h3>
                </div>

                <div className="rounded-xl bg-violet-500/15 p-3 text-violet-300">
                  <BookOpen size={25} />
                </div>

              </div>

              {/* Learning cards */}

              <div className="space-y-4">

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                  <div className="rounded-xl bg-violet-500/20 p-3 text-violet-300">
                    <Code2 size={25} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold">
                      Web Development
                    </h4>

                    <p className="mt-1 text-sm text-slate-400">
                      Build modern web applications
                    </p>
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-500"
                  />

                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                  <div className="rounded-xl bg-blue-500/20 p-3 text-blue-300">
                    <Brain size={25} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold">
                      Artificial Intelligence
                    </h4>

                    <p className="mt-1 text-sm text-slate-400">
                      Explore intelligent technology
                    </p>
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-500"
                  />

                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                  <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-300">
                    <Database size={25} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold">
                      Database Systems
                    </h4>

                    <p className="mt-1 text-sm text-slate-400">
                      Organize and understand data
                    </p>
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-500"
                  />

                </div>

              </div>

              {/* Bottom card */}

              <div className="mt-6 rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-600/15 to-fuchsia-600/10 p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-violet-500/20 p-3 text-violet-300">
                    <Award size={24} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Learn something new today
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Start your learning journey with Learnova.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FEATURE STRIP ================= */}

      <section className="border-y border-white/[0.08] bg-white/[0.025]">

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-9 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">

          {[
            {
              icon: Laptop,
              title: "Learn Anywhere",
              description: "Access learning resources online",
            },
            {
              icon: BookOpen,
              title: "Structured Courses",
              description: "Organized topics and learning paths",
            },
            {
              icon: Clock,
              title: "Flexible Learning",
              description: "Study at your own pace",
            },
            {
              icon: Award,
              title: "Build Your Skills",
              description: "Develop practical knowledge",
            },
          ].map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex items-start gap-4"
              >

                <div className="rounded-xl bg-violet-500/10 p-3 text-violet-300">
                  <Icon size={23} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* ================= COURSES SECTION ================= */}

      <section
        id="courses"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24"
      >

        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
              Explore & Learn
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Explore Learning Paths
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              Explore popular technology subjects and discover
              learning paths that can help you develop your skills.
            </p>

          </div>

          <button
            type="button"
            onClick={() => openLogin("Student")}
            className="flex items-center gap-2 self-start font-semibold text-violet-300 transition hover:text-violet-200 sm:self-auto"
          >
            Start learning

            <ArrowRight size={18} />
          </button>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {COURSES.map((course) => {
            const Icon = course.icon;

            return (
              <article
                key={course.title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#100f23] transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-xl hover:shadow-violet-950/20"
              >

                <div
                  className={`flex h-40 items-center justify-center bg-gradient-to-br ${course.color}`}
                >
                  <div className="rounded-2xl border border-white/20 bg-white/15 p-5 backdrop-blur-sm transition group-hover:scale-110">
                    <Icon size={42} />
                  </div>
                </div>

                <div className="p-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                    {course.category}
                  </p>

                  <h3 className="mt-3 min-h-14 text-lg font-bold leading-7">
                    {course.title}
                  </h3>

                  <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">
                    {course.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">

                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />

                      {course.duration}
                    </span>

                    <span>
                      {course.level}
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() => openLogin("Student")}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
                  >
                    Explore Course

                    <ArrowRight size={16} />
                  </button>

                </div>

              </article>
            );
          })}

        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Course cards are examples for the landing page. Connect
          them to your actual LMS course data when available.
        </p>

      </section>

      {/* ================= FEATURES SECTION ================= */}

      <section
        id="features"
        className="border-y border-white/[0.08] bg-white/[0.025]"
      >

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">

          <div className="mx-auto mb-14 max-w-2xl text-center">

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
              Why Learnova?
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything you need to learn better
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              A central place to organize learning, access resources
              and make progress.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {[
              {
                icon: BookOpen,
                title: "Organized Learning",
                description:
                  "Keep learning materials and course content organized in one place.",
              },
              {
                icon: Users,
                title: "Connected Learning",
                description:
                  "Support collaboration between students and teaching staff.",
              },
              {
                icon: ShieldCheck,
                title: "Role-Based Access",
                description:
                  "Provide separate experiences for students, staff and administrators.",
              },
            ].map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[#100f23] p-7 transition hover:border-violet-400/30"
                >

                  <div className="mb-5 inline-flex rounded-2xl bg-violet-500/15 p-4 text-violet-300">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {feature.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* ================= ABOUT SECTION ================= */}

      <section
        id="about"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24"
      >

        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
              About Learnova
            </p>

            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              One platform.
              <span className="block text-violet-300">
                Multiple possibilities.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Learnova is a Learning Management System designed
              to bring learning resources, course information and
              user access together in one convenient platform.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              Students can access their learning area, staff can
              support educational activities, and administrators
              can manage platform users according to their roles.
            </p>

            <button
              type="button"
              onClick={() => openLogin("Student")}
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold transition hover:bg-violet-500"
            >
              Get Started

              <ArrowRight size={18} />
            </button>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl border border-white/10 bg-[#100f23] p-6">
              <div className="mb-5 inline-flex rounded-xl bg-violet-500/15 p-3 text-violet-300">
                <GraduationCap size={28} />
              </div>

              <h3 className="text-lg font-bold">
                Student
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Access learning and course resources.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-[#100f23] p-6">
              <div className="mb-5 inline-flex rounded-xl bg-blue-500/15 p-3 text-blue-300">
                <BriefcaseBusiness size={28} />
              </div>

              <h3 className="text-lg font-bold">
                Staff
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Support teaching and learning activities.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#100f23] p-6">
              <div className="mb-5 inline-flex rounded-xl bg-emerald-500/15 p-3 text-emerald-300">
                <ShieldCheck size={28} />
              </div>

              <h3 className="text-lg font-bold">
                Admin
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Manage users and platform access.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-[#100f23] p-6">
              <div className="mb-5 inline-flex rounded-xl bg-orange-500/15 p-3 text-orange-300">
                <Globe size={28} />
              </div>

              <h3 className="text-lg font-bold">
                Learning
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Discover new topics and skills.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA SECTION ================= */}

      <section className="px-5 pb-20 sm:px-8 sm:pb-24">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-r from-violet-700/30 via-purple-700/20 to-fuchsia-700/30 px-6 py-14 text-center sm:px-12 sm:py-16">

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />

          <div className="relative">

            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 p-3">
              <Sparkles size={25} className="text-violet-200" />
            </div>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to start learning?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
              Explore your learning space and take the next step
              toward building your skills.
            </p>

            <button
              type="button"
              onClick={() => openLogin("Student")}
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-slate-950 transition hover:bg-violet-100"
            >
              Sign In to Continue

              <ArrowRight size={19} />
            </button>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10 bg-[#060513]">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between">

          <Link
            to="/login"
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-violet-500/15 p-2 text-violet-300">
              <GraduationCap size={23} />
            </div>

            <div>
              <h3 className="font-bold">
                Learnova
              </h3>

              <p className="text-xs text-slate-500">
                Learning Management System
              </p>
            </div>
          </Link>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Learnova. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5 text-sm text-slate-400">

            <button
              type="button"
              onClick={() => openLogin()}
              className="transition hover:text-white"
            >
              Login
            </button>

            <Link
              to="/register"
              className="transition hover:text-white"
            >
              Create Account
            </Link>

          </div>

        </div>

      </footer>

      {/* ================= LOGIN MODAL ================= */}

      {showLogin && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLogin();
            }
          }}
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-heading"
            className="relative my-auto w-full max-w-lg rounded-3xl border border-white/10 bg-[#111024] p-6 shadow-2xl shadow-violet-950/50 sm:p-8"
          >

            {/* Close button */}

            <button
              type="button"
              onClick={closeLogin}
              aria-label="Close login"
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={21} />
            </button>

            {/* Heading */}

            <div className="mb-7 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/20">
                <GraduationCap
                  size={30}
                  className="text-violet-300"
                />
              </div>

              <p className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-violet-300">
                <Sparkles size={15} />

                WELCOME BACK
              </p>

              <h2
                id="login-heading"
                className="text-3xl font-bold"
              >
                Sign in to Learnova
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Choose your role and enter your credentials.
              </p>

            </div>

            {/* Role selection */}

            <div className="mb-6">

              <label className="mb-3 block text-sm font-medium text-slate-300">
                Select your role
              </label>

              <div className="grid grid-cols-3 gap-2">

                {ROLES.map((item) => {
                  const Icon = item.icon;
                  const active = role === item.label;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setRole(item.label);
                        setErrorMessage("");
                      }}
                      className={`rounded-xl border p-3 text-center transition ${
                        active
                          ? "border-violet-500 bg-violet-500/15 ring-1 ring-violet-500/40"
                          : "border-white/10 bg-white/[0.03] hover:border-white/25"
                      }`}
                    >

                      <Icon
                        size={22}
                        className={`mx-auto ${
                          active
                            ? "text-violet-300"
                            : "text-slate-400"
                        }`}
                      />

                      <p className="mt-2 text-sm font-semibold">
                        {item.label}
                      </p>

                      <p className="mt-1 hidden text-[10px] text-slate-400 sm:block">
                        {item.description}
                      </p>

                    </button>
                  );
                })}

              </div>

            </div>

            {/* Login form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>

                <label
                  htmlFor="login-identifier"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address or phone number
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="login-identifier"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(event) =>
                      setIdentifier(event.target.value)
                    }
                    placeholder="Enter email or phone"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />

                </div>

              </div>

              <div>

                <div className="mb-2 flex items-center justify-between gap-3">

                  <label
                    htmlFor="login-password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    onClick={closeLogin}
                    className="text-xs font-medium text-violet-300 transition hover:text-violet-200"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  className="h-4 w-4 accent-violet-500"
                />

                Remember me

              </label>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? "Signing in..."
                  : `Sign in as ${role}`}

                {!isLoading && <ArrowRight size={19} />}

              </button>

            </form>

            <div className="mt-6 text-center text-sm text-slate-400">

              New student?{" "}

              <Link
                to="/register"
                onClick={closeLogin}
                className="font-semibold text-violet-300 transition hover:text-violet-200"
              >
                Create an account
              </Link>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}