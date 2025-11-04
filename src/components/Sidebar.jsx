// src/components/Sidebar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FileText,
  Users,
  DollarSign,
  Wallet,
  BarChart2,
  Settings,
  UserCog,
  Building2,
  CreditCard,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Menu,
  Link as LinkIcon,
} from "lucide-react";
import logo from "@/assets/logo-prisma.jpg";

const Aside = styled(motion.aside)`
  width: ${({ $collapsed }) => ($collapsed ? "72px" : "240px")};
  background: linear-gradient(180deg, #0d1736 0%, #1b2552 100%);
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
`;

const Top = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow: visible;
`;

const Logo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  display: ${({ $collapsed }) => ($collapsed ? "none" : "flex")};
`;

const Title = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.03em;
`;

const CollapseBtn = styled.button`
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease; /* 👈 suaviza o efeito */

  &:hover {
    transform: scale(1.1); /* 👈 dá leve zoom ao passar o mouse */
    color: #ff7b00; /* 👈 laranja Prisma */
  }
`;

const Nav = styled.nav`
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const GroupLabel = styled.div`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.5);
  padding: 0.75rem 0.75rem 0.25rem;
  display: ${({ $hidden }) => ($hidden ? "none" : "block")};
`;

const Item = styled(motion.button)`
  width: 100%;
  border: none;
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.08)" : "transparent"};
  color: #fff;
  text-align: left;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  font-size: 0.88rem;
  position: relative;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  ${({ $active }) =>
    $active &&
    `
    box-shadow: inset 3px 0 0 #ff7b00;
  `}
`;

const Label = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${({ $hidden }) => ($hidden ? "none" : "inline")};
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 0.75rem 1rem 1rem;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.04em;
`;

export default function Sidebar({ me }) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();
  const tenantLabel = me?.tenant?.name || me?.tenant?.slug || "Prisma Web";

  // mapa: chave do botão → rota real
  const routeMap = {
    dashboard: "/portal",
    propostas: "/portal/propostas",
    comercial: "/portal/comercial/corretores", // pode cair na de corretores por padrão
    "fin-dashboard": "/portal/financas",
    "fin-comissao": "/portal/financas/comissoes/gerar",
    "fin-baixa": "/portal/financas/comissoes/baixa",
    "fin-boleto": "/portal/financas/boletos/emitir",
    "fin-lista-boleto": "/portal/financas/boletos",
    "cad-operadoras": "/portal/cadastros/operadoras",
    "cad-tabela": "/portal/cadastros/tabelas-preco",
    "cfg-comissao": "/portal/config/comissoes",
    "cfg-usuarios": "/portal/config/usuarios",
    "cfg-integracoes": "/portal/config/integracoes",
  };

  function handleSelect(key) {
    setActive(key);
    const to = routeMap[key];
    if (to) {
      navigate(to);
    }
  }

  const groups = [
    {
      label: "Visão",
      items: [
        {
          key: "dashboard",
          icon: <LayoutDashboard size={18} />,
          label: "Dashboard",
        },
      ],
    },
    {
      label: "Operacional",
      items: [
        { key: "propostas", icon: <FileText size={18} />, label: "Propostas" },
        { key: "comercial", icon: <Users size={18} />, label: "Comercial" },
      ],
    },
    {
      label: "Financeiro",
      items: [
        {
          key: "fin-dashboard",
          icon: <BarChart2 size={18} />,
          label: "Dashboard financeiro",
        },
        {
          key: "fin-comissao",
          icon: <DollarSign size={18} />,
          label: "Gerar comissão",
        },
        {
          key: "fin-baixa",
          icon: <Wallet size={18} />,
          label: "Baixar comissão",
        },
        {
          key: "fin-boleto",
          icon: <CreditCard size={18} />,
          label: "Emitir boleto",
        },
        {
          key: "fin-lista-boleto",
          icon: <FileText size={18} />,
          label: "Listar boletos",
        },
      ],
    },
    {
      label: "Cadastros",
      items: [
        {
          key: "cad-operadoras",
          icon: <Building2 size={18} />,
          label: "Operadoras / Produtos",
        },
        {
          key: "cad-tabela",
          icon: <BarChart2 size={18} />,
          label: "Tabela de preço",
        },
      ],
    },
    {
      label: "Configuração",
      items: [
        {
          key: "cfg-comissao",
          icon: <DollarSign size={18} />,
          label: "Regras de comissão",
        },
        {
          key: "cfg-usuarios",
          icon: <UserCog size={18} />,
          label: "Usuários & Licenças",
        },
        {
          key: "cfg-integracoes",
          icon: <LinkIcon size={18} />,
          label: "Integrações",
        },
      ],
    },
  ];

  return (
    <Aside
      $collapsed={collapsed}
      initial={{ width: collapsed ? 72 : 240 }}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25 }}
    >
      <Top>
        <Logo src={logo} alt={tenantLabel} $collapsed={collapsed} />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <Title>{tenantLabel}</Title>
            </motion.div>
          )}
        </AnimatePresence>
        <CollapseBtn onClick={() => setCollapsed((s) => !s)}>
          {collapsed ? (
            <Menu size={20} color="#ff7b00" />
          ) : (
            <ChevronLeft size={18} />
          )}
        </CollapseBtn>
      </Top>

      <Nav>
        {groups.map((group) => (
          <div key={group.label}>
            <GroupLabel $hidden={collapsed}>{group.label}</GroupLabel>
            {group.items.map((item) => (
              <Item
                key={item.key}
                $active={active === item.key}
                onClick={() => handleSelect(item.key)}
                whileTap={{ scale: 0.97 }}
              >
                {item.icon}
                <Label $hidden={collapsed}>{item.label}</Label>
              </Item>
            ))}
          </div>
        ))}
      </Nav>
      <Footer>{collapsed ? "V1.0.0" : "Prisma Web • V1.0.0"}</Footer>
    </Aside>
  );
}
