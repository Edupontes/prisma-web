import { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router-dom";
import { GlobalStyle } from "@/styles/global";
import { themes } from "@/styles/theme";
import { useState } from "react";
import router from "@/routes/router";

export default function App() {
  const [mode] = useState("light"); // depois a gente volta o toggle
  return (
    <ThemeProvider theme={themes[mode]}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
