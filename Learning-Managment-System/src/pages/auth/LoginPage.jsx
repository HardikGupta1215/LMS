// // src/pages/auth/LoginPage.jsx
// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import {
//   GraduationCap,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   AlertCircle,
//   KeyRound,
//   ShieldCheck,
//   BookOpen,
// } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login, defaultDemoUser } = useAuth();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(true);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const from = location.state?.from?.pathname || '/dashboard';

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setErrorMessage('');

//     if (!email.trim() || !email.includes('@')) {
//       setErrorMessage('Please enter a valid university or student email address.');
//       return;
//     }
//     if (!password || password.length < 4) {
//       setErrorMessage('Please enter your password (at least 4 characters).');
//       return;
//     }

//     setIsLoading(true);
//     setTimeout(() => {
//       login(email, password, rememberMe);
//       setIsLoading(false);
//       navigate(from, { replace: true });
//     }, 400);
//   };

//   const handleFillDemo = () => {
//     setEmail(defaultDemoUser.email);
//     setPassword('Learnova2026!');
//     setErrorMessage('');
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
//         {/* Logo */}
//         <Link to="/dashboard" className="inline-flex items-center gap-2.5 group">
//           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
//             <GraduationCap className="w-6 h-6" />
//           </div>
//           <span className="font-bold text-2xl tracking-tight text-slate-900">
//             Learnova
//           </span>
//         </Link>
//         <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
//           Sign in to your academic portal
//         </h2>
//         <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
//           Access your enrolled courses, assignments, and learning records
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 sm:px-8 border border-slate-200/90 rounded-2xl shadow-xs">
//           {/* Demo Credentials Quick-Fill Banner */}
//           <div className="mb-6 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start justify-between gap-3">
//             <div className="space-y-1">
//               <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
//                 <KeyRound className="w-3.5 h-3.5 text-blue-700" />
//                 <span>Demo Student Credentials</span>
//               </div>
//               <p className="text-[11px] text-blue-700">
//                 Email: <strong className="font-medium text-blue-900">{defaultDemoUser.email}</strong>
//               </p>
//               <p className="text-[11px] text-blue-700">
//                 Password: <strong className="font-medium text-blue-900">Learnova2026!</strong>
//               </p>
//             </div>
//             <button
//               type="button"
//               onClick={handleFillDemo}
//               className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shrink-0 shadow-2xs"
//             >
//               Autofill
//             </button>
//           </div>

//           {errorMessage && (
//             <div className="mb-5 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
//               <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
//               <span>{errorMessage}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs font-semibold text-slate-700 mb-1.5">
//                 University Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//                 <input
//                   type="email"
//                   required
//                   placeholder="student@learnova.edu"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <label className="block text-xs font-semibold text-slate-700">
//                   Password
//                 </label>
//                 <Link
//                   to="/forgot-password"
//                   className="text-xs font-medium text-blue-600 hover:underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
//               <div className="relative">
//                 <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 pl-9 pr-10 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
//                   aria-label="Toggle password visibility"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between pt-1">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
//                 />
//                 <span className="text-xs text-slate-600">Remember this device</span>
//               </label>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
//             >
//               {isLoading ? (
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <span>Sign In</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-6 pt-5 border-t border-slate-100 text-center">
//             <p className="text-xs text-slate-500">
//               Don't have a student account yet?{' '}
//               <Link to="/register" className="font-semibold text-blue-600 hover:underline">
//                 Create an account
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* University Compliance Note */}
//         <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
//           <div className="flex items-center gap-1.5">
//             <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
//             <span>Encrypted Session</span>
//           </div>
//           <span>•</span>
//           <div className="flex items-center gap-1.5">
//             <BookOpen className="w-3.5 h-3.5 text-slate-400" />
//             <span>Learnova Academic Portal</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, defaultDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    // Check empty fields
    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      // Verify credentials using AuthContext
      const result = await login(
        email.trim(),
        password,
        rememberMe
      );

      if (!result || !result.success) {
        setErrorMessage(
          result?.message || 'Invalid email or password.'
        );
        return;
      }

      // Login successful
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(defaultDemoUser?.email || 'hardik@learnova.edu');
    setPassword('Learnova2026!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600">
            Learnova
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Welcome Back!
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Login to continue your learning journey.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              autoComplete="username"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between gap-3">

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-indigo-600"
              />

              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-indigo-800">
            Demo Account
          </h3>

          <p className="text-sm text-gray-700">
            Email: {defaultDemoUser?.email || 'hardik@learnova.edu'}
          </p>

          <p className="text-sm text-gray-700">
            Password: Learnova2026!
          </p>

          <button
            type="button"
            onClick={fillDemoCredentials}
            className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Fill Demo Credentials
          </button>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}