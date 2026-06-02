// components/PageTitle.jsx
import React from "react";

function PageTitle({ title, subtitle = null }) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{title}</h1>
      {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "28px",
    paddingLeft: "4px",
  },
  title: {
    fontSize: "34px",
    fontWeight: "590",
    color: "#F8FAFC",
    letterSpacing: "-0.02em",
    margin: 0,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: "15px",
    fontWeight: "450",
    color: "#64748B",
    marginTop: "8px",
    marginBottom: 0,
    letterSpacing: "-0.01em",
  },
};

export default PageTitle;