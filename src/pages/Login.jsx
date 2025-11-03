// src/pages/Login.jsx
import styled from "styled-components";
import { useState } from "react";
import Button from "@/components/Button"; // se não tiver path alias, use "./../components/Button"
import Input from "@/components/Input";
import logo from "@/assets/logo-prisma.jpg";

const Wrap = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: ${({ theme }) => theme.background};
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;

  img {
    width: 64px;
    height: 64px;
    border-radius: 12px;
  }
  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.primary};
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MutedLink = styled.a`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-size: 0.875rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  accent-color: ${({ theme }) => theme.primary};
`;

const PasswordWrap = styled.div`
  position: relative;
  display: grid;
`;

const TogglePwd = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  font-size: 0.875rem;
`;
const Footer = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.textSecondary};
  opacity: 0.8;
`;
const FieldLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export default function Login() {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  //const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const userOk = user.trim().length >= 4;
  const pwdOk = pwd.length >= 8;
  const formValid = userOk && pwdOk;

  return (
    <Wrap>
      <div>
        <Card
          as="form"
          aria-labelledby="login-title"
          onSubmit={(e) => {
            e.preventDefault();
            if (formValid) {
              //todo chamar API fe autenticação no futuro
              //ex: await api.post('/auth/login', {user,pwd, remember})
            }
          }}
        >
          <Header>
            <img src={logo} alt="Prisma" />
            <h1 id="login-title">Entrar</h1>
            <p>Acesse sua conta para continuar</p>
          </Header>

          <Input
            id="username"
            label="Usuário"
            type="text"
            placeholder="Digite seu usuário"
            required
            minLength={4}
            value={user}
            onChange={(e) => setUser(e.target.value)}
            help="Use seu nome de usuário cadastrado."
          />

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: ".5rem",
                fontWeight: 500,
              }}
            >
              Senha
            </label>
            <PasswordWrap>
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={8}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                help="Mínimo de 8 caracteres."
              />
              <TogglePwd
                type="button"
                aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? "Ocultar" : "Mostrar"}
              </TogglePwd>
            </PasswordWrap>
          </div>

          <Row>
            <FieldLabel htmlFor="password">
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Lembrar-me
            </FieldLabel>
            <MutedLink href="#">Esqueci a senha</MutedLink>
          </Row>

          <Button type="submit" disabled={!formValid}>
            Entrar
          </Button>

          <p
            style={{
              textAlign: "center",
              margin: 0,
              color: "inherit",
              opacity: 0.85,
              fontSize: ".8125rem",
            }}
          >
            Ao entrar, você concorda com os Termos e a Política de Privacidade.
          </p>
        </Card>
        <Footer>
          © {new Date().getFullYear()} Pontes Corporations. Todos os direitos
          reservados.
        </Footer>
      </div>
    </Wrap>
  );
}
