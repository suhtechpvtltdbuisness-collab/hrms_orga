export const isLocalAuthEnabled = () =>
  import.meta.env.VITE_ENABLE_LOCAL_AUTH === "true" ||
  import.meta.env.DEV;

export const isOrgAdmin = () => {
  try {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    return user.type === "admin" && user.isAdmin !== false;
  } catch {
    return false;
  }
};
