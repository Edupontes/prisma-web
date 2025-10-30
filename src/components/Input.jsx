// src/components/Input.jsx
import styled from "styled-components";
import { useState, useMemo } from "react";

/* ==== Estilos base (padrão Prisma) ==== */

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  opacity: 0.95;
`;

const InputBase = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 0.875rem 0.95rem;
  outline: none;
  transition: border-color 0.16s ease, box-shadow 0.16s ease,
    background 0.25s ease;

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.7;
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }

  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.error};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.error}33;
  }
`;

export const HelpText = styled.small`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.8125rem;
`;

export const ErrorText = styled.small`
  color: ${({ theme }) => theme.error};
  font-size: 0.8125rem;
`;

/* ==== Componente com validação leve ==== */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Input({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  pattern, // regex string opcional
  help, // texto auxiliar (ex.: "Use seu e-mail corporativo")
  validate, // função opcional: (value) => string | null (mensagem de erro)
  ...rest
}) {
  const [touched, setTouched] = useState(false);

  const error = useMemo(() => {
    const v = (value ?? "").toString();

    if (required && v.trim() === "") return "Campo obrigatório.";
    if (minLength && v.length > 0 && v.length < minLength) {
      return `Mínimo de ${minLength} caracteres.`;
    }
    if (type === "email" && v.length > 0 && !EMAIL_RE.test(v)) {
      return "Informe um e-mail válido.";
    }
    if (pattern && v.length > 0) {
      try {
        const re = new RegExp(pattern);
        if (!re.test(v)) return "Formato inválido.";
      } catch {
        // pattern inválido: ignora (não quebra o input)
      }
    }
    if (typeof validate === "function") {
      const custom = validate(v);
      if (typeof custom === "string" && custom.length) return custom;
    }
    return null;
  }, [value, required, minLength, type, pattern, validate]);

  const showError = touched && !!error;

  return (
    <Field>
      {label && <Label htmlFor={id}>{label}</Label>}

      <InputBase
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        aria-invalid={showError}
        {...rest}
      />

      {showError ? (
        <ErrorText role="alert">{error}</ErrorText>
      ) : help ? (
        <HelpText>{help}</HelpText>
      ) : null}
    </Field>
  );
}
