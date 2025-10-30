import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/global";
import { themes } from "./styles/theme";
import Button from "./components/Button";

export default function App() {
  const [mode, setMode] = useState("light");

  return (
    <ThemeProvider theme={themes[mode]}>
      <GlobalStyle />
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <h1>Botão Prisma</h1>
        <Button>Entrar</Button>
        <Button disabled>Desabilitado</Button>
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: themes[mode].accent,
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Alternar tema
        </button>
      </div>
    </ThemeProvider>
  );
}
