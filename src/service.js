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

  // Update employee by ID
  // Tries PATCH /users/:id first (standard partial update),
  // then falls back to PUT /users/update/:id if backend returns 404
  updateEmployee: async (id, employeeData) => {
    const attemptRequest = async (method, url) => {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData),
      });
      return response;
    };

    try {
      // Try PATCH /users/:id first
      console.log(`[updateEmployee] Trying PATCH ${BASE_URL}/users/${id}`);
      let response = await attemptRequest("PATCH", `${BASE_URL}/users/${id}`);
      console.log(`[updateEmployee] PATCH status: ${response.status}`);

      // If 404, try PUT /users/update/:id
      if (response.status === 404) {
        console.log(`[updateEmployee] Trying PUT ${BASE_URL}/users/update/${id}`);
        response = await attemptRequest("PUT", `${BASE_URL}/users/update/${id}`);
        console.log(`[updateEmployee] PUT /update status: ${response.status}`);
      }

      // If still 404, try PUT /users/:id (original)
      if (response.status === 404) {
        console.log(`[updateEmployee] Trying PUT ${BASE_URL}/users/${id}`);
        response = await attemptRequest("PUT", `${BASE_URL}/users/${id}`);
        console.log(`[updateEmployee] PUT status: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Update failed (HTTP ${response.status}). Please check the backend API route.`,
        };
      }
      return {
        success: true,
        message: data.message || "Employee updated successfully",
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error while updating employee. Please try again.",
      };
    }
  },

  // POST /employment — create employment details for an employee
  addEmploymentDetails: async (employmentData) => {
    try {
      const response = await fetch(`${BASE_URL}/employment`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(employmentData),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to save employment details" };
      }
      return { success: true, message: data.message || "Employment details saved", data: data.data || data };
    } catch (error) {
      return { success: false, message: "Network error while saving employment details." };
    }
  },

  // GET /employment/:employeeId — fetch employment details for a specific employee
  getEmploymentByEmployee: async (employeeId) => {
    try {
      const response = await fetch(`${BASE_URL}/employment/${employeeId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to fetch employment details" };
      }
      return { success: true, data: data.data || data };
    } catch (error) {
      return { success: false, message: "Network error while fetching employment details." };
    }
  },
};

export const leaveService = {
  // POST /leave — create leave record for an employee
  addLeave: async (leaveData) => {
    try {
      const response = await fetch(`${BASE_URL}/leave`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(leaveData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to add leave" };
      return { success: true, message: data.message || "Leave added successfully", data: data.data };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },

  // GET /leave — fetch all leave records (filters sent as query params, NOT body)
  // Usage: leaveService.getLeaves({ empId: 32 })  →  GET /leave?empId=32
  getLeaves: async (filters = {}) => {
    try {
      // Build query string from filters object: { empId: 32 } → "?empId=32"
      const queryString = Object.keys(filters).length
        ? '?' + new URLSearchParams(
          // Remove null/undefined values
          Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null))
        ).toString()
        : '';

      const response = await fetch(`${BASE_URL}/leave${queryString}`, {
        method: "GET",
        headers: getAuthHeaders(),
        // NOTE: No body on GET requests — browsers ignore it
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch leaves" };
      return { success: true, message: data.message, data: data.data };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },

  // GET /leave/:id — fetch a single leave record by its ID
  getLeaveById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/leave/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch leave" };
      return { success: true, message: data.message, data: data.data };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },
};

// ─── Performance Service ───────────────────────────────────────────────────────
export const performanceService = {
  // POST /performance — create a performance record
  // Payload: { empId, date, rating, status }
  addPerformance: async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/performance`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to add performance" };
      return { success: true, message: data.message || "Performance added", data: data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // GET /performance — fetch all performance records (filter by empId on frontend)
  getPerformances: async (filters = {}) => {
    try {
      const queryString = Object.keys(filters).length
        ? '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null))
        ).toString()
        : '';
      const response = await fetch(`${BASE_URL}/performance${queryString}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch performances" };
      // Response is an array of { performance: {...}, employee: {...} }
      return { success: true, data: Array.isArray(data) ? data : (data.data || []) };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // PUT /performance/:id — update an existing performance record
  updatePerformance: async (id, payload) => {
    try {
      const response = await fetch(`${BASE_URL}/performance/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update performance" };
      return { success: true, message: data.message || "Performance updated", data: data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};

// ─── Payroll Service ───────────────────────────────────────────────────────────
export const payrollService = {
  // POST /payroll — create a payroll record
  // Payload: { empId, structure, ctc, monthlyGross, monthlyPay, paymentMode,
  //            departmentId, baseSalary, hra, conveyancePay, overtimePay, specialPay }
  addPayroll: async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/payroll`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to add payroll" };
      return { success: true, message: data.message || "Payroll added", data: data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // GET /payroll — fetch all payroll records
  getPayrolls: async (filters = {}) => {
    try {
      const queryString = Object.keys(filters).length
        ? '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null))
        ).toString()
        : '';
      const response = await fetch(`${BASE_URL}/payroll${queryString}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch payroll" };
      return { success: true, data: Array.isArray(data) ? data : (data.data || []) };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // PUT /payroll/:id — update an existing payroll record
  updatePayroll: async (id, payload) => {
    try {
      const response = await fetch(`${BASE_URL}/payroll/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update payroll" };
      return { success: true, message: data.message || "Payroll updated", data: data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};

