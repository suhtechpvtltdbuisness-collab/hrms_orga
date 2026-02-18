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
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed",
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
  logout: () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
  }
};

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
  getAllEmployees: async (adminId) => {
    try {
      const response = await fetch(`${BASE_URL}/users/employees/admin/${adminId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
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