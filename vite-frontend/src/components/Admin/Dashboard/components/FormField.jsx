import React from "react";

// Reusable Form Field Component with matching dimensions using inline styles
export default function FormField({
  label,
  name,
  type,
  value,
  onChange,
  required = false,
  options = null,
  error = null,
}) {
  // Common inline styles to ensure consistent dimensions across browsers
  const commonStyles = {
    width: "100%",
    height: "44px", // Matching height from screenshot
    padding: "10px 12px",
    borderRadius: "4px",
    border: "1px solid #2d2d2d",
    backgroundColor: "#2d2d2d", // Dark background color from screenshot
    color: "white",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
  };

  // Style object specifically for select elements
  const selectStyles = {
    ...commonStyles,
    appearance: "none", // Remove default browser styling
    backgroundImage:
      'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>\')',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: "32px", // Extra padding for the arrow
  };

  if (type === "select" && options) {
    return (
      <div style={{ marginBottom: "16px", width: "100%" }}>
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#333",
          }}
        >
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          required={required}
          style={selectStyles}
        >
          {options.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "16px", width: "100%" }}>
      <label
        htmlFor={name}
        style={{
          display: "block",
          marginBottom: "8px",
          fontSize: "14px",
          fontWeight: "500",
          color: "#333",
        }}
      >
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        style={commonStyles}
      />
      {error && (
        <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
