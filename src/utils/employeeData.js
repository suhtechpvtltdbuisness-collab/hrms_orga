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
    panNumber: "ABCDE1234F",

    // Performance - Goals
    goals: [
        { id: 1, goal: "Improve UI performance by 30%", progress: "80%", status: "On Track" },
        { id: 2, goal: "Lead the website revamp project", progress: "100%", status: "Completed" },
        { id: 3, goal: "Monitor 2 junior developers", progress: "50%", status: "In Progress" },
    ],

    // Performance - Competencies
    competencies: [
        { id: 1, competency: "Technical Skills", rating: 4, comments: "Strong in react & dev UI" },
        { id: 2, competency: "Communication", rating: 4, comments: "Clear & Concise" },
        { id: 3, competency: "Teamwork", rating: 5, comments: "Excellent Collaboration" },
        { id: 4, competency: "Problem Solving", rating: 4, comments: "Good analytical approach" },
        { id: 5, competency: "Leadership", rating: 3, comments: "Improving" },
    ],

    lastReviewDate: "2025-11-13",
    performanceStatus: "Good",
    overallRating: 4
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
