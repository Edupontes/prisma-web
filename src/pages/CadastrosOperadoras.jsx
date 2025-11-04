// src/pages/CadastrosOperadoras.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Tab = styled.button`
  border: none;
  background: transparent;
  padding: 0.5rem 1rem;
  border-bottom: 2px solid
    ${({ active, theme }) => (active ? theme.primary : "transparent")};
  color: ${({ active, theme }) => (active ? theme.text : theme.textSecondary)};
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px 8px 0 0;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 4px 12px rgba(255, 123, 0, 0.25);

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.muted};
  color: ${({ theme }) => theme.text};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const Td = styled.td`
  padding: 0.65rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.875rem;
`;

const Empty = styled.p`
  opacity: 0.65;
  font-size: 0.875rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 2000;
`;

const Modal = styled.div`
  width: min(460px, 95vw);
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 0.5rem 0.6rem;
  font-size: 0.875rem;

  &:focus {
    outline: 2px solid rgba(255, 123, 0, 0.35);
    border-color: transparent;
  }
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 0.5rem 0.6rem;
  font-size: 0.875rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Secondary = styled.button`
  border: none;
  background: transparent;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    ${({ $variant, theme }) => {
      switch ($variant) {
        case "danger":
          return `
            background: rgba(255, 0, 0, 0.12);
            color: #e63946;
          `;
        case "warn":
          return `
            background: rgba(255, 123, 0, 0.12);
            color: ${theme.primary};
          `;
        case "neutral":
        default:
          return `
            background: rgba(255, 255, 255, 0.1);
            color: ${theme.text};
          `;
      }
    }}
  }
`;

const Pills = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const Pill = styled.button`
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.primary : theme.border)};
  background: ${({ $active, theme }) =>
    $active ? "rgba(255, 123, 0, 0.12)" : theme.background};
  color: ${({ $active }) => ($active ? "#000" : "inherit")};
  border-radius: 999px;
  padding: 0.25rem 0.7rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: 0.15s ease;
`;
const ActionBtn = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.7rem;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.muted};
  }
`;
const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 500;
  text-transform: capitalize;

  ${({ $status }) => {
    switch ($status) {
      case "active":
        return `
          background: rgba(34, 197, 94, 0.12);
          color: #15803d;
        `;
      case "inactive":
        return `
          background: rgba(148, 163, 184, 0.15);
          color: #475569;
        `;
      case "pending":
        return `
          background: rgba(255, 123, 0, 0.12);
          color: #ff7b00;
        `;
      default:
        return `
          background: rgba(148, 163, 184, 0.12);
          color: #475569;
        `;
    }
  }}
