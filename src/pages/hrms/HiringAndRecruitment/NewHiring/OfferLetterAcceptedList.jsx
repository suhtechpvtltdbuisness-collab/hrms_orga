import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Eye,
  Pencil,
  Send,
  CheckCircle,
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

  const getTaskStatusStyle = (status) => ({
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

/* ─────────────────────────────────────────
   Offer Letter Accepted List  (main page)
───────────────────────────────────────── */
const OfferLetterAcceptedList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Track completed IDs globally (or in a real app, this would be from an API)
  const [completedOnboardingIds, setCompletedOnboardingIds] = useState(new Set());

  const [acceptedOffers] = useState([
    {
      id: 1,
      srNo: "01",
      name: "Olivia Rhye",
      date: "8 Jan, 2026",
      status: "Onboarding Completed",
    },
    {
      id: 2,
      srNo: "02",
      name: "Olivia Rhye",
      date: "10 Feb, 2026",
      status: "Onboarding In Progress",
    },
    {
      id: 3,
      srNo: "03",
      name: "Olivia Rhye",
      date: "18 Feb, 2026",
      status: "Onboarding Completed",
    },
    {
      id: 4,
      srNo: "04",
      name: "Olivia Rhye",
      date: "20 Feb, 2026",
      status: "Onboarding In Progress",
    },
    {
      id: 5,
      srNo: "05",
      name: "Olivia Rhye",
      date: "1 March, 2026",
      status: "Onboarding Completed",
    },
    {
      id: 6,
      srNo: "06",
      name: "Olivia Rhye",
      date: "20 March, 2026",
      status: "Onboarding Completed",
    },
  ]);

  const selectedOffer = id ? acceptedOffers.find(o => o.id === parseInt(id)) : null;
  const isOnboardingView = location.pathname.includes("/onboarding");
  const view = isOnboardingView ? "onboarding" : (selectedOffer ? "candidate" : "list");
  const isCompleted = id && completedOnboardingIds.has(parseInt(id));

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
        <OnboardingProgress
          offer={selectedOffer}
          isCompleted={isCompleted}
          onBack={() => navigate(`/hrms/hiring-and-recruitment/offer-letter-accepted-list/${id}`)}
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
        <CandidateView
          offer={selectedOffer}
          onBack={() => navigate("/hrms/hiring-and-recruitment/offer-letter-accepted-list")}
          onStartOnboarding={() => navigate(`/hrms/hiring-and-recruitment/offer-letter-accepted-list/${id}/onboarding`)}
        />
      </div>
    );
  }

  /* ── default: list view ── */
  return (
    <div
      className="bg-white px-4 sm:px-4 md:px-6 py-4 mx-2 sm:mx-4 mt-4 mb-4 rounded-xl h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)] xl:h-[calc(100vh-11rem)] flex flex-col font-sans border border-[#D9D9D9]"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      {/* Breadcrumb Section */}
      <div className="flex items-center text-sm text-[#7D1EDB] mb-3 shrink-0">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/hrms")}
        >
          <ArrowLeft size={14} className="text-gray-900" />
          <span className="hover:text-purple-500"> HRMS Dashboard</span>
        </div>
        <ChevronRight size={16} className="mx-1 text-[#9CA3AF]" />
        <span className="text-[#667085] text-[14px]">
          Offer Letter Accepted List
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: "24px" }} className="shrink-0">
        <h1
          className="text-xl font-semibold text-[#494949]"
          style={{ fontFamily: '"Nunito Sans", sans-serif' }}
        >
          Offer Letter Accepted List
        </h1>
      </div>

      {/* Table Container */}
      <div
        className="bg-white flex-1 overflow-y-auto custom-scrollbar"
        style={{
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #CECECE",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="min-w-max w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 border-b border-gray-300">
              <tr className="text-gray-500">
                <th className="px-4 py-3 font-medium text-[12px] uppercase tracking-wider">
                  SR NO
                </th>
                <th className="px-4 py-3 font-medium text-[12px] uppercase tracking-wider">
                  CANDIDATE NAME
                </th>
                <th className="px-4 py-3 font-medium text-[12px] uppercase tracking-wider text-center">
                  OFFER LETTER ACCEPTED DATE
                </th>
                <th className="px-4 py-3 font-medium text-[12px] uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-4 py-3 font-medium text-[12px] uppercase tracking-wider text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {acceptedOffers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-700">{offer.srNo}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[#7268FF] font-medium text-[15px] cursor-pointer hover:underline"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                      onClick={() => navigate(`/hrms/hiring-and-recruitment/offer-letter-accepted-list/${offer.id}`)}
                    >
                      {offer.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-center">
                    {offer.date}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center justify-center font-medium"
                      style={getStatusStyle(completedOnboardingIds.has(offer.id) ? "Onboarding Completed" : offer.status)}
                    >
                      {completedOnboardingIds.has(offer.id) ? "Onboarding Completed" : offer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <Eye
                        size={24}
                        strokeWidth={2}
                        className="text-[#7D1EDB] cursor-pointer hover:text-purple-700 transition-colors"
                        onClick={() => navigate(`/hrms/hiring-and-recruitment/offer-letter-accepted-list/${offer.id}`)}
                      />
                      <Pencil
                        size={18}
                        strokeWidth={2}
                        className="text-[#C6131B] cursor-pointer hover:text-red-700 transition-colors"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfferLetterAcceptedList;
