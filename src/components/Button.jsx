import styled from "styled-components";

/**
 * Componente de botão padrão do Design System Prisma
 * - usa as cores do tema ativo (light/dark)
 * - possui 3 estados: normal, hover e ativo
 * - usa tipografia Inter (definida no GlobalStyle)
 */

const Button = styled.button`
  background: ${({ theme }) => theme.primary}; /*cor principal*/
  color: #fff; /*Texto Branco*/
  border: none; /*Remove borda padrão*/
  border-radius: 12px; /*Canto arredondado padrão*/
  padding: 0.875rem 1rem; /* Tamanho confortável */
  font-weight: 600; /* Destaque no texto */
  letter-spacing: 0.03em; /* Leve espaçamento entre letras */
  text-transform: uppercase; /* Texto em maiúsculas */
  transition: background 0.16s ease, transform 0.04s ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
  &:active {
    background: ${({ theme }) =>
      theme.primaryActive}; /* Cor mais escura quando clicado */
    transform: translateY(1px); /* Efeito “pressionado” */
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
export default Button;
