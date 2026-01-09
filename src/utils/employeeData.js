export const defaultEmployeeData = {
    // Basic Details
    name: "Rohan Patil",
    designation: "Frontend Developer",
    empId: "EMP-1001",
    gender: "male",
    dob: "1998-01-22",
    bloodGroup: "o+",
    maritalStatus: "married",
    address: "55 Orchard Road, Singapore – 238841",
    mobile: "+91 98453647588",
    email: "rohanp@company.com",
    location: "Mumbai",
    joiningDate: "15 Jan 2022",
    department: "HR",
    manager: "Priya Sharma",
    status: "Active",

    // Emergency Contact
    contactName: "Rohan Patil",
    relation: "Brother",
    contactNumber: "9999999999",

    // Identification
    aadharNumber: "1234-1234-1234",
    panNumber: "ABCDE1234F"
};

const STORAGE_KEY = 'hrms_employee_data';

export const getEmployeeData = () => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            return { ...defaultEmployeeData, ...JSON.parse(storedData) };
        }
    } catch (error) {
        console.error("Error reading from localStorage", error);
    }
    return defaultEmployeeData;
};

export const saveEmployeeData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // Dispatch a custom event so other components can listen for updates if needed
        window.dispatchEvent(new Event('employeeDataUpdated'));
    } catch (error) {
        console.error("Error saving to localStorage", error);
    }
};
