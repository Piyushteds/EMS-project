import httpClient from "./httpClient";

const TOKEN_KEY = "ems-token";
const USER_KEY = "ems-user";

export const authService = {
  async login(payload) {
    if (!payload.email?.trim() || !payload.password) {
      throw new Error("Email and password are required.");
    }

    const data = await httpClient.post("/Aauth/login", {
      email: payload.email.trim(),
      password: payload.password,
    });

    // Save token and user details
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        expiresAt: data.expiresAt,
      })
    );

    return data;
  },
  async register(payload) {
    const data = await httpClient.post("/Aauth/register", {
      fullName: payload.fullName?.trim(),
      email: payload.email?.trim(),
      password: payload.password,
      role: "Employee",
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        expiresAt: data.expiresAt,
      }),
    );
    return data;
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = this.getUser();
    if (!token) return false;
    if (
      user?.expiresAt &&
      new Date(user.expiresAt).getTime() <= Date.now()
    ) {
      this.logout();
      return false;
    }
    return true;
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  },
};
