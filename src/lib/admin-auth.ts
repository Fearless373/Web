"use client";

/** Demo admin credentials — change in production */
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin123";

const STORAGE_KEY = "admin-auth";

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function loginAdmin(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEY, "1");
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
