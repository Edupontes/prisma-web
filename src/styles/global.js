// src/styles/global.js
import { createGlobalStyle } from "styled-components";
import "normalize.css";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }

  body {
    margin: 0;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    transition: background .25s ease, color .25s ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4 {
    font-family: 'Manrope', sans-serif;
    letter-spacing: -0.02em;
  }

  ::selection {
    background: ${({ theme }) => theme.primary};
    color: #fff;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