`;

export default function CadastrosOperadoras() {
  const [activeTab, setActiveTab] = useState("operadoras");
  const [operadoras, setOperadoras] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [loadingOp, setLoadingOp] = useState(false);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [showModalOperadora, setShowModalOperadora] = useState(false);
  const [showModalPlano, setShowModalPlano] = useState(false);
  const [selectedOperadora, setSelectedOperadora] = useState("");

  // estados do form de operadora
  const [opNome, setOpNome] = useState("");
  const [opCodigo, setOpCodigo] = useState("");
  const [opCnpj, setOpCnpj] = useState("");
  const [opTipo, setOpTipo] = useState("");

  // estados do form de plano
  const [plNome, setPlNome] = useState("");
  const [plSeg, setPlSeg] = useState("");
  //const [plAcom, setPlAcom] = useState("");
  const [plCob, setPlCob] = useState("");
  const [plOperadora, setPlOperadora] = useState("");

  const SEG_OPCOES = ["empresarial", "adesão", "individual", "familiar"];
  const ACOM_OPCOES = ["enfermaria", "apartamento"];
  const COB_OPCOES = ["municipal", "estadual", "nacional"];

  // controle de edição
  const [editingOperadora, setEditingOperadora] = useState(null);
  const [editingPlano, setEditingPlano] = useState(null);

  const baseUrl = "http://localhost:4000";

  // carregar operadoras ao entrar
  useEffect(() => {
    async function load() {
      setLoadingOp(true);
      try {
        const res = await fetch(`${baseUrl}/cadastros/operators`, {
          credentials: "include",
        });
        const data = await res.json();
        setOperadoras(data);
        // se não tiver nenhuma operadora selecionada, seleciona a primeira
        if (data.length > 0 && !plOperadora) {
          setPlOperadora(data[0].id);
          setSelectedOperadora(data[0].id);
        }
      } catch (err) {
        console.error("erro ao carregar operadoras", err);
      } finally {
        setLoadingOp(false);
      }
    }
    load();
  }, []);

  // carregar planos quando mudar aba pra planos ou quando mudar operadora selecionada
  useEffect(() => {
    async function loadPlans() {
      setLoadingPlanos(true);
      try {
        const url = selectedOperadora
          ? `${baseUrl}/cadastros/plans?operatorId=${selectedOperadora}`
          : `${baseUrl}/cadastros/plans`;
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        setPlanos(data);
      } catch (err) {
        console.error("erro ao carregar planos", err);
      } finally {
        setLoadingPlanos(false);
      }
    }

    if (activeTab === "planos") {
      loadPlans();
    }
  }, [activeTab, selectedOperadora]);

  async function handleCreateOrUpdateOperadora(e) {
    e.preventDefault();

    const body = {
      name: opNome,
      code: opCodigo || undefined,
      cnpj: opCnpj || undefined,
      type: opTipo || undefined,
    };

    // modo edição
    if (editingOperadora) {
      await fetch(`${baseUrl}/cadastros/operators/${editingOperadora.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
    } else {
      // modo criação
      await fetch(`${baseUrl}/cadastros/operators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
    }

    // recarregar lista
    const list = await fetch(`${baseUrl}/cadastros/operators`, {
      credentials: "include",
    }).then((r) => r.json());
    setOperadoras(list);

    // fechar modal e limpar
    setShowModalOperadora(false);
    setEditingOperadora(null);
    setOpNome("");
    setOpCodigo("");
    setOpCnpj("");
    setOpTipo("");
  }

  async function handleCreateOrUpdatePlano(e) {
    e.preventDefault();
    const body = {
      operatorId: plOperadora,
      name: plNome,
      segmentation: plSeg || undefined,
      coverage: plCob || undefined,
    };

    if (editingPlano) {
      // PUT
      await fetch(`${baseUrl}/cadastros/plans/${editingPlano.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
    } else {
      // POST
      await fetch(`${baseUrl}/cadastros/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
    }

    // recarrega lista
    const url = selectedOperadora
      ? `${baseUrl}/cadastros/plans?operatorId=${selectedOperadora}`
      : `${baseUrl}/cadastros/plans`;
    const list = await fetch(url, { credentials: "include" }).then((r) =>
      r.json()
    );
    setPlanos(list);

    // limpar
    setShowModalPlano(false);
    setEditingPlano(null);
    setPlOperadora(operadoras[0]?.id || "");
    setPlNome("");
    setPlSeg("");
    setPlCob("");
  }

  return (
    <Wrap>
      <Header>
        <div>
          <Title>Cadastros</Title>
          <p style={{ margin: 0, opacity: 0.6, fontSize: ".8rem" }}>
            Gerencie operadoras e produtos disponíveis no sistema.
          </p>
        </div>
      </Header>

      <Tabs>
        <Tab
          active={activeTab === "operadoras"}
          onClick={() => setActiveTab("operadoras")}
        >
          Operadoras
        </Tab>
        <Tab
          active={activeTab === "planos"}
          onClick={() => setActiveTab("planos")}
        >
          Planos / Produtos
        </Tab>
      </Tabs>

      {activeTab === "operadoras" && (
        <>
          <Header>
            <h3 style={{ margin: 0, fontSize: "0.95rem" }}>
              Operadoras cadastradas
            </h3>
            <Button type="button" onClick={() => setShowModalOperadora(true)}>
              Nova operadora
            </Button>
          </Header>
          {loadingOp ? (
            <p>Carregando...</p>
          ) : operadoras.length === 0 ? (
            <Empty>Nenhuma operadora cadastrada ainda.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Nome</Th>
                  <Th>Código</Th>
                  <Th>CNPJ</Th>
                  <Th>Status</Th>
                  <Th style={{ width: "1%" }}>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {operadoras.map((op) => (
                  <tr key={op.id}>
                    <Td>{op.name}</Td>
                    <Td>{op.code || "—"}</Td>
                    <Td>{op.cnpj || "—"}</Td>
                    <Td>
                      <StatusPill $status={op.status}>{op.status}</StatusPill>
                    </Td>
                    <Td>
                      <ActionBtn
                        type="button"
                        onClick={() => {
                          setEditingOperadora(op);
                          setOpNome(op.name);
                          setOpCodigo(op.code || "");
                          setOpCnpj(op.cnpj || "");
                          setOpTipo(op.type || "");
                          setShowModalOperadora(true);
                        }}
                      >
                        Editar
                      </ActionBtn>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      {activeTab === "planos" && (
        <>
          <Header>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>
                Planos / Produtos
              </h3>
              <Select
                value={selectedOperadora}
                onChange={(e) => setSelectedOperadora(e.target.value)}
              >
                <option value="">Todas as operadoras</option>
                {operadoras.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="button" onClick={() => setShowModalPlano(true)}>
              Novo plano
            </Button>
          </Header>
          {loadingPlanos ? (
            <p>Carregando...</p>
          ) : planos.length === 0 ? (
            <Empty>Nenhum plano cadastrado ainda.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Plano</Th>
                  <Th>Operadora</Th>
                  <Th>Segmentação</Th>
                  <Th>Status</Th>
                  <Th style={{ width: "1%" }}>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {planos.map((pl) => {
                  const op = operadoras.find((o) => o.id === pl.operatorId);
                  return (
                    <tr key={pl.id}>
                      <Td>{pl.name}</Td>
                      <Td>{op ? op.name : pl.operatorId}</Td>
                      <Td>{pl.segmentation || "—"}</Td>
                      <Td>
                        <StatusPill $status={pl.status}>{pl.status}</StatusPill>
                      </Td>
                      <Td>
                        <ActionBtn
                          type="button"
                          onClick={() => {
                            setEditingPlano(pl);
                            setPlOperadora(pl.operatorId);
                            setPlNome(pl.name);
                            setPlSeg(pl.segmentation || "");
                            setPlCob(pl.coverage || "");
                            setShowModalPlano(true);
                          }}
                        >
                          Editar
                        </ActionBtn>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      )}

      {showModalOperadora && (
        <ModalOverlay>
          <Modal as="form" onSubmit={handleCreateOrUpdateOperadora}>
            <div
              style={{
                width: "44px",
                height: "4px",
                borderRadius: "999px",
                background: "#ff7b00",
              }}
            />
            <h3 style={{ margin: 0 }}>
              {editingOperadora ? "Editar operadora" : "Nova operadora"}
            </h3>
            <Field>
              <Label>Nome</Label>
              <Input
                value={opNome}
                onChange={(e) => setOpNome(e.target.value)}
                required
                autoFocus
              />
            </Field>
            <Field>
              <Label>
                Código interno{" "}
                <span style={{ fontWeight: 400, opacity: 0.6 }}>
                  (opcional)
                </span>
              </Label>
              <Input
                value={opCodigo}
                onChange={(e) => setOpCodigo(e.target.value.toUpperCase())}
                placeholder="Ex.: HAP, BRAD, AMIL"
              />
              <span style={{ fontSize: "0.7rem", opacity: 0.55 }}>
                Use uma sigla curta para relatórios ou integrações.
              </span>
            </Field>
            <Field>
              <Label>CNPJ</Label>
              <Input
                value={opCnpj}
                onChange={(e) => setOpCnpj(e.target.value)}
              />
            </Field>
            <Field>
              <Label>Tipo</Label>
              <Select
                value={opTipo}
                onChange={(e) => setOpTipo(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="saude">Saúde</option>
                <option value="odonto">Odonto</option>
                <option value="ambos">Ambos</option>
              </Select>
            </Field>
            <ModalFooter>
              {editingOperadora && (
                <>
                  <Secondary
                    type="button"
                    $variant="neutral"
                    onClick={async () => {
                      const newStatus =
                        editingOperadora.status === "active"
                          ? "inactive"
                          : "active";
                      await fetch(
                        `${baseUrl}/cadastros/operators/${editingOperadora.id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({
                            name: opNome,
                            code: opCodigo || undefined,
                            cnpj: opCnpj || undefined,
                            type: opTipo || undefined,
                            status: newStatus,
                          }),
                        }
                      );
                      // recarrega
                      const list = await fetch(
                        `${baseUrl}/cadastros/operators`,
                        {
                          credentials: "include",
                        }
                      ).then((r) => r.json());
                      setOperadoras(list);
                      setShowModalOperadora(false);
                      setEditingOperadora(null);
                    }}
                  >
                    {editingOperadora.status === "active"
                      ? "Desativar"
                      : "Ativar"}
                  </Secondary>

                  <Secondary
                    type="button"
                    $variant="danger"
                    onClick={async () => {
                      await fetch(
                        `${baseUrl}/cadastros/operators/${editingOperadora.id}`,
                        {
                          method: "DELETE",
                          credentials: "include",
                        }
                      );
                      const list = await fetch(
                        `${baseUrl}/cadastros/operators`,
                        {
                          credentials: "include",
                        }
                      ).then((r) => r.json());
                      setOperadoras(list);
                      setShowModalOperadora(false);
                      setEditingOperadora(null);
                    }}
                  >
                    Excluir
                  </Secondary>
                </>
              )}

              <Secondary
                type="button"
                $variant="warn"
                onClick={() => {
                  setShowModalOperadora(false);
                  setEditingOperadora(null);
                }}
              >
                Cancelar
              </Secondary>
              <Button type="submit" disabled={!opNome.trim()}>
                {editingOperadora ? "Salvar alterações" : "Salvar"}
              </Button>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}

      {showModalPlano && (
        <ModalOverlay>
          <Modal as="form" onSubmit={handleCreateOrUpdatePlano}>
            <div
              style={{
                width: "44px",
                height: "4px",
                borderRadius: "999px",
                background: "#ff7b00",
              }}
            />
            <h3 style={{ margin: 0 }}>
              {editingPlano ? "Editar plano" : "Novo plano"}
            </h3>
            <Field>
              <Label>Operadora</Label>
              <Select
                value={plOperadora}
                onChange={(e) => setPlOperadora(e.target.value)}
                required
              >
                {operadoras.length === 0 && (
                  <option value="">Nenhuma operadora</option>
                )}
                {operadoras.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Nome do plano</Label>
              <Input
                value={plNome}
                onChange={(e) => setPlNome(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Label>Segmentação</Label>
              <Pills>
                {SEG_OPCOES.map((opt) => (
                  <Pill
                    key={opt}
                    type="button"
                    $active={plSeg === opt}
                    onClick={() => setPlSeg(opt)}
                  >
                    {opt}
                  </Pill>
                ))}
              </Pills>
            </Field>
            <Field>
              <Label>Abrangência / cobertura</Label>
              <Pills>
                {COB_OPCOES.map((opt) => (
                  <Pill
                    key={opt}
                    type="button"
                    $active={plCob === opt}
                    onClick={() => setPlCob(opt)}
                  >
                    {opt}
                  </Pill>
                ))}
              </Pills>
            </Field>
            <ModalFooter>
              {editingPlano && (
                <>
                  {/* Desativar / Ativar */}
                  <Secondary
                    type="button"
                    $variant="neutral"
                    onClick={async () => {
                      const newStatus =
                        editingPlano.status === "active"
                          ? "inactive"
                          : "active";

                      await fetch(
                        `${baseUrl}/cadastros/plans/${editingPlano.id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({
                            operatorId: plOperadora,
                            name: plNome,
                            segmentation: plSeg || undefined,
                            coverage: plCob || undefined,
                            status: newStatus,
                          }),
                        }
                      );

                      // recarrega lista de planos
                      const url = selectedOperadora
                        ? `${baseUrl}/cadastros/plans?operatorId=${selectedOperadora}`
                        : `${baseUrl}/cadastros/plans`;
                      const list = await fetch(url, {
                        credentials: "include",
                      }).then((r) => r.json());
                      setPlanos(list);

                      // fecha modal
                      setShowModalPlano(false);
                      setEditingPlano(null);
                    }}
                  >
                    {editingPlano.status === "active" ? "Desativar" : "Ativar"}
                  </Secondary>

                  {/* Excluir */}
                  <Secondary
                    type="button"
                    $variant="danger"
                    onClick={async () => {
                      await fetch(
                        `${baseUrl}/cadastros/plans/${editingPlano.id}`,
                        {
                          method: "DELETE",
                          credentials: "include",
                        }
                      );

                      // recarrega lista
                      const url = selectedOperadora
                        ? `${baseUrl}/cadastros/plans?operatorId=${selectedOperadora}`
                        : `${baseUrl}/cadastros/plans`;
                      const list = await fetch(url, {
                        credentials: "include",
                      }).then((r) => r.json());
                      setPlanos(list);

                      // fecha modal
                      setShowModalPlano(false);
                      setEditingPlano(null);
                    }}
                  >
                    Excluir
                  </Secondary>
                </>
              )}

              <Secondary
                type="button"
                $variant="warn"
                onClick={() => {
                  setShowModalPlano(false);
                  setEditingPlano(null);
                }}
              >
                Cancelar
              </Secondary>
              <Button type="submit" disabled={!plNome.trim() || !plOperadora}>
                {editingPlano ? "Salvar alterações" : "Salvar"}
              </Button>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Wrap>
  );
}
