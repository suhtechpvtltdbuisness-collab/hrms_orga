export const userService = {
  createEmployee: async (employeeData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/users`, {
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
