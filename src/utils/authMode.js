export const isLocalAuthEnabled = () =>
  import.meta.env.VITE_ENABLE_LOCAL_AUTH === "true" ||
  import.meta.env.DEV;
