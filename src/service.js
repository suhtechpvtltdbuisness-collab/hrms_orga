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
      console.log("Login API Response (Full):", JSON.stringify(data, null, 2)); // Debug Log: Print full structure

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }

      // Try to find the token in various possible locations
      // Per latest console log: data.data.tokens.accessToken
      const token = data.data?.tokens?.accessToken || data.token || data.data?.token || data.data?.accessToken;

      if (token) {
        console.log("Saving Auth Token:", token); // Debug Log
        localStorage.setItem("authToken", token);
      } else {
        console.error("CRITICAL: Token NOT found in response!", data); // Critical Error Log
      }
      
      localStorage.setItem("isLoggedIn", "true");
      
      // Store adminId/userId if available
      const adminId = data.data?.user?._id || data.data?._id || data.user?._id;
      if (adminId) {
          localStorage.setItem("adminId", adminId);
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
  logout: () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
  }
};

//Department Service//

export const departmentService = {
  getAllDepartments: async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/departments`, { // Changed from /department/get-all-department
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch departments",
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
  getDepartmentById: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/departments/${id}`, { // Changed from /department/get-department-by-id/:id
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch department details",
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
  getDepartmentByAdminId: async (adminId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/departments/admin/${adminId}`, { // Changed from /department/get-department-by-admin-id/:id
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch department details",
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
  createDepartment: async (departmentData) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Service: Creating department with data:", departmentData);
      const response = await fetch(`${BASE_URL}/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(departmentData),
      });
      const data = await response.json();
      
      console.log("Create Dept Response:", JSON.stringify(data, null, 2)); // Debug: Full response

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
  }
};

//Designation Service//

export const designationService = {
  createDesignation: async (designationData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/designation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(designationData),
      });
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

  getAllDesignation: async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/designation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch designations",
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

  getDesignationByAdminId: async (adminId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/designation/admin/${adminId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch designations",
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

  getDesignationById: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/designation/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch designation details",
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
  }
};


export const userService = {
  createEmployee: async (employeeData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/users`, { // Corrected endpoint for create
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(employeeData),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create employee",
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

  getAllEmployees: async () => {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) {
          return { success: false, message: "Admin ID not found" };
      }
      return userService.getEmployeesByAdminId(adminId);
  },

  getEmployeesByAdminId: async (adminId) => {
    try {
      const token = localStorage.getItem("authToken");
      // Correct endpoint based on provided screenshot: GET /users/employees/admin/:adminId
      const response = await fetch(`${BASE_URL}/users/employees/admin/${adminId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch employees",
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

  getEmployeeById: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      // Correct endpoint based on provided screenshot: GET /users/employee/:id
      const response = await fetch(`${BASE_URL}/users/employee/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch employee details",
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
  }
};
