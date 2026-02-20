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
      
      // Token is at data.tokens.accessToken
      const token = data.data?.tokens?.accessToken;
      
      if (token) {
        localStorage.setItem("authToken", token);
      }
      
      // Store refresh token if available
      if (data.data?.tokens?.refreshToken) {
        localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
      }
      
      // Store user data
      if (data.data?.user) {
        localStorage.setItem("userData", JSON.stringify(data.data.user));
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

      const accessToken = data?.data?.tokens?.accessToken;

      if (accessToken) {
        localStorage.setItem("authToken", accessToken);
        console.log("Token Saved:", accessToken);
      } else {
        console.error("Token not found in response");
      }

      
      // Token is at data.tokens.accessToken
      const token = data.data?.tokens?.accessToken;
      
      if (token) {
        localStorage.setItem("authToken", token);
      }
      
      // Store refresh token if available
      if (data.data?.tokens?.refreshToken) {
        localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
      }
      
      // Store user data
      if (data.data?.user) {
        localStorage.setItem("userData", JSON.stringify(data.data.user));
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
  },
  logout: () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
  },
};

export const departmentService = {
  createDepartment: async (departmentData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return {
          success: false,
          message: "No authentication token found. Please login again.",
        };
      }

      const response = await fetch(`${BASE_URL}/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(departmentData),
      });

      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return {
          success: false,
          message: "Session expired. Please login again.",
        };
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
        return {
          success: false,
          message: "No authentication token found. Please login again.",
        };
      }

      const response = await fetch(`${BASE_URL}/departments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return {
          success: false,
          message: "Session expired. Please login again.",
        };
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
        return {
          success: false,
          message: "No authentication token found. Please login again.",
        };
      }

      const response = await fetch(`${BASE_URL}/designation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(designationData),
      });

      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return {
          success: false,
          message: "Session expired. Please login again.",
        };
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
        return {
          success: false,
          message: "No authentication token found. Please login again.",
        };
      }

      const response = await fetch(`${BASE_URL}/designation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return {
          success: false,
          message: "Session expired. Please login again.",
        };
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

    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const employeeService = {
  // Get all employees by admin ID
  getAllEmployeesByAdminId: async (adminId) => {
    try {
      console.log("Fetching employees for admin ID:", adminId);
      console.log("API URL:", `${BASE_URL}/users/employees/admin/${adminId}`);
      console.log("Auth Token:", localStorage.getItem("authToken"));
      
      const response = await fetch(`${BASE_URL}/users/employees/admin/${adminId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to get employees",
        };
      }
      return {
        success: true,
        message: data.message || "Employees fetched successfully",
        data: data.data || [],
      };
    } catch (error) {
      console.error("Error in getAllEmployeesByAdminId:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },

  // Get employee by ID
  getEmployee: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/users/employee/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to get employee",
        };
      }
      return {
        success: true,
        message: data.message || "Employee fetched successfully",
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },

  // Get user by ID (for viewing employee details)
  getUserById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to get user",
        };
      }
      return {
        success: true,
        message: data.message || "User fetched successfully",
        data: Array.isArray(data.data) ? data.data[0] : data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },

  // Add new employee
  addEmployee: async (employeeData) => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to add employee",
        };
      }
      return {
        success: true,
        message: data.message || "Employee added successfully",
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

export const leaveService = {
  // Add leave for employee
  addLeave: async (leaveData) => {
    try {
      const response = await fetch(`${BASE_URL}/leave`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(leaveData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to add leave",
        };
      }
      return {
        success: true,
        message: data.message || "Leave added successfully",
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