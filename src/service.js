const BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL ||
  "https://hrms-orga-backend.vercel.app";

export const authService = {
  register: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }
      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },
  login: async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("LOGIN RESPONSE:", data);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    // ✅ Correct nested path
    const accessToken = data?.data?.tokens?.accessToken;

    if (accessToken) {
      localStorage.setItem("authToken", accessToken);
      console.log("Token Saved:", accessToken);
    } else {
      console.error("Token not found in response");
    }

    localStorage.setItem("isLoggedIn", "true");

    return {
      success: true,
      message: data.message,
      data: data.data,
    };

  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
,
  logout: () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
  }
};

export const departmentService = {
  createDepartment: async (departmentData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No authentication token found. Please login again." };
      }

      const response = await fetch(`${BASE_URL}/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(departmentData),
      });

      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create department",
        };
      }
      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },
  getDepartments: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No authentication token found. Please login again." };
      }

      const response = await fetch(`${BASE_URL}/departments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch departments",
        };
      }
      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },
};

export const designationService = {
  createDesignation: async (designationData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No authentication token found. Please login again." };
      }

      const response = await fetch(`${BASE_URL}/designation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(designationData),
      });

      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create designation",
        };
      }
      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },
  getDesignations: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No authentication token found. Please login again." };
      }

      // Trying singular endpoint as per POST
      const response = await fetch(`${BASE_URL}/designation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch designations",
        };
      }
      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },
};