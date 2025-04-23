import React from "react";

// Tab Button Component
export default function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`tab-button ${active ? "active" : "inactive"}`}
    >
      {icon}
      {label}
    </button>
  );
}
