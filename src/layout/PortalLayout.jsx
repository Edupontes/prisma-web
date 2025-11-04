// src/layout/PortalLayout.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "@/components/Sidebar";

const Shell = styled.div`
  min-height: 100dvh;
  background: ${({ theme }) => theme.background};
  display: flex;
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Topbar = styled.header`
  height: 56px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  gap: 1rem;

  /* se estiver no dark, dá pra suavizar */
  @media (prefers-color-scheme: dark) {
    background: rgba(10, 12, 18, 0.5);
    backdrop-filter: blur(12px);
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
`;

const PortalName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const TenantName = styled.span`
  font-size: 0.7rem;
  opacity: 0.7;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.03);
  padding: 0.35rem 0.6rem;
  border-radius: 999px;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.03);
  }
`;

const Avatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ff7b00 0%, #ffb347 100%);
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
`;

const UserName = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
`;

const UserRole = styled.span`
  font-size: 0.6rem;
  opacity: 0.6;
`;

const LogoutBtn = styled.button`
  border: none;
  background: #ff7b00;
  color: #fff;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 4px 12px rgba(255, 123, 0, 0.25);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(255, 123, 0, 0.35);
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 1.5rem;
  min-width: 0;
`;

export default function PortalLayout({ children }) {
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
        console.error("erro ao carregar /auth/me no layout", err);
      }
    }
    loadMe();
  }, []);

  async function handleLogout() {
    try {
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/login";
    } catch (err) {
      console.error("erro ao sair", err);
    }
  }

  const userInitial = me?.user?.username
    ? me.user.username.charAt(0).toUpperCase()
    : "P";

  return (
    <Shell>
      <Sidebar me={me} />
      <MainArea>
        <Topbar>
          <Left>
            <PortalName>
              Portal{" "}
              {me?.tenant?.name ? me.tenant.name : "Carregando empresa..."}
            </PortalName>
          </Left>
          <Right>
            {me ? (
              <UserChip>
                <Avatar>{userInitial}</Avatar>
                <UserInfo>
                  <UserName>{me.user.username}</UserName>
                </UserInfo>
              </UserChip>
            ) : (
              <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                carregando...
              </span>
            )}
            <LogoutBtn onClick={handleLogout}>Sair</LogoutBtn>
          </Right>
        </Topbar>
        <Main>{children}</Main>
      </MainArea>
    </Shell>
  );
}
