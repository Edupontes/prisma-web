import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Portal from "@/pages/Portal";
import ProtectedRoute from "./ProtectedRoute";
import PortalLayout from "@/layout/PortalLayout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    // rota protegida
    path: "/portal",
    element: (
      <ProtectedRoute>
        <PortalLayout>
          <Portal />
        </PortalLayout>
      </ProtectedRoute>
    ),
  },
  {
    // fallback: se for pra raiz, manda pro login
    path: "/",
    element: <Login />,
  },
]);

export default router;
