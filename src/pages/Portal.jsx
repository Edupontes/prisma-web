import styled from "styled-components";
import { useEffect, useState } from "react";

const Box = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 1.5rem;
`;

export default function Portal() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("http://localhost:4000/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setMe(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadMe();
  }, []);

  return (
    <Box>
      <h2 style={{ marginTop: 0 }}>Portal</h2>
      {me ? (
        <p>
          Bem-vindo, <strong>{me.user.username}</strong> — empresa:{" "}
          <strong>{me.tenant.name}</strong>
        </p>
      ) : (
        <p>Carregando dados…</p>
      )}
      <p style={{ opacity: 0.7 }}>
        Esta é a sua “tela de cinema”. Depois vamos renderizar aqui os módulos,
        listagens, cadastros etc.
      </p>
    </Box>
  );
}
