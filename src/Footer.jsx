import React from "react";
import { LogoutLink } from "./LogoutLink";

export function Footer() {
  return (
    <footer
      style={{
        bottom: "20px", // Adjust this value to make it closer to the bottom
        left: "20px", // Adjust this value to make it closer to the left
        display: "flex",
        alignItems: "center",
      }}
    >
      <p style={{ marginRight: "20px", marginBottom: "0" }}>Copyright 2024</p>
    </footer>
  );
}
