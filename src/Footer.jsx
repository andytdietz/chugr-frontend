import React from "react";
import { LogoutLink } from "./LogoutLink";

export function Footer() {
  return (
    <footer
      style={{
        bottom: "20px",
        left: "20px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <p style={{ marginRight: "20px", marginBottom: "0" }}>Copyright 2024</p>
    </footer>
  );
}
