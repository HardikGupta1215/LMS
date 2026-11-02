import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const ADMIN_USER = {
  id: "admin-1",
  name: "Admin",
  email: "admin@learnova.edu",
  password: "Admin@2026",
  role: "Admin",
};

const USERS_KEY = "learnova_registered_users";
const SESSION_KEY = "learnova_user";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem(SESSION_KEY))
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(SESSION_KEY);
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = (identifier, password, rememberMe = false, selectedRole = "Student") => {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedRole = selectedRole.toLowerCase();

    if (!normalizedIdentifier || !password) {
      return {
        success: false,
        message: "Please enter your email/phone and password.",
      };
    }

    let matchedUser = null;

    if (
      normalizedIdentifier === ADMIN_USER.email &&
      password === ADMIN_USER.password &&
      normalizedRole === "admin"
    ) {
      matchedUser = ADMIN_USER;
    } else {
      matchedUser = getUsers().find((account) => {
        const emailMatches =
          account.email?.toLowerCase() === normalizedIdentifier;

        const phoneMatches =
          account.phone && account.phone === normalizedIdentifier;

        const passwordMatches = account.password === password;

        const roleMatches =
          account.role?.toLowerCase() === normalizedRole;

        return (
          (emailMatches || phoneMatches) &&
          passwordMatches &&
          roleMatches
        );
      });
    }

    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid credentials or selected role.",
      };
    }

    const loggedInUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email || "",
      phone: matchedUser.phone || "",
      role: matchedUser.role,
    };

    setUser(loggedInUser);

    if (rememberMe) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(loggedInUser)
      );
    }

    return {
      success: true,
      user: loggedInUser,
    };
  };

  const register = (userData) => {
    const users = getUsers();

    const email = userData.email?.trim().toLowerCase();

    if (!email || !userData.password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    const existingUser = users.some(
      (account) => account.email?.toLowerCase() === email
    );

    if (existingUser || email === ADMIN_USER.email) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: userData.name?.trim() || "Student",
      email,
      password: userData.password,
      role: "Student",
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return {
      success: true,
      user: newUser,
    };
  };

  const createManagedUser = (data) => {
    if (user?.role?.toLowerCase() !== "admin") {
      return {
        success: false,
        message: "Only administrators can create managed accounts.",
      };
    }

    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();
    const password = data.password;
    const role = data.role?.trim();

    if (!name || !email || !password || !role) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      };
    }

    if (!["Staff", "Parent"].includes(role)) {
      return {
        success: false,
        message: "Only Staff and Parent accounts can be created here.",
      };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: "Password must contain at least 8 characters.",
      };
    }

    const users = getUsers();

    const emailExists =
      email === ADMIN_USER.email ||
      users.some(
        (account) => account.email?.toLowerCase() === email
      );

    if (emailExists) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: `${role} account created successfully.`,
    };
  };

  const listManagedUsers = () => {
    if (user?.role?.toLowerCase() !== "admin") {
      return [];
    }

    return getUsers()
      .filter((account) =>
        ["staff", "parent"].includes(account.role?.toLowerCase())
      )
      .map(({ password, ...account }) => account);
  };

  const deleteManagedUser = (id) => {
    if (user?.role?.toLowerCase() !== "admin") {
      return {
        success: false,
        message: "Only administrators can delete accounts.",
      };
    }

    const users = getUsers();
    const updatedUsers = users.filter(
      (account) => account.id !== id
    );

    if (updatedUsers.length === users.length) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    return {
      success: true,
      message: "Account deleted successfully.",
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = (updates) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
    };

    setUser(updatedUser);

    if (user.id !== ADMIN_USER.id) {
      const users = getUsers();

      const updatedUsers = users.map((account) =>
        account.id === user.id
          ? { ...account, ...updates }
          : account
      );

      localStorage.setItem(
        USERS_KEY,
        JSON.stringify(updatedUsers)
      );
    }
  };

  const resetPassword = (email, newPassword) => {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !newPassword) {
      return {
        success: false,
        message: "Email and new password are required.",
      };
    }

    if (normalizedEmail === ADMIN_USER.email) {
      return {
        success: false,
        message: "Admin password cannot be reset through this form.",
      };
    }

    const users = getUsers();
    const index = users.findIndex(
      (account) =>
        account.email?.toLowerCase() === normalizedEmail
    );

    if (index === -1) {
      return {
        success: false,
        message: "No account found with this email.",
      };
    }

    users[index].password = newPassword;

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return {
      success: true,
      message: "Password updated successfully.",
    };
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    createManagedUser,
    listManagedUsers,
    deleteManagedUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

export default AuthContext;