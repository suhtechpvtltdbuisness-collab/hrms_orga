const API_BASE_PATH = "/api";
const BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}${API_BASE_PATH}`
    : API_BASE_PATH;

const resolveBackendAssetUrl = (url) => {
  if (!url || typeof url !== "string") return url || "";
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
};

const MAIN_SITE_URL =
  import.meta.env.VITE_MAIN_SITE_URL || "https://suhtech.store";

const persistUserSession = (user, tokens, subscription) => {
  if (tokens?.accessToken) {
    localStorage.setItem("authToken", tokens.accessToken);
  }
  if (tokens?.refreshToken) {
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }
  if (user) {
    localStorage.setItem("userData", JSON.stringify(user));
  }
  if (subscription) {
    localStorage.setItem("subscription", JSON.stringify(subscription));
  }
  localStorage.setItem("isLoggedIn", "true");
};

const clearUserSession = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  localStorage.removeItem("subscription");
};

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

const RETRYABLE_STATUS = new Set([502, 503, 504]);
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const apiFetch = async (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }
  const isBodyRetryable =
    !(options.body instanceof ReadableStream);

  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        credentials: "include",
        ...options,
        headers,
      });
      if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_RETRIES) {
        await sleep(300 * 2 ** attempt);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (!isBodyRetryable || attempt === MAX_RETRIES) break;
      await sleep(300 * 2 ** attempt);
    }
  }
  throw lastError;
};

export const dashboardService = {
  getAdminDashboard: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/dashboard/admin`, {
        method: "GET",
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Failed to fetch dashboard data",
        };
      }
      return { success: true, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};

export const authService = {
  register: async (userData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }

      persistUserSession(
        data.data?.user,
        data.data?.tokens,
        data.data?.subscription,
      );

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
      const response = await apiFetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }

      persistUserSession(
        data.data?.user,
        data.data?.tokens,
        data.data?.subscription,
      );

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
  faceLogin: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/auth/face-login`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Face login failed",
          code: data.code,
        };
      }

      persistUserSession(
        data.data?.user,
        data.data?.tokens,
        data.data?.subscription,
      );

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
  logout: async () => {
    try {
      await apiFetch(`${BASE_URL}/auth/logout`, { method: "POST" });
    } catch {
      // clear local session even if API call fails
    }
    clearUserSession();
    return { success: true, message: "Logout successful" };
  },
  getProfile: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/auth/profile`, {
        method: "GET",
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Not authenticated",
        };
      }

      if (data.data?.user) {
        localStorage.setItem("userData", JSON.stringify(data.data.user));
        localStorage.setItem("isLoggedIn", "true");
      }
      if (data.data?.subscription) {
        localStorage.setItem(
          "subscription",
          JSON.stringify(data.data.subscription),
        );
      }

      return {
        success: true,
        data: data.data,
      };
    } catch {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },
  refreshToken: async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const response = await apiFetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        body: JSON.stringify(
          storedRefreshToken ? { refreshToken: storedRefreshToken } : {},
        ),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Token refresh failed",
        };
      }

      persistUserSession(null, data.data?.tokens);

      return {
        success: true,
        data: data.data,
      };
    } catch {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },
  isSubscribed: (subscription) => subscription?.isSubscribed === true,

  hasActiveSubscription: (subscriptionOrPlan) => {
    if (subscriptionOrPlan?.isSubscribed !== undefined) {
      return subscriptionOrPlan.isSubscribed === true;
    }
    const plan = subscriptionOrPlan;
    if (!plan) return false;
    if (!plan.active) return false;
    if (!plan.expired) return true;
    return new Date(plan.expired) > new Date();
  },
  getMainSiteUrl: () => MAIN_SITE_URL,
  getPricingUrl: () => `${MAIN_SITE_URL}/pricing`,

  importSessionFromHash: () => {
    const hash = window.location.hash?.replace(/^#/, "");
    if (!hash) return false;

    const params = new URLSearchParams(hash);
    const accessToken = params.get("accessToken");
    if (!accessToken) return false;

    const refreshToken = params.get("refreshToken");
    let user = null;
    let subscription = null;

    try {
      const userData = params.get("userData");
      if (userData) user = JSON.parse(decodeURIComponent(userData));
      const subData = params.get("subscription");
      if (subData) subscription = JSON.parse(decodeURIComponent(subData));
    } catch {
      return false;
    }

    persistUserSession(
      user,
      { accessToken, refreshToken: refreshToken || undefined },
      subscription,
    );

    window.history.replaceState(null, "", window.location.pathname);
    return true;
  },
};

export const departmentService = {
  createDepartment: async (departmentData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/departments`, {
        method: "POST",
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
  getDepartments: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.status) query.append("status", params.status);
      if (params.sortBy) query.append("sortBy", params.sortBy);
      if (params.sortOrder) query.append("sortOrder", params.sortOrder);
      if (params.page) query.append("page", params.page);
      if (params.limit) query.append("limit", params.limit);

      const url = `${BASE_URL}/departments` + (query.toString() ? `?${query.toString()}` : "");
      const response = await apiFetch(url, {
        method: "GET",
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
  getDepartmentById: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/departments/${id}`, {
        method: "GET",
      });
      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to fetch department" };
      }
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },
  updateDepartment: async (id, departmentData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify(departmentData),
      });
      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to update department" };
      }
      return { success: true, message: data.message, data: data.data };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },
  deleteDepartment: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/departments/${id}`, {
        method: "DELETE",
      });
      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to delete department" };
      }
      return { success: true, message: data.message, data: data.data };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },
  updateDepartmentStatus: async (id, status) => {
    try {
      const response = await apiFetch(`${BASE_URL}/departments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to update status" };
      }
      return { success: true, message: data.message, data: data.data };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },
  getDepartmentStats: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/departments/stats`, {
        method: "GET",
      });
      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to fetch stats" };
      }
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },
  getDepartmentsDropdown: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/departments/dropdown`, {
        method: "GET",
      });
      if (response.status === 401) {
        authService.logout();
        window.location.href = "/auth";
        return { success: false, message: "Session expired. Please login again." };
      }
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to fetch dropdown list" };
      }
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },
};

