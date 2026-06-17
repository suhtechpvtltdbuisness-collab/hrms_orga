import { useEffect } from "react";
import { authService } from "../../service";

export default function AuthRedirect() {
  useEffect(() => {
    const mainAuthUrl = `${authService.getMainSiteUrl()}/auth?mode=login`;
    window.location.replace(mainAuthUrl);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Redirecting to main sign in...
    </div>
  );
}
