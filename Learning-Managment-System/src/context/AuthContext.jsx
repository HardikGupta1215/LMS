// // src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// const DEFAULT_DEMO_USER = {
//   id: 'usr-101',
//   name: 'Hardik Gupta',
//   email: 'hardik@learnova.edu',
//   studentId: 'LN-2024-8842',
//   role: 'Student',
//   department: 'Computer Science & Engineering',
//   university: 'Learnova University of Technology',
//   semester: '5th Semester (Fall 2026)',
//   bio: 'Undergraduate Computer Science student passionate about full-stack web architectures, distributed systems, and machine learning models.',
//   avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
//   joinedDate: 'August 2024',
//   gpa: '3.88 / 4.0',
// };

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       const savedUser = localStorage.getItem('learnova_auth_user');
//       if (savedUser) {
//         return JSON.parse(savedUser);
//       }
//       return DEFAULT_DEMO_USER;
//     } catch {
//       return DEFAULT_DEMO_USER;
//     }
//   });

//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     try {
//       const authFlag = localStorage.getItem('learnova_is_authenticated');
//       return authFlag !== null ? JSON.parse(authFlag) : true; // default logged in for immediate smooth testing
//     } catch {
//       return true;
//     }
//   });

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem('learnova_auth_user', JSON.stringify(user));
//       localStorage.setItem('learnova_is_authenticated', JSON.stringify(isAuthenticated));
//     } else {
//       localStorage.removeItem('learnova_auth_user');
//       localStorage.setItem('learnova_is_authenticated', JSON.stringify(false));
//     }
//   }, [user, isAuthenticated]);

//   const login = (email, password, rememberMe = true) => {
//     // Validate credentials or accept demo
//     const authenticatedUser = {
//       ...DEFAULT_DEMO_USER,
//       email: email || DEFAULT_DEMO_USER.email,
//       name: email && email.includes('@') ? email.split('@')[0].replace('.', ' ') : DEFAULT_DEMO_USER.name,
//     };
//     setUser(authenticatedUser);
//     setIsAuthenticated(true);
//     if (rememberMe) {
//       localStorage.setItem('learnova_remembered_email', email);
//     } else {
//       localStorage.removeItem('learnova_remembered_email');
//     }
//     return { success: true };
//   };

//   const register = (userData) => {
//     const newUser = {
//       ...DEFAULT_DEMO_USER,
//       id: `usr-${Date.now()}`,
//       name: userData.name,
//       email: userData.email,
//       department: userData.department || 'Computer Science & Engineering',
//       studentId: `LN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
//       semester: '1st Semester (Fall 2026)',
//       joinedDate: 'September 2026',
//     };
//     setUser(newUser);
//     setIsAuthenticated(true);
//     return { success: true };
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   const updateProfile = (updatedFields) => {
//     setUser((prev) => {
//       const updated = { ...prev, ...updatedFields };
//       localStorage.setItem('learnova_auth_user', JSON.stringify(updated));
//       return updated;
//     });
//     return { success: true };
//   };

//   const resetPassword = (email) => {
//     // Demo password reset simulation
//     return { success: true, message: `Password reset link sent to ${email}` };
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         login,
//         register,
//         logout,
//         updateProfile,
//         resetPassword,
//         defaultDemoUser: DEFAULT_DEMO_USER,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }



// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: 'usr-101',
  name: 'Hardik Gupta',
  email: 'hardik@learnova.edu',
  studentId: 'LN-2024-8842',
  role: 'Student',
  department: 'Computer Science & Engineering',
  university: 'Learnova University of Technology',
  semester: '5th Semester (Fall 2026)',
  bio: 'Undergraduate Computer Science student passionate about full-stack web architectures, distributed systems, and machine learning models.',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  joinedDate: 'August 2024',
  gpa: '3.88 / 4.0',
};

const USERS_KEY = 'learnova_registered_users';
const SESSION_KEY = 'learnova_auth_user_v2';
const AUTH_KEY = 'learnova_is_authenticated_v2';
const DEMO_PASSWORD = 'Learnova2026!';

