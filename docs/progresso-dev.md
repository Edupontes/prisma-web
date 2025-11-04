🧭 Projeto Prisma Web — Documento de Progresso Técnico (v1.0)

Status: Etapa 4 concluída — Autenticação completa e Portal funcional
Último commit: feat(auth+routes): integração completa front-back com login, portal protegido e logout funcional

⚙️ Stack de Desenvolvimento
🧩 Front-end

Framework: React + Vite

Linguagem: JavaScript (ESM)

Estilização: Styled Components

Roteamento: React Router DOM

Tema: ThemeProvider + GlobalStyle (modo light/dark planejado)

Ícones / Animações (planejado): Lucide React + Framer Motion

Pasta base: src/

🧱 Back-end

Servidor: Fastify

Banco: SQLite (arquivo local data.db)

ORM: Drizzle ORM

Autenticação: Cookies HttpOnly + Argon2

Seed automático: Cria 2 empresas e 1 admin por empresa

Pasta base: server/

📁 Estrutura de Pastas Atual
prisma-web/
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── Button.jsx
│ │ └── Input.jsx
│ ├── layout/
│ │ └── PortalLayout.jsx
│ ├── pages/
│ │ ├── Login.jsx
│ │ └── Portal.jsx
│ ├── routes/
│ │ ├── router.jsx
│ │ └── ProtectedRoute.jsx
│ ├── styles/
│ │ ├── global.js
│ │ └── theme.js
│ └── App.jsx
│
├── server/
│ ├── src/
│ │ ├── db/
│ │ │ ├── schema.js
│ │ │ └── index.js
│ │ ├── routes/
│ │ │ └── auth.js
│ │ ├── env.js
│ │ └── server.js
│ ├── .env
│ └── package.json
│
└── docs/
└── progresso-dev.md

🧩 Funcionalidades Implementadas
🔐 Autenticação Completa (Back-end)

/auth/login

Recebe { username, password, remember }

Valida usuário e senha via Argon2

Cria cookie de sessão HttpOnly

Suporte multi-empresa automático (sem o usuário precisar informar)

Seed inicial:

Empresa 1 → Pontes Corporations (admin / admin1234)

Empresa 2 → ACME Ltda (acmeadmin / admin1234)

/auth/me

Retorna { user, tenant } se sessão válida

/auth/logout

Remove sessão e apaga cookie

🌐 Integração Front-end

Tela de Login funcional → conecta ao backend

Cookies e CORS configurados (permitindo 5173 e 5174)

Redirect pós-login → /portal

Logout → limpa cookie e volta ao login

/portal protegido por rota (ProtectedRoute)

Layout simples do Portal (PortalLayout) com Header e botão “Sair”

Exibição do usuário e empresa na “tela de cinema” (Portal.jsx)

🔒 Segurança

Sessão armazenada em cookie HttpOnly (não acessível via JS)

CORS configurado para origins específicos (5173 e 5174)

Senhas protegidas com hash Argon2

Validação Zod em todos os endpoints

Rate limit planejado (etapa futura)

🧠 Próximas Etapas
🎨 Etapa 5 — Portal Visual (“Tela de Cinema”)

Implementar layout final do Portal:

Menu lateral colapsável (Lucide Icons)

Header com usuário, empresa e botão de tema

Conteúdo central dinâmico (Outlet)

Adicionar páginas internas de exemplo:

/portal/home (dashboard inicial)

/portal/usuarios

/portal/empresas

Ativar alternância de tema (light/dark)

Aplicar framer-motion para transições suaves

🧾 Boas Práticas de Manutenção

Commits descritivos (feat:, fix:, refactor:, docs:)

Sempre rodar o servidor e o front em paralelo (npm run dev em cada pasta)

Se mudar a porta do Vite, atualizar FRONT_ORIGINS no backend

Nunca alterar diretamente o data.db — apagar e reiniciar o seed se necessário

Documentar novas dependências aqui antes de commitar

Executar npm audit e npm outdated periodicamente

🧩 Versões de Referência
Componente Versão Atual
Node.js 24.11.0 LTS
npm 11.6.2
Fastify ^5.0.0
Drizzle ORM ^0.29.x
SQLite embutido
React ^18.x
Styled Components ^6.x
React Router DOM ^6.25.x
Argon2 ^0.31.x
Zod ^3.x
lucide-react (planejado)
framer-motion (planejado)
🧱 Próximos Commits Planejados
Etapa Descrição Commit sugerido
5.0 Implementar layout visual do Portal feat(portal): estrutura visual com menu lateral e header
5.1 Adicionar páginas internas e navegação feat(portal): rotas internas home/usuarios/empresas
5.2 Tema light/dark e animações feat(theme): alternância de tema e transições framer-motion

✍️ Autor: Eduardo Pontes
👨‍💻 Arquiteto Técnico: GPT-5 (ChatGPT, assistente de projeto)
📆 Última atualização: (coloque a data do dia que fizer o commit)
