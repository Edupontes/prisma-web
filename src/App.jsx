// src/App.jsx
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "@/styles/global"; // se não configurar alias, use "./styles/global"
import { themes } from "@/styles/theme";
import Login from "@/pages/Login";

function ThemeToggle({ onClick, bg }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: ".5rem .75rem",
        borderRadius: 999,
        border: "1px solid #0000",
        background: bg,
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
      }}
      aria-label="Alternar tema"
    >
      🌓 Tema
    </button>
  );
}

export default function App() {
  const [mode, setMode] = useState("light");
  const theme = themes[mode];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div style={{ position: "fixed", right: 16, top: 16, zIndex: 10 }}>
        <ThemeToggle
          onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          bg={theme.accent}
        />
      </div>
      <Login />
    </ThemeProvider>
  );
}