// Read registered users from localStorage
function readUsers() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(USERS_KEY) || '[]'
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      if (localStorage.getItem(AUTH_KEY) === 'true') {
        const savedUser = localStorage.getItem(SESSION_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
      }
    } catch {
      // Ignore invalid session data
    }

    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return (
        localStorage.getItem(AUTH_KEY) === 'true' &&
        Boolean(localStorage.getItem(SESSION_KEY))
      );
    } catch {
      return false;
    }
  });

  // Save or clear the current session
  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
      );

      localStorage.setItem(AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.setItem(AUTH_KEY, 'false');
    }
  }, [user, isAuthenticated]);

  // LOGIN
  const login = (identifier, password, rememberMe = true) => {
    const normalized = String(identifier || '')
      .trim()
      .toLowerCase();

    // Default demo account
    const isDemoLogin =
      normalized === DEFAULT_DEMO_USER.email.toLowerCase() &&
      password === DEMO_PASSWORD;

    // Find a registered account and verify its password
    const registeredUser = readUsers().find((item) => {
      const emailMatches =
        String(item.email || '')
          .trim()
          .toLowerCase() === normalized;

      const phoneMatches =
        Boolean(item.phone) &&
        String(item.phone).replace(/\D/g, '') ===
          String(identifier || '').replace(/\D/g, '');

      return (
        (emailMatches || phoneMatches) &&
        item.password === password
      );
    });

    // Reject incorrect credentials
    if (!isDemoLogin && !registeredUser) {
      return {
        success: false,
        message: 'Incorrect email/phone number or password.',
      };
    }

    // Never include the password in the authenticated user object
    let authenticatedUser;

    if (isDemoLogin) {
      authenticatedUser = DEFAULT_DEMO_USER;
    } else {
      const { password: savedPassword, ...safeUser } =
        registeredUser;

      authenticatedUser = safeUser;
    }

    setUser(authenticatedUser);
    setIsAuthenticated(true);

    if (rememberMe) {
      localStorage.setItem(
        'learnova_remembered_email',
        String(identifier || '').trim()
      );
    } else {
      localStorage.removeItem('learnova_remembered_email');
    }

    return {
      success: true,
      user: authenticatedUser,
    };
  };

  // REGISTER
  const register = (userData) => {
    const email = String(userData.email || '')
      .trim()
      .toLowerCase();

    const users = readUsers();

    // Prevent duplicate accounts
    const alreadyExists =
      email === DEFAULT_DEMO_USER.email.toLowerCase() ||
      users.some(
        (item) =>
          String(item.email || '').trim().toLowerCase() === email
      );

    if (alreadyExists) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      };
    }

    const newUser = {
      ...DEFAULT_DEMO_USER,
      id: `usr-${Date.now()}`,
      name: String(userData.name || '').trim(),
      email,
      department:
        userData.department ||
        'Computer Science & Engineering',
      studentId: `LN-2026-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      semester: '1st Semester (Fall 2026)',
      joinedDate: 'October 2026',

      // Local demo only; not suitable for production.
      password: userData.password,
    };

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([...users, newUser])
    );

    const { password: savedPassword, ...safeUser } = newUser;

    setUser(safeUser);
    setIsAuthenticated(true);

    return {
      success: true,
      user: safeUser,
    };
  };

  // LOGOUT
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // UPDATE PROFILE
  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        ...updatedFields,
      };

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(updated)
      );

      return updated;
    });

    return { success: true };
  };

  // FORGOT PASSWORD
  const resetPassword = (email) => {
    const normalized = String(email || '')
      .trim()
      .toLowerCase();

    const exists =
      normalized === DEFAULT_DEMO_USER.email.toLowerCase() ||
      readUsers().some(
        (item) =>
          String(item.email || '').trim().toLowerCase() ===
          normalized
      );

    if (!exists) {
      return {
        success: false,
        message: 'No registered account was found for this email.',
      };
    }

    return {
      success: true,
      message:
        'Account found. Password reset email is not configured in this demo.',
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        defaultDemoUser: DEFAULT_DEMO_USER,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}