export const designationService = {
  createDesignation: async (designationData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/designation`, {
        method: "POST",
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

  getDesignations: async (queryParams = {}) => {
    try {
      const params = new URLSearchParams();
      if (queryParams.search) params.append("search", queryParams.search);
      if (queryParams.departmentId) params.append("departmentId", queryParams.departmentId);
      if (queryParams.level) params.append("level", queryParams.level);
      if (queryParams.status) params.append("status", queryParams.status);
      if (queryParams.sortBy) params.append("sortBy", queryParams.sortBy);
      if (queryParams.sortOrder) params.append("sortOrder", queryParams.sortOrder);
      if (queryParams.page) params.append("page", queryParams.page);
      if (queryParams.limit) params.append("limit", queryParams.limit);

      const response = await apiFetch(`${BASE_URL}/designation?${params.toString()}`, {
        method: "GET",
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

  getDesignationById: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/designation/${id}`, {
        method: "GET",
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
          message: data.message || "Failed to fetch designation details",
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

  updateDesignation: async (id, designationData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/designation/${id}`, {
        method: "PUT",
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
          message: data.message || "Failed to update designation",
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

  updateStatus: async (id, status) => {
    try {
      const response = await apiFetch(`${BASE_URL}/designation/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
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
          message: data.message || "Failed to update designation status",
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

  deleteDesignation: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/designation/${id}`, {
        method: "DELETE",
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
          message: data.message || "Failed to delete designation",
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

  getDesignationStats: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/designation/stats`, {
        method: "GET",
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
          message: data.message || "Failed to fetch designation statistics",
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

  getDesignationDropdown: async (departmentId) => {
    try {
      const url = departmentId
        ? `${BASE_URL}/designation/dropdown?departmentId=${departmentId}`
        : `${BASE_URL}/designation/dropdown`;
      const response = await apiFetch(url, {
        method: "GET",
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
          message: data.message || "Failed to fetch designations dropdown",
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

export const employeeService = {
  getAllUsersForSuperAdmin: async (page = 1, limit = 10, search = "") => {
    try {
      const response = await apiFetch(`${BASE_URL}/users/superadmin/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch all users",
        };
      }
      return {
        success: true,
        data: data.data || { users: [], total: 0 },
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  },

  // Get all employees by admin ID
  getAllEmployeesByAdminId: async (adminId, page, limit, search) => {
    try {
      let url = `${BASE_URL}/users/employees/admin/${adminId}`;
      const params = new URLSearchParams();
      if (page !== undefined) params.append("page", page);
      if (limit !== undefined) params.append("limit", limit);
      if (search !== undefined) params.append("search", search);
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      console.log("Fetching employees for admin ID:", adminId);
      console.log("API URL:", url);
      console.log("Auth Token:", localStorage.getItem("authToken"));

      const response = await apiFetch(url, {
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
      const response = await apiFetch(`${BASE_URL}/users/employee/${id}`, {
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
      const response = await apiFetch(`${BASE_URL}/users/${id}`, {
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
      const response = await apiFetch(`${BASE_URL}/users`, {
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
      const response = await apiFetch(url, {
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

  // Soft delete employee by user ID
  deleteEmployee: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = response.status === 204 ? {} : await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Failed to delete employee",
        };
      }
      return {
        success: true,
        message: data.message || "Employee deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error while deleting employee",
      };
    }
  },

  // Upload an image (for profile pictures)
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await apiFetch(`${BASE_URL}/upload/image`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to upload image" };
      }
      return { success: true, url: data.url };
    } catch (error) {
      return { success: false, message: "Network error while uploading image." };
    }
  },

  uploadDocuments: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("documents", file));
      const response = await apiFetch(`${BASE_URL}/upload/documents`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to upload documents" };
      }
      return { success: true, files: data.files || [] };
    } catch (error) {
      return { success: false, message: "Network error while uploading documents." };
    }
  },

  // POST /employment — create employment details for an employee
  addEmploymentDetails: async (employmentData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/employment`, {
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
      const response = await apiFetch(`${BASE_URL}/employment/${employeeId}`, {
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
      const response = await apiFetch(`${BASE_URL}/leave`, {
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

      const response = await apiFetch(`${BASE_URL}/leave${queryString}`, {
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
      const response = await apiFetch(`${BASE_URL}/leave/${id}`, {
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

  getBalance: async (userId) => {
    try {
      const response = await apiFetch(`${BASE_URL}/leave/balance/${userId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch leave balance" };
      return { success: true, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  allocateLeave: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/leave/allocate`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to allocate leave" };
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};

export const leaveRequestService = {
  getLeaveRequests: async (filters = {}) => {
    try {
      const queryString = Object.keys(filters).length
        ? "?" + new URLSearchParams(
            Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null)),
          ).toString()
        : "";

      const response = await apiFetch(`${BASE_URL}/leave-requests${queryString}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to fetch leave requests" };
      }
      return { success: true, data: data.data || [] };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createLeaveRequest: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/leave-requests`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to submit leave request" };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getAvailableLeaveTypes: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/leave-requests/types`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to fetch leave types" };
      }
      return { success: true, data: data.data || [] };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  approveLeaveRequest: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/leave-requests/${id}/approve`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to approve leave request" };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  rejectLeaveRequest: async (id, rejectionReason = "") => {
    try {
      const response = await apiFetch(`${BASE_URL}/leave-requests/${id}/reject`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to reject leave request" };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  leaveTypeToApi: (label) => {
    const map = {
      "Sick Leave": "sick",
      "Casual Leave": "casual",
      "Earned Leave": "earned",
      "Maternity Leave": "maternity",
      "Paternity Leave": "paternity",
      "Compensatory Off": "earned",
    };
    return map[label] || label?.toLowerCase?.().replace(/\s+/g, "_");
  },

  leaveTypeToLabel: (type) => {
    const map = {
      sick: "Sick Leave",
      casual: "Casual Leave",
      earned: "Earned Leave",
      maternity: "Maternity Leave",
      paternity: "Paternity Leave",
    };
    return map[type] || type;
  },
};

const leaveAdminRequest = async (path, options = {}) => {
  try {
    const response = await apiFetch(`${BASE_URL}/leave-admin${path}`, {
      headers: getAuthHeaders(),
      ...options,
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Request failed" };
    }
    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
};

export const leaveManagementService = {
  getOptions: async () => leaveAdminRequest("/options"),

  getHolidays: async (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== "")),
    ).toString();
    return leaveAdminRequest(`/holidays${query ? `?${query}` : ""}`);
  },
  createHoliday: async (payload) =>
    leaveAdminRequest("/holidays", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateHoliday: async (id, payload) =>
    leaveAdminRequest(`/holidays/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteHoliday: async (id) =>
    leaveAdminRequest(`/holidays/${id}`, { method: "DELETE" }),

  getPeriods: async () => leaveAdminRequest("/periods"),
  createPeriod: async (payload) =>
    leaveAdminRequest("/periods", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updatePeriod: async (id, payload) =>
    leaveAdminRequest(`/periods/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deletePeriod: async (id) =>
    leaveAdminRequest(`/periods/${id}`, { method: "DELETE" }),

  getBlocks: async (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== "")),
    ).toString();
    return leaveAdminRequest(`/blocks${query ? `?${query}` : ""}`);
  },
  createBlock: async (payload) =>
    leaveAdminRequest("/blocks", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateBlock: async (id, payload) =>
    leaveAdminRequest(`/blocks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteBlock: async (id) =>
    leaveAdminRequest(`/blocks/${id}`, { method: "DELETE" }),

  getLeaveTypes: async (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== "")),
    ).toString();
    return leaveAdminRequest(`/types${query ? `?${query}` : ""}`);
  },
  createLeaveType: async (payload) =>
    leaveAdminRequest("/types", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateLeaveType: async (id, payload) =>
    leaveAdminRequest(`/types/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteLeaveType: async (id) =>
    leaveAdminRequest(`/types/${id}`, { method: "DELETE" }),

  getPolicies: async (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== "")),
    ).toString();
    return leaveAdminRequest(`/policies${query ? `?${query}` : ""}`);
  },
  createPolicy: async (payload) =>
    leaveAdminRequest("/policies", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updatePolicy: async (id, payload) =>
    leaveAdminRequest(`/policies/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deletePolicy: async (id) =>
    leaveAdminRequest(`/policies/${id}`, { method: "DELETE" }),

  getAssignments: async (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== "")),
    ).toString();
    return leaveAdminRequest(`/assignments${query ? `?${query}` : ""}`);
  },
  createAssignment: async (payload) =>
    leaveAdminRequest("/assignments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAssignment: async (id, payload) =>
    leaveAdminRequest(`/assignments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteAssignment: async (id) =>
    leaveAdminRequest(`/assignments/${id}`, { method: "DELETE" }),

  getCompOffRequests: async (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== "")),
    ).toString();
    return leaveAdminRequest(`/comp-off-requests${query ? `?${query}` : ""}`);
  },
  createCompOffRequest: async (payload) =>
    leaveAdminRequest("/comp-off-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  approveCompOffRequest: async (id) =>
    leaveAdminRequest(`/comp-off-requests/${id}/approve`, { method: "PATCH" }),
  rejectCompOffRequest: async (id, rejectionReason = "") =>
    leaveAdminRequest(`/comp-off-requests/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ rejectionReason }),
    }),

  getEncashmentRequests: async (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== "")),
    ).toString();
    return leaveAdminRequest(`/encashment-requests${query ? `?${query}` : ""}`);
  },
  getEncashmentEligibility: async () =>
    leaveAdminRequest("/encashment-eligibility"),
  createEncashmentRequest: async (payload) =>
    leaveAdminRequest("/encashment-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createEncashAllRequest: async () =>
    leaveAdminRequest("/encashment-requests/all", { method: "POST" }),
  approveEncashmentRequest: async (id) =>
    leaveAdminRequest(`/encashment-requests/${id}/approve`, { method: "PATCH" }),
  rejectEncashmentRequest: async (id, rejectionReason = "") =>
    leaveAdminRequest(`/encashment-requests/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ rejectionReason }),
    }),
};

// ─── Performance Service ───────────────────────────────────────────────────────
export const performanceService = {
  // POST /performance — create a performance record
  // Payload: { empId, date, rating, status }
  addPerformance: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/performance`, {
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
      const response = await apiFetch(`${BASE_URL}/performance${queryString}`, {
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
      const response = await apiFetch(`${BASE_URL}/performance/${id}`, {
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
      const response = await apiFetch(`${BASE_URL}/payroll`, {
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
      const response = await apiFetch(`${BASE_URL}/payroll${queryString}`, {
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
      const response = await apiFetch(`${BASE_URL}/payroll/${id}`, {
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

export const accountsService = {
  getChartAccounts: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/chart-of-accounts`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch chart of accounts" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  createChartAccount: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/chart-of-accounts`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create account" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  updateChartAccount: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/chart-of-accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update account" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  deleteChartAccount: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/chart-of-accounts/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete account" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  getAccountLedger: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/chart-of-accounts/${id}/ledger`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch account ledger" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  getBankCashAccounts: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/bank-and-cash`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch bank and cash accounts" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  createBankCashAccount: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/bank-and-cash`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create bank account" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  updateBankCashAccount: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/bank-and-cash/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update bank account" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  deleteBankCashAccount: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/bank-and-cash/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete bank account" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  getJournalEntries: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/journal-entries`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch journal entries" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  getJournalEntry: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/journal-entries/${id}`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch journal entry" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  createJournalEntry: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/journal-entries`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create journal entry" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  updateJournalEntry: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/journal-entries/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update journal entry" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  deleteJournalEntry: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/accounts/journal-entries/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete journal entry" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};

// ─── Attendance helpers ────────────────────────────────────────────────────────
const ATTENDANCE_STATUS_TO_API = {
  Present: "present",
  Absent: "absent",
  "Half Day": "half_day",
  Leave: "on_leave",
  Holiday: "absent",
  "Work From Home": "present",
};

const ATTENDANCE_STATUS_TO_UI = {
  present: "Present",
  absent: "Absent",
  half_day: "Half Day",
  on_leave: "Leave",
};

const LEAVE_TYPE_TO_API = {
  "Sick Leave": "sick",
  "Personal Leave": "casual",
  "Earned Leave": "earned",
  "Maternity Leave": "maternity",
  "Paternity Leave": "paternity",
};

const LEAVE_TYPE_TO_UI = {
  sick: "Sick Leave",
  casual: "Personal Leave",
  earned: "Earned Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const attendanceUtils = {
  toApiDate: (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const [day, month, year] = dateStr.split("/");
    if (!day || !month || !year) return dateStr;
    return `${year}-${month}-${day}`;
  },

  toDisplayDate: (dateStr) => {
    if (!dateStr) return "-";
    const iso = dateStr.split("T")[0];
    const [year, month, day] = iso.split("-");
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
  },

  statusToApi: (status) =>
    ATTENDANCE_STATUS_TO_API[status] || status?.toLowerCase?.() || status,

  statusToUi: (status) =>
    ATTENDANCE_STATUS_TO_UI[status] || status || "-",

  leaveTypeToApi: (leaveType) =>
    LEAVE_TYPE_TO_API[leaveType] || leaveType?.toLowerCase?.() || leaveType,

  leaveTypeToUi: (leaveType) =>
    leaveType ? LEAVE_TYPE_TO_UI[leaveType] || leaveType : "-",

  monthNameToApi: (monthName, year = new Date().getFullYear()) => {
    const index = MONTH_NAMES.indexOf(monthName);
    if (index === -1) return "";
    return `${year}-${String(index + 1).padStart(2, "0")}`;
  },

  mapRecordToRow: (record, index) => {
    const att = record.attendance || record;
    const emp = record.employee || record.user || record;
    const checkInVerificationMethod =
      att.checkInVerificationMethod ||
      att.verificationMethod ||
      att.method ||
      att.checkInMethod ||
      att.markedBy ||
      att.mode ||
      record.verificationMethod ||
      record.method ||
      "";
    const checkInFaceImage =
      att.checkInFaceImage ||
      att.faceImage ||
      att.face_image ||
      att.faceCapture ||
      att.face_capture ||
      att.facePhoto ||
      att.face_photo ||
      att.capturedImage ||
      att.captured_image ||
      att.image ||
      att.photo ||
      record.faceImage ||
      record.face_image ||
      record.faceCapture ||
      record.face_capture ||
      record.facePhoto ||
      record.face_photo ||
      record.capturedImage ||
      record.captured_image ||
      record.image ||
      record.photo ||
      null;
    const checkOutVerificationMethod =
      att.checkOutVerificationMethod ||
      att.checkoutVerificationMethod ||
      att.check_out_verification_method ||
      record.checkOutVerificationMethod ||
      record.checkoutVerificationMethod ||
      record.check_out_verification_method ||
      "";
    const checkOutFaceImage =
      att.checkOutFaceImage ||
      att.checkoutFaceImage ||
      att.check_out_face_image ||
      record.checkOutFaceImage ||
      record.checkoutFaceImage ||
      record.check_out_face_image ||
      null;
    const checkInTime = att.checkIn || att.checkInTime || record.checkIn || null;
    const checkOutTime = att.checkOut || att.checkOutTime || record.checkOut || null;
    let workedDuration = att.workedDuration || record.workedDuration || null;
    if (!workedDuration && checkInTime && checkOutTime) {
      const workedMinutes = Math.max(
        0,
        Math.floor((new Date(checkOutTime).getTime() - new Date(checkInTime).getTime()) / 60_000),
      );
      workedDuration = `${Math.floor(workedMinutes / 60)}h ${workedMinutes % 60}m`;
    } else if (!workedDuration && checkInTime && !checkOutTime) {
      workedDuration = "In progress";
    }

    return {
      srNo: String(index + 1).padStart(2, "0"),
      name: emp.name || att.empName || emp.firstName || "-",
      empId: (att.empId || emp.employeeId || emp.id) ? `EMP-${String(att.empId || emp.employeeId || emp.id).padStart(3, "0")}` : "-",
      status: att.period === "half_day" ? "Half Day" : (ATTENDANCE_STATUS_TO_UI[att.status] || att.status),
      date: attendanceUtils.toDisplayDate(att.attendanceDate || att.date),
      workedDuration: workedDuration || "-",
      leaveType: LEAVE_TYPE_TO_UI[att.leaveType] || "-",
      rawStatus: att.status,
      rawLeaveType: att.leaveType,
      checkInVerificationMethod: typeof checkInVerificationMethod === "string" ? checkInVerificationMethod.toLowerCase() : checkInVerificationMethod,
      verificationMethod: typeof checkInVerificationMethod === "string" ? checkInVerificationMethod.toLowerCase() : checkInVerificationMethod,
      checkInFaceImage: resolveBackendAssetUrl(checkInFaceImage),
      faceImage: resolveBackendAssetUrl(checkInFaceImage),
      checkOutVerificationMethod: typeof checkOutVerificationMethod === "string" ? checkOutVerificationMethod.toLowerCase() : checkOutVerificationMethod,
      checkOutFaceImage: resolveBackendAssetUrl(checkOutFaceImage),
      id: att.id || att._id || record._id || record.id,
    };
  },
};

// ─── Attendance Service ──────────────────────────────────────────────────────────
export const attendanceService = {
  getAttendanceRequests: async (filters = {}) => {
    try {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, value]) => value != null && value !== "")),
      ).toString();
      const response = await apiFetch(`${BASE_URL}/attendance-requests${query ? `?${query}` : ""}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || data.error || "Failed to fetch attendance requests" };
      const payload = data.data ?? data;
      const requests = Array.isArray(payload) ? payload : payload.requests || payload.records || [];
      return { success: true, data: requests };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  createAttendanceRequest: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance-requests`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || data.error || "Failed to submit attendance request" };
      return { success: true, data: data.data ?? data, message: data.message };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  approveAttendanceRequest: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance-requests/${id}/approve`, { method: "PATCH", headers: getAuthHeaders() });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || data.error || "Failed to approve request" };
      return { success: true, data: data.data ?? data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  rejectAttendanceRequest: async (id, rejectionReason = "") => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance-requests/${id}/reject`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || data.error || "Failed to reject request" };
      return { success: true, data: data.data ?? data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getAttendances: async (filters = {}) => {
    try {
      const apiFilters = {};
      const empName = filters.employeeName || filters.name;
      if (empName && empName !== "All") {
        apiFilters.employeeName = empName;
      }
      if (filters.leaveType && filters.leaveType !== "All") {
        apiFilters.leaveType = attendanceUtils.leaveTypeToApi(filters.leaveType);
      }
      if (filters.month) {
        apiFilters.month = filters.month;
      }
      if (filters.date) {
        apiFilters.date = filters.date;
      }
      if (filters.status && filters.status !== "All") {
        apiFilters.status = filters.status;
      }

      const queryString = Object.keys(apiFilters).length
        ? "?" +
          new URLSearchParams(
            Object.fromEntries(
              Object.entries(apiFilters).filter(([, v]) => v != null),
            ),
          ).toString()
        : "";

      const response = await apiFetch(`${BASE_URL}/attendance${queryString}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to fetch attendance",
        };
      }

      let finalData = [];
      if (Array.isArray(data)) {
        finalData = data;
      } else if (data.data && Array.isArray(data.data)) {
        finalData = data.data;
      } else if (data.data && typeof data.data === 'object') {
        // Try to find the array inside data.data
        const arrayValues = Object.values(data.data).find(Array.isArray);
        if (arrayValues) finalData = arrayValues;
      } else if (data.attendances && Array.isArray(data.attendances)) {
        finalData = data.attendances;
      } else if (data.records && Array.isArray(data.records)) {
        finalData = data.records;
      }

      return {
        success: true,
        data: finalData,
      };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createAttendance: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to add attendance",
        };
      }

      return { success: true, data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getNextSeries: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance/next-series`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to fetch series",
        };
      }

      return { success: true, data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getEmployeeInfo: async (empId) => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance/employee-info/${empId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to fetch employee info",
        };
      }

      return { success: true, data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getUnmarkedDates: async (empId, month) => {
    try {
      const params = new URLSearchParams({ empId: String(empId), month });
      const response = await apiFetch(
        `${BASE_URL}/attendance/unmarked?${params.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to fetch unmarked dates",
        };
      }

      return { success: true, data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  markAttendanceBulk: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance/mark`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to mark attendance",
        };
      }

      return { success: true, data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  importAttendance: async ({ file, fromDate, toDate }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (fromDate) formData.append("fromDate", fromDate);
      if (toDate) formData.append("toDate", toDate);

      const response = await apiFetch(`${BASE_URL}/attendance/import`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to import attendance",
          data: data.data || null,
        };
      }

      return {
        success: true,
        message: data.message || "Attendance imported successfully",
        data: data.data ?? data,
      };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  downloadAttendanceTemplate: async ({ fromDate, toDate } = {}) => {
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);
      const query = params.toString();
      const response = await apiFetch(
        `${BASE_URL}/attendance/import/template${query ? `?${query}` : ""}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        let message = "Failed to download template";
        try {
          const data = await response.json();
          message = data.error || data.message || message;
        } catch {
          // ignore json parse errors for binary responses
        }
        return { success: false, message };
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^"]+)"?/i);
      const fileName = match?.[1] || "attendance-template.xlsx";
      return { success: true, blob, fileName };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  markSelfAttendance: async (payload = {}) => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance/self`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to mark attendance",
        };
      }

      return { success: true, data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getAttendancesByEmployee: async (empId, month) => {
    try {
      const queryString = month ? `?month=${month}` : "";
      const response = await apiFetch(
        `${BASE_URL}/attendance/employee/${empId}${queryString}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to fetch attendance",
        };
      }

      return {
        success: true,
        data: Array.isArray(data) ? data : data.data || [],
      };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getTodayStatus: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance/today-status`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to fetch status",
        };
      }

      return { success: true, data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  checkInSelf: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance/check-in`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to check in",
        };
      }

      return { success: true, data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  checkOutSelf: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/attendance/check-out`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to check out",
        };
      }

      return { success: true, data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getMyAttendance: async (month) => {
    try {
      const queryString = month ? `?month=${month}` : "";
      const response = await apiFetch(
        `${BASE_URL}/attendance/my-attendance${queryString}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to fetch attendance",
        };
      }

      return {
        success: true,
        data: Array.isArray(data) ? data : data.data || [],
      };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};

// ─── Shift Type Service ──────────────────────────────────────────────────────────
export const shiftService = {
  getShiftTypes: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-types`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch shift types",
        };
      }
      return {
        success: true,
        message: data.message,
        data: data.data || [],
      };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getShiftTypeById: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-types/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch shift type",
        };
      }
      return { success: true, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createShiftType: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-types`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to create shift type",
        };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  updateShiftType: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-types/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update shift type",
        };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  deleteShiftType: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-types/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to delete shift type",
        };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getShiftRequests: async (filters = {}) => {
    try {
      const queryString = Object.keys(filters).length
        ? "?" +
          new URLSearchParams(
            Object.fromEntries(
              Object.entries(filters).filter(([, v]) => v != null),
            ),
          ).toString()
        : "";

      const response = await apiFetch(`${BASE_URL}/shift-requests${queryString}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch shift requests",
        };
      }
      return { success: true, data: data.data || [] };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createShiftRequest: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-requests`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to submit shift request",
        };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  approveShiftRequest: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-requests/${id}/approve`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to approve shift request",
        };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  rejectShiftRequest: async (id, rejectionReason = "") => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-requests/${id}/reject`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason }),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to reject shift request",
        };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};


// ─── Shift Assignment Service ───────────────────────────────────────────────────
const normalizeShiftAssignmentList = (payload) => {
  const root = payload?.data ?? payload;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root?.assignments)) return root.assignments;
  if (Array.isArray(root?.records)) return root.records;
  if (Array.isArray(root?.rows)) return root.rows;
  if (root && typeof root === "object") {
    const arrayValue = Object.values(root).find(Array.isArray);
    if (arrayValue) return arrayValue;
  }
  return [];
};

const normalizeShiftAssignmentMeta = (payload, fallback = {}) => {
  const root = payload?.data ?? payload;
  return {
    page: Number(root?.page ?? fallback.page ?? 1),
    limit: Number(root?.limit ?? fallback.limit ?? 10),
    total: Number(
      root?.total ??
        root?.totalCount ??
        root?.count ??
        fallback.total ??
        normalizeShiftAssignmentList(payload).length ??
        0,
    ),
  };
};

export const shiftAssignmentService = {
  getShiftAssignments: async ({ date, dateFrom, dateTo, search = "", page = 1, limit = 10 } = {}) => {
    try {
      const params = new URLSearchParams();
      if (date) params.set("date", date);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      params.set("search", search ?? "");
      params.set("page", String(page ?? 1));
      params.set("limit", String(limit ?? 10));

      const response = await apiFetch(
        `${BASE_URL}/shift-assignments?${params.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Failed to fetch shift assignments",
        };
      }

      return {
        success: true,
        message: data.message,
        data: normalizeShiftAssignmentList(data),
        meta: normalizeShiftAssignmentMeta(data, { page, limit }),
        raw: data,
      };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  updateRoster: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-assignments/roster`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Failed to update roster",
        };
      }

      return { success: true, message: data.message || "Roster updated", data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  bulkCreate: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-assignments/bulk`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Failed to create shift assignments",
        };
      }

      return { success: true, message: data.message || "Shift assignments saved", data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getEmployeeAssignments: async (employeeId, fromDate = "", toDate = "") => {
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const query = params.toString();
      const response = await apiFetch(
        `${BASE_URL}/shift-assignments/employee/${employeeId}${query ? `?${query}` : ""}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Failed to fetch employee shift assignments",
        };
      }

      return {
        success: true,
        message: data.message,
        data: normalizeShiftAssignmentList(data),
        raw: data,
      };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  deleteShiftAssignment: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/shift-assignments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Failed to delete shift assignment",
        };
      }

      return { success: true, message: data.message || "Shift assignment deleted", data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};


const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });

export const subscriptionService = {
  getManagedPlans: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/plans/manage`);
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch plans" };
      return { success: true, data: data.data || [] };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createManagedPlan: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/plans/manage`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create plan" };
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  updateManagedPlan: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/plans/manage/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update plan" };
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  deleteManagedPlan: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/plans/manage/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete plan" };
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getCurrent: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/current`);
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to fetch subscription" };
      }
      return { success: true, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createOrder: async (planType) => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/create-order`, {
        method: "POST",
        body: JSON.stringify({ planType }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to create order" };
      }
      return { success: true, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  verifyPayment: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/verify-payment`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Payment verification failed" };
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createAddonOrder: async (itemType, quantity = 1) => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/create-addon-order`, {
        method: "POST",
        body: JSON.stringify({ itemType, quantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to create add-on order" };
      }
      return { success: true, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  verifyAddonPayment: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/verify-addon-payment`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Add-on payment verification failed" };
      }
      if (data.data?.plan) {
        const existing = JSON.parse(localStorage.getItem("subscription") || "{}");
        localStorage.setItem(
          "subscription",
          JSON.stringify({
            ...existing,
            isSubscribed: true,
            plan: data.data.plan,
          }),
        );
      }
      return { success: true, message: data.message, data: data.data };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getAllSubscriptions: async (page = 1, limit = 10, search = "") => {
    try {
      const response = await apiFetch(`${BASE_URL}/subscriptions/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to fetch all subscriptions" };
      }
      return { success: true, data: data.data || { subscriptions: [], total: 0 } };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  openCheckout: async (orderData, user) => {
    await loadRazorpayScript();

    return new Promise((resolve) => {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Suhtech ORGA",
        description: orderData.planName,
        order_id: orderData.orderId,
        handler: async (response) => {
          const result = await subscriptionService.verifyPayment({
            planType: orderData.planType,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          resolve(result);
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#756FCC" },
        modal: {
          ondismiss: () => resolve({ success: false, message: "Payment cancelled" }),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  },

  openAddonCheckout: async (orderData, user) => {
    await loadRazorpayScript();

    return new Promise((resolve) => {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Suhtech ORGA",
        description: orderData.planName,
        order_id: orderData.orderId,
        handler: async (response) => {
          const result = await subscriptionService.verifyAddonPayment({
            itemType: orderData.itemType,
            quantity: orderData.quantity,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          resolve(result);
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#756FCC" },
        modal: {
          ondismiss: () => resolve({ success: false, message: "Payment cancelled" }),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  },
};

export const hiringService = {
  // ─── Job Openings ─────────────────────────────────────────────
  createJob: async (jobData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/jobs`, {
        method: "POST",
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create job" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getAllJobs: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/jobs`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch jobs" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getAllVisibleJobs: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/jobs/visible`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch jobs" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getJobById: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/jobs/${id}`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch job" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  updateJob: async (id, jobData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/jobs/${id}`, {
        method: "PUT",
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update job" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  deleteJob: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/jobs/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete job" };
      return { success: true, message: data.message };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  toggleJobStatus: async (id, isActive) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/jobs/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to toggle status" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  // ─── Job Applications ─────────────────────────────────────────
  createApplication: async (jobId, applicationData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/jobs/${jobId}/applications`, {
        method: "POST",
        body: JSON.stringify(applicationData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to submit application" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getApplicationsByJobId: async (jobId) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/jobs/${jobId}/applications`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch applications" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getApplicationById: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/applications/${id}`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch application" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  updateApplicationStatus: async (id, status) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update status" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  deleteApplication: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/applications/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete application" };
      return { success: true, message: data.message };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  updateApplicationNotes: async (id, hrNotes) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/applications/${id}/notes`, {
        method: "PATCH",
        body: JSON.stringify({ hrNotes }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update notes" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  updateApplicationAtsScore: async (id, atsData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/applications/${id}/ats-score`, {
        method: "PATCH",
        body: JSON.stringify({ atsData }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update ATS score" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  analyzeApplication: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/applications/${id}/ats-analyze`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to analyze application" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  // ─── Interviews ───────────────────────────────────────────────
  createInterview: async (interviewData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/interviews`, {
        method: "POST",
        body: JSON.stringify(interviewData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to schedule interview" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getAllInterviews: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/interviews`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch interviews" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getInterviewById: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/interviews/${id}`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch interview" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  updateInterview: async (id, interviewData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/interviews/${id}`, {
        method: "PUT",
        body: JSON.stringify(interviewData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update interview" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  deleteInterview: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/interviews/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete interview" };
      return { success: true, message: data.message };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  submitFeedback: async (id, feedbackData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/interviews/${id}/feedback`, {
        method: "PATCH",
        body: JSON.stringify(feedbackData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to submit feedback" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  createOfferLetter: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create offer letter" };
      return { success: true, message: data.message, data: data.data, emailSent: data.emailSent };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getOfferLetters: async (status = "") => {
    try {
      const query = status ? `?status=${encodeURIComponent(status)}` : "";
      const response = await apiFetch(`${BASE_URL}/hiring/offers${query}`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch offer letters" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getOfferLetterById: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/${id}`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch offer letter" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  sendOfferLetter: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/${id}/send`, { method: "PATCH" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to send offer letter" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  updateOfferLetterStatus: async (id, status) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update offer status" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getPublicOfferByToken: async (token) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/public/${encodeURIComponent(token)}`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch offer letter" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  acceptPublicOffer: async (token) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/public/${encodeURIComponent(token)}/accept`, { method: "PATCH" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to accept offer letter" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  declinePublicOffer: async (token) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/public/${encodeURIComponent(token)}/decline`, { method: "PATCH" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to decline offer letter" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getOfferOnboarding: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/${id}/onboarding`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch onboarding" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getOfferOnboardingPrefill: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/${id}/onboarding/prefill`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch offer prefill" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  startOfferOnboarding: async (id, setupTasks) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/${id}/onboarding/start`, {
        method: "PATCH",
        body: JSON.stringify({ setupTasks }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to start onboarding" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  updateOfferOnboardingTasks: async (id, tasks) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/${id}/onboarding/tasks`, {
        method: "PATCH",
        body: JSON.stringify(tasks),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update onboarding tasks" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  completeOfferOnboarding: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/${id}/onboarding/complete`, { method: "PATCH" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to complete onboarding" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  linkOfferEmployee: async (id, userId) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/offers/${id}/onboarding/link-employee`, {
        method: "PATCH",
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to link employee" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getPublicCandidateDocuments: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/hiring/candidate-documents/public/${encodeURIComponent(token)}`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to load document portal" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  submitPublicCandidateDocuments: async (token, formData) => {
    try {
      const response = await fetch(`${BASE_URL}/hiring/candidate-documents/public/${encodeURIComponent(token)}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to submit documents" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  resendCandidateDocumentEmail: async (applicationId) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/applications/${applicationId}/resend-document-email`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to send document email" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  // ─── Referrals ────────────────────────────────────────────────
  generateReferralCode: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/referrals/generate-code`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to generate code" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  createReferral: async (referralData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/referrals`, {
        method: "POST",
        body: JSON.stringify(referralData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create referral" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getAllReferrals: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/referrals`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch referrals" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getMyReferrals: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/referrals/my`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch referrals" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  getReferralById: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/referrals/${id}`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch referral" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  updateReferral: async (id, referralData) => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/referrals/${id}`, {
        method: "PUT",
        body: JSON.stringify(referralData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update referral" };
      return { success: true, message: data.message, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  // ─── Dashboard Stats ──────────────────────────────────────────
  getDashboardStats: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/hiring/dashboard/stats`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch stats" };
      return { success: true, data: data.data };
    } catch { return { success: false, message: "Something went wrong" }; }
  },

  // ─── File Upload ──────────────────────────────────────────────
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("documents", file);
      const response = await apiFetch(`${BASE_URL}/upload/documents`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to upload file" };
      return { success: true, files: data.files };
    } catch { return { success: false, message: "Something went wrong" }; }
  },
};

export const getProfilePicUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (url.includes("blob.vercel-storage.com")) {
    return `${BASE_URL}/upload/blob?url=${encodeURIComponent(url)}`;
  }
  return resolveBackendAssetUrl(url);
};

export const organizationService = {
  getOrganizations: async (page = 1, limit = 10, search = "") => {
    try {
      const response = await apiFetch(
        `${BASE_URL}/organizations?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch organizations",
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
  getSuperAdminOverview: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/organizations/superadmin/overview`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to fetch superadmin overview",
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

// ─── New Payroll Module Service ──────────────────────────────────────────────────
export const payrollModuleService = {
  // Salary Component
  getSalaryComponents: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-components`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch salary components" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  createSalaryComponent: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-components`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create salary component" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  updateSalaryComponent: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-components/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update salary component" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  deleteSalaryComponent: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-components/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete salary component" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // Salary Structure
  getSalaryStructures: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-structures`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch salary structures" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  createSalaryStructure: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-structures`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create salary structure" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  updateSalaryStructure: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-structures/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update salary structure" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  deleteSalaryStructure: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-structures/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete salary structure" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // Salary Structure Assignment
  getSalaryStructureAssignments: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-structure-assignments`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch assignments" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  createSalaryStructureAssignment: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-structure-assignments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create assignment" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  updateSalaryStructureAssignment: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-structure-assignments/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update assignment" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  deleteSalaryStructureAssignment: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-structure-assignments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete assignment" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // Additional Salary
  getAdditionalSalaries: async (filters = {}) => {
    try {
      const queryString = Object.keys(filters).length
        ? '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null))
        ).toString()
        : '';
      const response = await apiFetch(`${BASE_URL}/payroll/additional-salaries${queryString}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch additional salaries" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  createAdditionalSalary: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/additional-salaries`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create additional salary" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  updateAdditionalSalary: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/additional-salaries/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update additional salary" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  deleteAdditionalSalary: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/additional-salaries/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete additional salary" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // Payroll Entry
  getPayrollEntries: async (filters = {}) => {
    try {
      const queryString = Object.keys(filters).length
        ? '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null))
        ).toString()
        : '';
      const response = await apiFetch(`${BASE_URL}/payroll/entries${queryString}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch payroll entries" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  getPayrollEntry: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/entries/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch payroll entry details" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  createPayrollEntry: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/entries`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create payroll entry" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  finalizePayrollEntry: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/entries/${id}/finalize`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to finalize payroll entry" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // Salary Slip
  getSalarySlips: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-slips`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch salary slips" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  generateSalarySlip: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-slips`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to generate salary slip" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  finalizeSalarySlip: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-slips/${id}/finalize`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to finalize salary slip" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  signOffSalarySlip: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/salary-slips/${id}/sign-off`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to sign off salary slip" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // Payroll Accounting
  getPayrollAccounting: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/accounting`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch payroll accounting entries" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
  getPayrollAccountingEntries: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/payroll/accounting`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch payroll accounting entries" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  // Bank Integration / Export
  getBankExport: async (filters = {}) => {
    try {
      const queryString = Object.keys(filters).length
        ? '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null))
        ).toString()
        : '';
      const response = await apiFetch(`${BASE_URL}/payroll/bank-export${queryString}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch bank export data" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};

// ======================
// SALES CRM SERVICE
// ======================
const buildQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );
  return entries.length ? `?${new URLSearchParams(Object.fromEntries(entries))}` : "";
};

export const salesCrmService = {
  getWorkspace: async () => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/workspace`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch sales workspace" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  getRecords: async (params = {}) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/records${buildQueryString(params)}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to fetch sales records" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createRecord: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/records`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create sales record" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  updateRecord: async (id, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/records/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to update sales record" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  deleteRecord: async (id) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/records/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to delete sales record" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createKnowledge: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/knowledge`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create knowledge article" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createProduct: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/products`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create product" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  createDocument: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/documents`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to create sales document" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  askCopilot: async (question) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/copilot`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to get co-pilot answer" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  convertLead: async (leadId, payload = {}) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/leads/${leadId}/convert`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to convert lead" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  activateClient: async (opportunityId, payload = {}) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/opportunities/${opportunityId}/activate-client`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to activate client" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  checkDuplicates: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/sales/records/check-duplicates`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || "Failed to check duplicates" };
      return data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
};
