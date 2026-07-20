import React, { useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Eye,
  Pencil,
  Send,
  CheckCircle,
  Search,
  Users,
  Clock3,
  UserCheck,
  CalendarDays,
  Building2,
  ClipboardCheck,
  Laptop,
  Landmark,
  ShieldCheck,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────
   Onboarding Progress Page
───────────────────────────────────────── */
const OnboardingProgress = ({ offer, onBack, onBackToList, onComplete, isCompleted }) => {
  const [completionTasks, setCompletionTasks] = useState({
    verifyDocuments: true,
    approveProfile: isCompleted,
    convertToEmployee: isCompleted,
  });

  const toggleCompletion = (k) =>
    setCompletionTasks((p) => ({ ...p, [k]: !p[k] }));

  const onboardingTasks = [
    {
      task: "Welcome Kit",
      assignedTo: "HR Department",
      dueDate: "10 Feb, 2026",
      status: "Completed",
    },
    {
      task: "Laptop setup",
      assignedTo: "IT Department",
      dueDate: "10 Feb, 2026",
      status: "Completed",
    },
    {
      task: "Training",
      assignedTo: "Candidate",
      dueDate: "10 Feb, 2026",
      status: isCompleted ? "Completed" : "In Progess",
    },
    {
      task: "Welcome kit",
      assignedTo: "HR Department",
      dueDate: "10 Feb, 2026",
      status: "Completed",
    },
  ];

  const getTaskStatusStyle = (status) => {
    const base = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "18px",
      fontFamily: "Poppins, sans-serif",
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "140%",
      letterSpacing: "0%",
      whiteSpace: "nowrap",
      boxSizing: "border-box",
    };
    if (status === "Completed")
      return {
        ...base,
        width: "104px",
        height: "32px",
        padding: "6px 12px",
        gap: "10px",
        background: "#76DB1E33",
        color: "#34C759",
      };
    if (status === "In Progess")
      return {
        ...base,
        width: "96px",
        height: "32px",
        padding: "6px 12px",
        gap: "10px",
        background: "#341EDB33",
        color: "#0088FF",
      };
    return base;
  };

  const completionItems = [
    {
      key: "verifyDocuments",
      title: "Verify Documents",
      subtitle: "All Documents Are Uploaded And Verified.",
    },
    {
      key: "approveProfile",
      title: "Approve Profile",
      subtitle: "Awaiting Final Approval From Manager.",
    },
    {
      key: "convertToEmployee",
      title: "Convert To Employee Master",
      subtitle: "Pending Profile Approval.",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* ── Breadcrumb ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          marginBottom: "10px",
        }}
      >
        <ArrowLeft
          size={14}
          style={{ color: "#111", cursor: "pointer" }}
          onClick={onBackToList}
        />
        <span style={{ color: "#7D1EDB", cursor: "pointer" }} onClick={onBack}>
          {offer.name}
        </span>
        <ChevronRight size={14} color="#9CA3AF" />
        <span style={{ color: "#667085" }}>Onboarding Progress</span>
      </div>

      {/* ── Scrollable Body ── */}
      <div
        className="custom-scrollbar pr-2"
        style={{ flex: 1, overflowY: "auto" }}
      >
        {/* ── Main Figma Card ── */}
        <div
          style={{
            width: "1132px",
            maxWidth: "100%",
            borderRadius: "24px",
            gap: "10px",
            background: "#FFFFFF",
            opacity: 1,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Row */}
            <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontFamily: '"Nunito Sans", sans-serif',
                fontWeight: "600",
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#000000",
                margin: 0,
              }}
            >
              Onboarding Progress
            </h2>
            {!isCompleted && <button
              onClick={() => onComplete && onComplete()}
              disabled={!Object.values(completionTasks).every(Boolean)}
              style={{
                width: "258px",
                height: "48px",
                borderRadius: "26px",
                padding: "10px 16px",
                gap: "8px",
                background: Object.values(completionTasks).every(Boolean)
                  ? "#7D1EDB"
                  : "#9CA3AF",
                color: "#FFFFFF",
                border: "none",
                cursor: Object.values(completionTasks).every(Boolean)
                  ? "pointer"
                  : "not-allowed",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "500",
                fontSize: "16px",
                lineHeight: "140%",
                letterSpacing: "0%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                whiteSpace: "nowrap",
              }}
            >
              Mark Onboarding Complete
            </button>}
          </div>

          {/* ── Two-column body ── */}
          <div style={{ display: "flex", gap: "20px", flex: 1 }}>
            {/* LEFT — Profile Card */}
            <div
              style={{
                width: "414px",
                height: "515px",
                flexShrink: 0,
                border: "1px solid #C4C4C4",
                borderRadius: "8px",
                padding: "16px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Avatar + Name */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
                  alt="Profile"
                  style={{
                    width: "71px",
                    height: "65px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    background: "#D9D9D9",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: '"Nunito Sans", sans-serif',
                      fontWeight: "500",
                      fontSize: "16px",
                      color: "#000000",
                    }}
                  >
                    {offer.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginTop: "2px",
                    }}
                  >
                    Candidate
                  </div>
                </div>
              </div>

              {/* Details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "4px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#1A1A1A",
                      fontWeight: "600",
                    }}
                  >
                    Joining Date :{" "}
                    <span style={{ fontWeight: "400", color: "#374151" }}>
                      January 15, 2024
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#1A1A1A",
                      fontWeight: "600",
                    }}
                  >
                    Department :{" "}
                    <span style={{ fontWeight: "400", color: "#374151" }}>
                      Marketing
                    </span>
                  </div>
                  {isCompleted ? (
                    <div
                      style={{
                        width: "322px",
                        height: "35px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginTop: "4px",
                      }}
                    >
                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <span
                          style={{
                            width: "122px",
                            height: "20px",
                            fontFamily: '"Nunito Sans", sans-serif',
                            fontWeight: "600",
                            fontSize: "15px",
                            lineHeight: "100%",
                            color: "#000000",
                            display: "inline-block",
                          }}
                        >
                          Overall Progress :
                        </span>
                        <span
                          style={{
                            width: "42px",
                            height: "20px",
                            fontFamily: '"Nunito Sans", sans-serif',
                            fontWeight: "600",
                            fontSize: "15px",
                            lineHeight: "100%",
                            color: "#000000",
                            display: "inline-block",
                            textAlign: "right",
                          }}
                        >
                          100%
                        </span>
                      </div>
                      <div
                        style={{
                          width: "302px",
                          height: "6px",
                          background: "#F2F4F7",
                          borderRadius: "3px",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "#2A91D8",
                            borderRadius: "3px",
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#1A1A1A",
                        fontWeight: "600",
                      }}
                    >
                      Status :
                      <span
                        style={{
                          width: "189px",
                          height: "32px",
                          borderRadius: "18px",
                          padding: "6px 12px",
                          gap: "10px",
                          background: "#1E5ADB33",
                          color: "#0088FF",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "140%",
                          letterSpacing: "0%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxSizing: "border-box",
                        }}
                      >
                        Onboarding In Progress
                      </span>
                    </div>
                  )}
                </div>
            </div>

            {/* RIGHT — Tasks + Completion */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Onboarding Tasks Table */}
              <div
                style={{
                  width: "630px",
                  maxWidth: "100%",
                  minHeight: "277px",
                  border: "1px solid #CECECE",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  opacity: 1,
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontWeight: "600",
                    fontSize: "15px",
                    color: "#000000",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  Onboarding Tasks
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#FAFAFA",
                        color: "#9CA3AF",
                        fontSize: "12px",
                      }}
                    >
                      <th
                        style={{
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: "500",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        TASK
                      </th>
                      <th
                        style={{
                          padding: "10px 20px",
                          textAlign: "center",
                          fontWeight: "500",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        ASSIGNED TO
                      </th>
                      <th
                        style={{
                          padding: "10px 20px",
                          textAlign: "center",
                          fontWeight: "500",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        DUE DATE
                      </th>
                      <th
                        style={{
                          padding: "10px 20px",
                          textAlign: "center",
                          fontWeight: "500",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {onboardingTasks.map((row, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                        <td
                          style={{
                            padding: "12px 20px",
                            fontFamily: '"Nunito Sans", sans-serif',
                            fontWeight: "600",
                            fontSize: "16px",
                            lineHeight: "140%",
                            color: "#1E1E1E",
                          }}
                        >
                          {row.task}
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          {row.assignedTo}
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          {row.dueDate}
                        </td>
                        <td
                          style={{ padding: "12px 20px", textAlign: "center" }}
                        >
                          <span style={getTaskStatusStyle(row.status)}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Complete Onboarding */}
              <div
                style={{
                  width: "630px",
                  maxWidth: "100%",
                  minHeight: "275px",
                  border: "1px solid #CACACA",
                  borderRadius: "8px",
                  padding: "16px",
                  gap: "12px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "visible",
                }}
              >
                <div
                  style={{
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#000000",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  Complete Onboarding
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {completionItems.map(({ key, title, subtitle }) => (
                    <label
                      key={key}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: "12px",
                        width: "100%",
                        minHeight: "65px",
                        border: "1px solid #D6D6D6",
                        borderRadius: "4px",
                        padding: "12px",
                        boxSizing: "border-box",
                        cursor: isCompleted ? "default" : "pointer",
                      }}
                    >
                      {isCompleted ? (
                         <CheckCircle
                            size={18}
                            color="#7D1EDB"
                            style={{ flexShrink: 0, marginTop: "2.5px", marginLeft: "2.5px" }}
                          />
                      ) : (
                        <input
                        type="checkbox"
                        checked={completionTasks[key]}
                        onChange={() => toggleCompletion(key)}
                        style={{
                          width: "15px",
                          height: "15px",
                          accentColor: "#7D1EDB",
                          cursor: "pointer",
                          marginTop: "2.5px",
                          marginLeft: "2.5px",
                          flexShrink: 0,
                        }}
                      />
                      )}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: '"Nunito Sans", sans-serif',
                            fontWeight: "600",
                            fontSize: "14px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#000000",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6B7280" }}>
                          {subtitle}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OnboardingFinalView = ({ offer, onBackToList }) => {
  const onboardingTasks = [
    {
      task: "Welcome kit",
      assignedTo: "HR Department",
      dueDate: "10 Feb, 2026",
      status: "Completed",
    },
    {
      task: "Laptop setup",
      assignedTo: "IT Department",
      dueDate: "10 Feb, 2026",
      status: "Completed",
    },
    {
      task: "Training",
      assignedTo: "Candidate",
      dueDate: "10 Feb, 2026",
      status: "Completed",
    },
    {
      task: "Welcome kit",
      assignedTo: "HR Department",
      dueDate: "10 Feb, 2026",
      status: "Completed",
    },
  ];

  const getTaskStatusStyle = () => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "18px",
    fontFamily: "Poppins, sans-serif",
    fontWeight: "500",
    fontSize: "14px",
    lineHeight: "100%",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    width: "104px",
    height: "32px",
    padding: "6px 12px",
    gap: "10px",
    background: "rgba(118, 219, 30, 0.2)", // #76DB1E with 20% opacity
    color: "#76DB1E",
  });

  const completionItems = [
    {
      title: "Verify Documents",
      subtitle: "All Documents Are Uploaded And Verified.",
    },
    {
      title: "Approve Profile",
      subtitle: "Awaiting Final Approval From Manager.",
    },
    {
      title: "Convert To Employee Master",
      subtitle: "Pending Profile Approval.",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          marginBottom: "14px",
          color: "#667085",
        }}
      >
        <ArrowLeft
          size={16}
          style={{ cursor: "pointer", color: "#667085" }}
          onClick={onBackToList}
        />
        <span
          style={{ color: "#7D1EDB", cursor: "pointer" }}
          onClick={onBackToList}
        >
          {offer.name}
        </span>
        <span>Onboarding Progress</span>
      </div>

      <div
        className="custom-scrollbar pr-2"
        style={{ flex: 1, overflowY: "auto" }}
      >
        <div
          style={{
            width: "1094px",
            maxWidth: "100%",
            borderRadius: "24px",
            padding: "16px",
            gap: "24px",
            background: "#FFFFFF",
            opacity: 1,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              fontFamily: '"Nunito Sans", sans-serif',
              fontWeight: "600",
              fontSize: "20px",
              color: "#000000",
              margin: 0,
            }}
          >
            Onboarding Progress
          </h2>

          <div style={{ display: "flex", gap: "24px", flex: 1 }}>
            {/* LEFT Side Profile Card Container */}
            <div
              style={{
                width: "414px",
                height: "515px",
                border: "1px solid #C4C4C4",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxSizing: "border-box",
                opacity: 1,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
                  alt="Profile"
                  style={{
                    width: "71px",
                    height: "65px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    background: "#D9D9D9",
                  }}
                />
                <div>
                  <div
                    style={{
                      width: "83px",
                      height: "22px",
                      fontFamily: '"Nunito Sans", sans-serif',
                      fontWeight: "500",
                      fontSize: "16px",
                      lineHeight: "140%",
                      color: "#000000",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {offer.name}
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B7280" }}>
                    Candidate
                  </div>
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div
                  style={{
                    width: "100%",
                    minHeight: "20px",
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "100%",
                    color: "#000000",
                    whiteSpace: "nowrap",
                  }}
                >
                  Joining Date :{" "}
                  <span style={{ fontWeight: "400" }}>January 15, 2024</span>
                </div>
                <div
                  style={{
                    width: "164px",
                    height: "20px",
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "100%",
                    color: "#000000",
                  }}
                >
                  Department :{" "}
                  <span style={{ fontWeight: "400" }}>Marketing</span>
                </div>

                <div
                  style={{
                    width: "322px",
                    height: "35px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    marginTop: "4px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{
                        width: "122px",
                        height: "20px",
                        fontFamily: '"Nunito Sans", sans-serif',
                        fontWeight: "600",
                        fontSize: "15px",
                        lineHeight: "100%",
                        color: "#000000",
                        display: "inline-block",
                      }}
                    >
                      Overall Progress :
                    </span>
                    <span
                      style={{
                        width: "42px",
                        height: "20px",
                        fontFamily: '"Nunito Sans", sans-serif',
                        fontWeight: "600",
                        fontSize: "15px",
                        lineHeight: "100%",
                        color: "#000000",
                        display: "inline-block",
                        textAlign: "right",
                      }}
                    >
                      100%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "302px",
                      height: "6px",
                      background: "#F2F4F7",
                      borderRadius: "3px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "#2A91D8",
                        borderRadius: "3px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT Side Tables (from Image 2) */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div
                style={{
                  width: "630px",
                  maxWidth: "100%",
                  minHeight: "245px",
                  border: "1px solid #CECECE",
                  borderRadius: "8px",
                  padding: "0",
                  boxSizing: "border-box",
                  opacity: 1,
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontWeight: "600",
                    fontSize: "15px",
                    color: "#000000",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  Onboarding Tasks
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#FAFAFA",
                        color: "#9CA3AF",
                        fontSize: "12px",
                      }}
                    >
                      <th
                        style={{
                          padding: "12px 20px",
                          textAlign: "left",
                          fontWeight: "500",
                        }}
                      >
                        TASK
                      </th>
                      <th
                        style={{
                          padding: "12px 20px",
                          textAlign: "center",
                          fontWeight: "500",
                        }}
                      >
                        ASSIGNED TO
                      </th>
                      <th
                        style={{
                          padding: "12px 20px",
                          textAlign: "center",
                          fontWeight: "500",
                        }}
                      >
                        DUE DATE
                      </th>
                      <th
                        style={{
                          padding: "12px 20px",
                          textAlign: "center",
                          fontWeight: "500",
                        }}
                      >
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {onboardingTasks.map((row, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                        <td
                          style={{
                            padding: "12px 20px",
                            fontFamily: '"Nunito Sans", sans-serif',
                            fontWeight: "600",
                            fontSize: "16px",
                            lineHeight: "140%",
                            color: "#1E1E1E",
                          }}
                        >
                          {row.task}
                        </td>
                        <td
                          style={{ padding: "12px 20px", textAlign: "center" }}
                        >
                          {row.assignedTo}
                        </td>
                        <td
                          style={{ padding: "12px 20px", textAlign: "center" }}
                        >
                          {row.dueDate}
                        </td>
                        <td
                          style={{ padding: "12px 20px", textAlign: "center" }}
                        >
                          <span style={getTaskStatusStyle(row.status)}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "598px",
                    height: "20px",
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "100%",
                    color: "#000000",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #F3F4F6",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Complete Onboarding
                </div>
                {completionItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px",
                      border: "1px solid #D6D6D6",
                      borderRadius: "4px",
                    }}
                  >
                    <CheckCircle
                      size={18}
                      color="#7D1EDB"
                      style={{ flexShrink: 0 }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: '"Nunito Sans", sans-serif',
                          fontWeight: "600",
                          fontSize: "14px",
                          lineHeight: "100%",
                          color: "#000000",
                          display: "flex",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Candidate Detail View  (inline "new page")
───────────────────────────────────────── */
const CandidateView = ({ offer, onBack, onStartOnboarding }) => {
  const [tasks, setTasks] = useState({
    documentSubmission: true,
    bankDetails: true,
    itSetup: true,
    card: true,
    systemAccess: true,
  });
  const toggle = (k) => setTasks((p) => ({ ...p, [k]: !p[k] }));

  return (
    /* outer wrapper — same padding/margin as the list page */
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* ── Breadcrumb ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          marginBottom: "10px",
        }}
      >
        <ArrowLeft
          size={14}
          style={{ color: "#111", cursor: "pointer" }}
          onClick={onBack}
        />
        <span style={{ color: "#7D1EDB", cursor: "pointer" }} onClick={onBack}>
          Offer Letter Accepted List
        </span>
        <ChevronRight size={14} color="#9CA3AF" />
        <span style={{ color: "#667085" }}>{offer.name}</span>
      </div>

      <div
        className="custom-scrollbar pr-2"
        style={{ flex: 1, overflowY: "auto" }}
      >
        {/* ── Card that matches Figma exactly ── */}
        <div
          style={{
            width: "1132px",
            maxWidth: "100%",
            borderRadius: "24px",
            gap: "10px",
            background: "#FFFFFF",
            opacity: 1,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Name + Start Onboarding button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <h2
              style={{
                fontFamily: '"Nunito Sans", sans-serif',
                fontWeight: "600",
                fontSize: "20px",
                lineHeight: "140%",
                letterSpacing: "0%",
                color: "#000000",
                margin: 0,
              }}
            >
              {offer.name}
            </h2>
            <button
              onClick={onStartOnboarding}
              disabled={!Object.values(tasks).every(Boolean)}
              style={{
                width: "172px",
                height: "48px",
                borderRadius: "26px",
                padding: "10px 16px",
                gap: "8px",
                background: Object.values(tasks).every(Boolean)
                  ? "#7D1EDB"
                  : "#9CA3AF",
                color: "#FFFFFF",
                border: "none",
                cursor: Object.values(tasks).every(Boolean)
                  ? "pointer"
                  : "not-allowed",
                fontFamily: "Poppins, sans-serif",
                fontWeight: "500",
                fontSize: "16px",
                lineHeight: "140%",
                letterSpacing: "0%",
                opacity: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              Start Onboarding
            </button>
          </div>

          {/* ── Inner frame matching Figma Frame 2147227055 ── */}
          <div
            style={{
              width: "1078px",
              maxWidth: "100%",
              borderRadius: "8px",
              border: "1px solid #E3E3E3",
              padding: "16px",
              gap: "16px",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            {/* Profile card */}
            <div
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
                  alt="Profile"
                  style={{
                    width: "71px",
                    height: "65px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    background: "#D9D9D9",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: '"Nunito Sans", sans-serif',
                      fontWeight: "500",
                      fontSize: "16px",
                      lineHeight: "140%",
                      letterSpacing: "0%",
                      color: "#000000",
                    }}
                  >
                    {offer.name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6B7280",
                      marginTop: "2px",
                    }}
                  >
                    Senior Product Designer
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "130px",
                  height: "32px",
                  borderRadius: "18px",
                  padding: "6px 12px",
                  gap: "10px",
                  background: "#76DB1E33",
                  color: "#34C759",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: "400",
                  lineHeight: "140%",
                  boxSizing: "border-box",
                }}
              >
                Offer Accepted
              </div>
            </div>

            {/* Timeline row */}
            <div style={{ display: "flex", gap: "10px" }}>
              {/* Offer Send */}
              <div
                style={{
                  width: "157px",
                  borderRadius: "4px",
                  border: "1px solid #EBEBEB",
                  background: "#F2F2F7",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#6B7280",
                    fontSize: "12px",
                  }}
                >
                  <span>Offer Send</span>
                  <Send size={16} />
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1A1A1A",
                  }}
                >
                  July 15, 2024
                </div>
              </div>

              {/* Offer Viewed */}
              <div
                style={{
                  width: "157px",
                  borderRadius: "4px",
                  border: "1px solid #EBEBEB",
                  background: "#F2F2F7",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#6B7280",
                    fontSize: "12px",
                  }}
                > 
                  <span>Offer Viewed</span>
                  <Eye size={16} />
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1A1A1A",
                  }}
                >
                  July 16, 2024
                </div>
              </div>

              {/* Offer Accepted */}
              <div
                style={{
                  width: "157px",
                  borderRadius: "4px",
                  border: "1px solid #EBEBEB",
                  background: "#F2F2F7",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#6B7280",
                    fontSize: "12px",
                  }}
                >
                  <span>Offer Accepted</span>
                  <CheckCircle size={16} />
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1A1A1A",
                  }}
                >
                  July 20, 2024
                </div>
              </div>
            </div>

            {/* Onboarding Setup */}
            <div
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#1A1A1A",
                  marginBottom: "12px",
                }}
              >
                Onboarding Setup
              </div>
              <div style={{ display: "flex", gap: "60px" }}>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9CA3AF",
                      marginBottom: "4px",
                    }}
                  >
                    Joining Date
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1A1A1A",
                    }}
                  >
                    September 1, 2024
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9CA3AF",
                      marginBottom: "4px",
                    }}
                  >
                    Department
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1A1A1A",
                    }}
                  >
                    Product Development
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9CA3AF",
                      marginBottom: "4px",
                    }}
                  >
                    Hiring Manager
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1A1A1A",
                    }}
                  >
                    Nisha Gupta
                  </div>
                </div>
              </div>
            </div>

            {/* Assign Onboarding Tasks */}
            <div
              style={{
                width: "733px",
                maxWidth: "100%",
                minHeight: "114px",
                borderRadius: "8px",
                padding: "12px",
                gap: "8px",
                border: "1px solid #D1D1D1",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#1A1A1A",
                  marginBottom: "14px",
                }}
              >
                Assign Onboarding Tasks
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "14px 32px",
                }}
              >
                {[
                  { key: "documentSubmission", label: "Document Submission" },
                  { key: "bankDetails", label: "Bank Details" },
                  { key: "itSetup", label: "IT Setup" },
                  { key: "card", label: "Card" },
                  { key: "systemAccess", label: "System Access" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                      fontFamily: '"Nunito Sans", sans-serif',
                      fontWeight: "600",
                      fontSize: "17px",
                      lineHeight: "100%",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={tasks[key]}
                      onChange={() => toggle(key)}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#7D1EDB",
                        cursor: "pointer",
                        borderRadius: "4px",
                        flexShrink: 0,
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* end inner Figma frame */}
        </div>
      </div>
    </div>
  );
};

const CandidateAvatar = ({ name, size = 'large' }) => (
  <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 font-bold text-white shadow-sm ${size === 'large' ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-base'}`}>
    {name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
  </div>
);

const PolishedCandidateView = ({ offer, onBack, onStartOnboarding }) => {
  const milestones = [
    { label: 'Offer sent', date: '15 Jul, 2024', Icon: Send },
    { label: 'Offer viewed', date: '16 Jul, 2024', Icon: Eye },
    { label: 'Offer accepted', date: offer.date, Icon: CheckCircle },
  ];
  const setupTasks = [
    { label: 'Document submission', Icon: ClipboardCheck },
    { label: 'Bank details', Icon: Landmark },
    { label: 'IT setup', Icon: Laptop },
    { label: 'ID card', Icon: UserCheck },
    { label: 'System access', Icon: ShieldCheck },
  ];

  return <div className="flex h-full flex-col">
    <button onClick={onBack} className="mb-4 flex w-fit items-center gap-2 text-sm font-semibold text-[#7D1EDB]"><ArrowLeft size={16} />Offer Letter Accepted<ChevronRight size={15} className="text-slate-400" /><span className="font-normal text-slate-500">{offer.name}</span></button>
    <div className="custom-scrollbar flex-1 overflow-y-auto pr-1">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Candidate onboarding</p><h1 className="mt-1 text-2xl font-bold text-slate-900">{offer.name}</h1><p className="mt-1 text-sm text-slate-500">Review offer details and prepare the onboarding plan.</p></div>
        <button onClick={onStartOnboarding} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7D1EDB] px-6 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"><ClipboardCheck size={18} />Start onboarding</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 bg-gradient-to-r from-slate-50 to-violet-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><CandidateAvatar name={offer.name} /><div><h2 className="text-lg font-bold text-slate-900">{offer.name}</h2><p className="text-sm text-slate-500">Senior Product Designer</p><p className="mt-1 text-xs text-slate-400">Candidate #{offer.srNo}</p></div></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"><CheckCircle size={16} />Offer accepted</span>
        </div>

        <div className="grid gap-4 border-t border-slate-100 p-5 md:grid-cols-3">
          {milestones.map(({ label, date, Icon }, index) => <div key={label} className="relative rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Icon size={17} /></span><div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-0.5 font-bold text-slate-800">{date}</p></div></div>{index < 2 && <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-violet-200 md:block" />}</div>)}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><CalendarDays size={19} className="text-violet-600" /><h2 className="font-bold text-slate-900">Onboarding setup</h2></div><div className="space-y-3">{[
          ['Joining date', offer.joiningDate, CalendarDays],
          ['Department', 'Product Development', Building2],
          ['Hiring manager', 'Nisha Gupta', Users],
        ].map(([label, value, Icon]) => <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm"><Icon size={17} /></span><div><p className="text-xs text-slate-400">{label}</p><p className="font-semibold text-slate-700">{value}</p></div></div>)}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="font-bold text-slate-900">Assigned onboarding tasks</h2><p className="mt-1 text-xs text-slate-500">All essentials are selected and ready for onboarding.</p></div><div className="grid gap-3 sm:grid-cols-2">{setupTasks.map(({ label, Icon }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-violet-700"><Icon size={17} /></span><span className="flex-1 text-sm font-semibold text-slate-700">{label}</span><CheckCircle size={18} className="text-emerald-500" /></div>)}</div></div>
      </div>
    </div>
  </div>;
};

const PolishedOnboardingProgress = ({ offer, onBackToList, onComplete, isCompleted }) => {
  const [checks, setChecks] = useState({ documents: true, profile: isCompleted, employee: isCompleted });
  const allDone = Object.values(checks).every(Boolean);
  const tasks = [
    { name: 'Welcome kit', owner: 'HR Department', status: 'Completed', Icon: ClipboardCheck },
    { name: 'Laptop & IT setup', owner: 'IT Department', status: 'Completed', Icon: Laptop },
    { name: 'Product training', owner: 'Candidate', status: isCompleted ? 'Completed' : 'In Progress', Icon: Users },
    { name: 'System access', owner: 'IT Department', status: 'Completed', Icon: ShieldCheck },
  ];
  const completedCount = tasks.filter((task) => task.status === 'Completed').length;
  const progress = isCompleted ? 100 : Math.round((completedCount / tasks.length) * 100);
  const completionItems = [
    ['documents', 'Verify documents', 'All required documents are uploaded and verified.'],
    ['profile', 'Approve candidate profile', 'Confirm personal and employment information.'],
    ['employee', 'Convert to employee master', 'Create the final employee record and access.'],
  ];

  return <div className="flex h-full flex-col">
    <button onClick={onBackToList} className="mb-4 flex w-fit items-center gap-2 text-sm font-semibold text-[#7D1EDB]"><ArrowLeft size={16} />Offer Letter Accepted<ChevronRight size={15} className="text-slate-400" /><span className="font-normal text-slate-500">Onboarding Progress</span></button>
    <div className="custom-scrollbar flex-1 overflow-y-auto pr-1">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Onboarding workspace</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Onboarding progress</h1><p className="mt-1 text-sm text-slate-500">Complete the remaining steps for {offer.name}.</p></div><button onClick={onComplete} disabled={!allDone || isCompleted} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7D1EDB] px-6 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"><CheckCircle size={18} />{isCompleted ? 'Onboarding completed' : 'Mark onboarding complete'}</button></div>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="bg-gradient-to-br from-[#756FCC] to-[#A276DB] p-5 text-white"><div className="flex items-center gap-3"><CandidateAvatar name={offer.name} size="small" /><div><h2 className="font-bold">{offer.name}</h2><p className="text-xs text-violet-100">Candidate #{offer.srNo}</p></div></div><div className="mt-5 flex items-end justify-between"><div><p className="text-xs text-violet-100">Overall progress</p><p className="mt-1 text-3xl font-bold">{progress}%</p></div><CheckCircle size={30} className="text-white/80" /></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} /></div></div><div className="space-y-3 p-5">{[['Joining date',offer.joiningDate,CalendarDays],['Department','Product Development',Building2],['Hiring manager','Nisha Gupta',Users]].map(([label,value,Icon]) => <div key={label} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700"><Icon size={16} /></span><div><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-semibold text-slate-700">{value}</p></div></div>)}</div></aside>

        <div className="space-y-5"><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Onboarding tasks</h2><p className="mt-1 text-xs text-slate-500">{completedCount} of {tasks.length} tasks completed</p></div><div className="divide-y divide-slate-100">{tasks.map(({ name, owner, status, Icon }) => <div key={name} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon size={18} /></span><div className="flex-1"><p className="font-semibold text-slate-800">{name}</p><p className="text-xs text-slate-500">Assigned to {owner} · Due 10 Feb, 2026</p></div><span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${status === 'Completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>{status}</span></div>)}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="font-bold text-slate-900">Complete onboarding</h2><p className="mt-1 text-xs text-slate-500">Finish these checks to enable final completion.</p></div><div className="space-y-3">{completionItems.map(([key,title,subtitle]) => <label key={key} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${checks[key] ? 'border-violet-200 bg-violet-50/50' : 'border-slate-200 hover:bg-slate-50'}`}><input type="checkbox" checked={checks[key]} onChange={() => setChecks((current) => ({ ...current, [key]: !current[key] }))} className="mt-1 h-4 w-4 accent-violet-600" /><div><p className="text-sm font-bold text-slate-800">{title}</p><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div></label>)}</div></section></div>
      </div>
    </div>
  </div>;
};

/* ─────────────────────────────────────────
   Offer Letter Accepted List  (main page)
───────────────────────────────────────── */
const OfferLetterAcceptedList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Track completed IDs globally (or in a real app, this would be from an API)
  const [completedOnboardingIds, setCompletedOnboardingIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [acceptedOffers, setAcceptedOffers] = useState([
    {
      id: 1,
      srNo: "01",
      name: "Olivia Rhye",
      date: "8 Jan, 2026",
      joiningDate: "15 Jan, 2026",
      status: "Onboarding Completed",
    },
    {
      id: 2,
      srNo: "02",
      name: "Olivia Rhye",
      date: "10 Feb, 2026",
      joiningDate: "17 Feb, 2026",
      status: "Onboarding In Progress",
    },
    {
      id: 3,
      srNo: "03",
      name: "Olivia Rhye",
      date: "18 Feb, 2026",
      joiningDate: "25 Feb, 2026",
      status: "Onboarding Completed",
    },
    {
      id: 4,
      srNo: "04",
      name: "Olivia Rhye",
      date: "20 Feb, 2026",
      joiningDate: "1 Mar, 2026",
      status: "Onboarding In Progress",
    },
    {
      id: 5,
      srNo: "05",
      name: "Olivia Rhye",
      date: "1 March, 2026",
      joiningDate: "8 Mar, 2026",
      status: "Onboarding Completed",
    },
    {
      id: 6,
      srNo: "06",
      name: "Olivia Rhye",
      date: "20 March, 2026",
      joiningDate: "27 Mar, 2026",
      status: "Onboarding Completed",
    },
  ]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', date: '', joiningDate: '', status: '' });

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setEditForm({ name: offer.name, date: offer.date, joiningDate: offer.joiningDate || '', status: offer.displayStatus || offer.status });
  };

  const saveOfferChanges = (event) => {
    event.preventDefault();
    if (!editForm.name.trim() || !editForm.date.trim() || !editForm.joiningDate.trim()) return;
    setAcceptedOffers((current) => current.map((offer) => offer.id === editingOffer.id ? {
      ...offer,
      name: editForm.name.trim(),
      date: editForm.date.trim(),
      joiningDate: editForm.joiningDate.trim(),
      status: editForm.status,
    } : offer));
    setCompletedOnboardingIds((current) => {
      const next = new Set(current);
      if (editForm.status === 'Onboarding Completed') next.add(editingOffer.id);
      else next.delete(editingOffer.id);
      return next;
    });
    setEditingOffer(null);
  };

  const selectedOffer = id ? acceptedOffers.find(o => o.id === parseInt(id)) : null;
  const isOnboardingView = location.pathname.includes("/onboarding");
  const view = isOnboardingView ? "onboarding" : (selectedOffer ? "candidate" : "list");
  const isCompleted = id && completedOnboardingIds.has(parseInt(id));

  const offersWithStatus = useMemo(() => acceptedOffers.map((offer) => ({
    ...offer,
    displayStatus: completedOnboardingIds.has(offer.id) ? "Onboarding Completed" : offer.status,
  })), [acceptedOffers, completedOnboardingIds]);

  const filteredOffers = useMemo(() => offersWithStatus.filter((offer) => {
    const matchesSearch = `${offer.name} ${offer.date} ${offer.joiningDate}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || offer.displayStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }), [offersWithStatus, search, statusFilter]);

  const handleMarkComplete = () => {
    setCompletedOnboardingIds(prev => new Set(prev).add(parseInt(id)));
  };

  const getStatusStyle = (status) => {
    const common = {
      height: "32px",
      borderRadius: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "400",
      fontFamily: "Poppins, sans-serif",
      lineHeight: "140%",
      textTransform: "capitalize",
      padding: "0 16px",
    };
    if (status === "Onboarding Completed")
      return {
        ...common,
        width: "192px",
        height: "32px",
        padding: "6px 12px",
        gap: "10px",
        borderRadius: "18px",
        backgroundColor: "#76DB1E33",
        color: "#34C759",
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "140%",
        opacity: "1",
      };
    if (status === "Onboarding In Progress")
      return {
        ...common,
        width: "189px",
        height: "32px",
        padding: "6px 12px",
        gap: "10px",
        borderRadius: "18px",
        backgroundColor: "#1E5ADB33",
        color: "#0088FF",
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "140%",
        opacity: "1",
      };
    return common;
  };

  /* ── Onboarding Progress view ── */
  if (view === "onboarding" && selectedOffer) {
    return (
      <div
        className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9] overflow-hidden"
        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
      >
        <PolishedOnboardingProgress
          offer={selectedOffer}
          isCompleted={isCompleted}
          onBackToList={() => navigate("/hrms/hiring-and-recruitment/offer-letter-accepted-list")}
          onComplete={handleMarkComplete}
        />
      </div>
    );
  }

  /* ── Candidate Detail view ── */
  if (view === "candidate" && selectedOffer) {
    return (
      <div
        className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9] overflow-hidden"
        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
      >
        <PolishedCandidateView
          offer={selectedOffer}
          onBack={() => navigate("/hrms/hiring-and-recruitment/offer-letter-accepted-list")}
          onStartOnboarding={() => navigate(`/hrms/hiring-and-recruitment/offer-letter-accepted-list/${id}/onboarding`)}
        />
      </div>
    );
  }

  /* ── default: list view ── */
  return (
    <div className="mx-2 my-4 flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-xl border border-[#D9D9D9] bg-white px-4 py-5 sm:mx-4 sm:px-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      <button onClick={() => navigate('/hrms')} className="mb-3 flex w-fit items-center gap-2 text-sm font-medium text-[#7D1EDB]"><ArrowLeft size={16} />HRMS Dashboard<ChevronRight size={15} className="text-slate-400" /><span className="font-normal text-slate-500">Offer Letter Accepted</span></button>

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><h1 className="text-xl font-semibold text-slate-900">Offer Letter Accepted</h1><p className="mt-1 text-sm text-slate-500">Track accepted offers and manage candidate onboarding progress.</p></div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Accepted Offers', value: offersWithStatus.length, Icon: Users, tone: 'bg-violet-100 text-violet-700' },
          { label: 'Onboarding In Progress', value: offersWithStatus.filter((item) => item.displayStatus === 'Onboarding In Progress').length, Icon: Clock3, tone: 'bg-blue-100 text-blue-700' },
          { label: 'Onboarding Completed', value: offersWithStatus.filter((item) => item.displayStatus === 'Onboarding Completed').length, Icon: UserCheck, tone: 'bg-emerald-100 text-emerald-700' },
        ].map(({ label, value, Icon, tone }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon size={20} /></span><div><p className="text-2xl font-bold text-slate-900">{value}</p><p className="text-xs font-medium text-slate-500">{label}</p></div></div>)}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate or date" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" /></div>
        <div className="flex gap-2 overflow-x-auto">{['All','Onboarding In Progress','Onboarding Completed'].map((item) => <button key={item} onClick={() => setStatusFilter(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${statusFilter === item ? 'bg-[#7D1EDB] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{item}</button>)}</div>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-slate-200">
        {filteredOffers.length === 0 ? <div className="flex h-56 flex-col items-center justify-center text-center"><Users size={38} className="mb-3 text-violet-300" /><p className="font-semibold text-slate-700">No accepted offers found</p><p className="mt-1 text-sm text-slate-500">Try changing the search or status filter.</p></div> : <table className="w-full min-w-[900px] text-left text-sm"><thead className="sticky top-0 z-10 bg-slate-50"><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th className="px-5 py-3 font-semibold">Candidate</th><th className="px-5 py-3 font-semibold">Accepted date</th><th className="px-5 py-3 font-semibold">Joining date</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 text-right font-semibold">Actions</th></tr></thead><tbody>{filteredOffers.map((offer) => <tr key={offer.id} className="border-b border-slate-100 transition hover:bg-violet-50/30"><td className="px-5 py-4"><button onClick={() => navigate(`/hrms/hiring-and-recruitment/offer-letter-accepted-list/${offer.id}`)} className="flex items-center gap-3 text-left"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">{offer.name.split(' ').map((part) => part[0]).join('').slice(0,2)}</span><div><p className="font-semibold text-slate-800">{offer.name}</p><p className="text-xs text-slate-500">Candidate #{offer.srNo}</p></div></button></td><td className="px-5 py-4 text-slate-600">{offer.date}</td><td className="px-5 py-4 font-medium text-slate-700">{offer.joiningDate || 'Not scheduled'}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${offer.displayStatus === 'Onboarding Completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>{offer.displayStatus}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button title="View candidate" onClick={() => navigate(`/hrms/hiring-and-recruitment/offer-letter-accepted-list/${offer.id}`)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-200 text-violet-700 transition hover:bg-violet-50"><Eye size={17} /></button><button title="Edit candidate" onClick={() => openEditModal(offer)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"><Pencil size={16} /></button></div></td></tr>)}</tbody></table>}
      </div>

      {editingOffer && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={() => setEditingOffer(null)}><form onSubmit={saveOfferChanges} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between bg-gradient-to-r from-[#756FCC] to-[#A276DB] px-6 py-5 text-white"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">Candidate offer</p><h2 className="mt-1 text-xl font-bold">Edit accepted offer</h2></div><button type="button" onClick={() => setEditingOffer(null)} className="rounded-lg bg-white/10 p-2 hover:bg-white/20"><X size={19} /></button></div><div className="space-y-4 p-6"><label className="block text-sm font-semibold text-slate-700">Candidate name<input autoFocus value={editForm.name} onChange={(event) => setEditForm((form) => ({ ...form, name: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" required /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-slate-700">Offer accepted date<input value={editForm.date} onChange={(event) => setEditForm((form) => ({ ...form, date: event.target.value }))} placeholder="e.g. 8 Jan, 2026" className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" required /></label><label className="block text-sm font-semibold text-slate-700">Joining date<input value={editForm.joiningDate} onChange={(event) => setEditForm((form) => ({ ...form, joiningDate: event.target.value }))} placeholder="e.g. 15 Jan, 2026" className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" required /></label></div><label className="block text-sm font-semibold text-slate-700">Onboarding status<select value={editForm.status} onChange={(event) => setEditForm((form) => ({ ...form, status: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"><option>Onboarding In Progress</option><option>Onboarding Completed</option></select></label></div><div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4"><button type="button" onClick={() => setEditingOffer(null)} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">Cancel</button><button className="rounded-xl bg-[#7D1EDB] px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700">Save changes</button></div></form></div>}
    </div>
  );
};

export default OfferLetterAcceptedList;
