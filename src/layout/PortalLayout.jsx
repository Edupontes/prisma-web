import styled from "styled-components";

const Shell = styled.div`
  min-height: 100dvh;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
`;

const Topbar = styled.header`
  height: 56px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
`;

const Brand = styled.div`
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const Main = styled.main`
  flex: 1;
  padding: 1.5rem;
  display: grid;
`;

const Right = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export default function PortalLayout({ children }) {
  async function handleLogout() {
    try {
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      // redireciono pelo próprio navegador por enquanto
      window.location.href = "/login";
    } catch (err) {
      console.error("erro ao sair", err);
    }
  }

  return (
    <Shell>
      <Topbar>
        <Brand>Prisma Portal</Brand>
        <Right>
          <button
            onClick={handleLogout}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Sair
          </button>
        </Right>
      </Topbar>
      <Main>{children}</Main>
    </Shell>
  );
}
