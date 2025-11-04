// src/routes/router.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import PortalLayout from "@/layout/PortalLayout";
import Placeholder from "@/pages/Placeholder";
import CadastrosOperadoras from "@/pages/CadastrosOperadoras";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/portal",
    element: (
      <ProtectedRoute>
        <PortalLayout />
      </ProtectedRoute>
    ),
    children: [
      // dashboard inicial
      {
        index: true,
        element: <Placeholder title="Dashboard do Portal" />,
      },

      // PROPOSTAS
      {
        path: "propostas",
        element: <Placeholder title="Listar Propostas" />,
      },
      {
        path: "propostas/nova",
        element: <Placeholder title="Cadastrar Proposta" />,
      },

      // COMERCIAL
      {
        path: "comercial/corretores",
        element: <Placeholder title="Corretores" />,
      },
      {
        path: "comercial/corretores/novo",
        element: <Placeholder title="Cadastrar Corretor" />,
      },
      {
        path: "comercial/escritorios",
        element: <Placeholder title="Escritórios" />,
      },
      {
        path: "comercial/escritorios/novo",
        element: <Placeholder title="Cadastrar Escritório" />,
      },

      // FINANÇAS
      {
        path: "financas",
        element: <Placeholder title="Dashboard Financeiro" />,
      },
      {
        path: "financas/comissoes/gerar",
        element: <Placeholder title="Gerar Comissão" />,
      },
      {
        path: "financas/comissoes/baixa",
        element: <Placeholder title="Baixar Comissão" />,
      },
      {
        path: "financas/boletos",
        element: <Placeholder title="Listar Boletos" />,
      },
      {
        path: "financas/boletos/emitir",
        element: <Placeholder title="Emitir Boleto" />,
      },

      // CADASTROS
      {
        path: "cadastros/operadoras",
        element: <CadastrosOperadoras />,
      },
      {
        path: "cadastros/tabelas-preco",
        element: <Placeholder title="Tabelas de Preço" />,
      },

      // CONFIGURAÇÕES
      {
        path: "config/comissoes",
        element: <Placeholder title="Regras de Comissão" />,
      },
      {
        path: "config/usuarios",
        element: <Placeholder title="Usuários & Licenças" />,
      },
      {
        path: "config/integracoes",
        element: <Placeholder title="Integrações" />,
      },

      // ROTA UNIVERSAL (reservada)
      {
        path: "id=:recordId",
        element: <Placeholder title="Resolver registro por ID (universal)" />,
      },
    ],
  },
]);

export default router;
