import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

/* ... (todos os styled que você já colocou: Header, Title, Sub, Filters, Select, Button, Table, Th, Td, StatusPill, ActionBtn, Modal..., etc) ... */
/* vou reaproveitar os seus e só focar na lógica */

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
const Sub = styled.p`
  margin: 0;
  opacity: 0.65;
  font-size: 0.8rem;
`;
const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;
const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  border-radius: 10px;
  padding: 0.45rem 0.6rem;
  font-size: 0.8rem;
  min-width: 180px;
  &:focus {
    outline: 2px solid rgba(255, 123, 0, 0.3);
    border-color: transparent;
  }
`;
const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 123, 0, 0.25);
  transition: 0.15s ease;
  &:hover {
    transform: translateY(-1px);
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
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
const Td = styled.td`
  padding: 0.6rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.8rem;
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
      default:
        return `
          background: rgba(148, 163, 184, 0.12);
          color: #475569;
        `;
    }
  }}
`;
const ActionBtn = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.68rem;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.muted};
  }
`;
const Empty = styled.p`
  opacity: 0.6;
  font-size: 0.8rem;
  padding: 1rem;
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
  width: min(840px, 96vw);
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 1.25rem 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
`;
const ModalTitle = styled.h3`
  margin: 0.25rem 0 0;
`;
const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.25rem;
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
const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  min-width: 150px;
`;
const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 500;
`;
const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 0.45rem 0.5rem;
  font-size: 0.8rem;
  &:focus {
    outline: 2px solid rgba(255, 123, 0, 0.3);
    border-color: transparent;
  }
`;

const FaixasTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
`;
const FaixasTh = styled.th`
  text-align: left;
  font-size: 0.7rem;
  text-transform: uppercase;
  padding: 0.45rem 0.5rem;
  background: ${({ theme }) => theme.muted};
`;
const FaixasTd = styled.td`
  padding: 0.35rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.78rem;
`;
const PriceInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 0.35rem 0.4rem;
  font-size: 0.75rem;
  text-align: right;
`;
function formatDate(value) {
  if (!value) return "—";
  // value pode ser número (ms) ou string ISO
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

export default function CadastrosTabelasPreco() {
  const baseUrl = "http://localhost:4000";

  // dados vindos do backend
  const [operadoras, setOperadoras] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [tabelas, setTabelas] = useState([]);

  // filtros
  const [fOperadora, setFOperadora] = useState("");
  const [fPlano, setFPlano] = useState("");
  const [fStatus, setFStatus] = useState("all");

  // modal
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  // form do modal
  const [mOperadora, setMOperadora] = useState("");
  const [mPlano, setMPlano] = useState("");
  const [mVigencia, setMVigencia] = useState("");

  // faixas
  const [faixas, setFaixas] = useState([
    { faixa: "00-18", enf: "", apt: "" },
    { faixa: "19-23", enf: "", apt: "" },
    { faixa: "24-28", enf: "", apt: "" },
    { faixa: "29-33", enf: "", apt: "" },
    { faixa: "34-38", enf: "", apt: "" },
    { faixa: "39-43", enf: "", apt: "" },
    { faixa: "44-48", enf: "", apt: "" },
    { faixa: "49-53", enf: "", apt: "" },
    { faixa: "54-58", enf: "", apt: "" },
    { faixa: "59+", enf: "", apt: "" },
  ]);

  // carregar operadoras ao entrar
  useEffect(() => {
    async function loadOps() {
      const res = await fetch(`${baseUrl}/cadastros/operators`, {
        credentials: "include",
      });
      const data = await res.json();
      setOperadoras(data);
    }
    loadOps();
  }, []);

  // carregar planos quando selecionar operadora (filtro)
  useEffect(() => {
    async function loadPlans() {
      const url = fOperadora
        ? `${baseUrl}/cadastros/plans?operatorId=${fOperadora}`
        : `${baseUrl}/cadastros/plans`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setPlanos(data);
    }
    // só busca quando estiver na tela
    loadPlans();
  }, [fOperadora]);

  // carregar tabelas (lista) conforme filtros
  useEffect(() => {
    async function loadTables() {
      let url = `${baseUrl}/cadastros/price-tables`;
      const params = [];
      if (fOperadora) params.push(`operatorId=${fOperadora}`);
      if (fPlano) params.push(`planId=${fPlano}`);
      if (fStatus !== "all") params.push(`status=${fStatus}`);
      if (params.length) url = `${url}?${params.join("&")}`;

      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setTabelas(data);
    }
    loadTables();
  }, [fOperadora, fPlano, fStatus]);

  function resetModal() {
    setEditingTable(null);
    setMOperadora("");
    setMPlano("");
    setMVigencia("");
    setFaixas([
      { faixa: "00-18", enf: "", apt: "" },
      { faixa: "19-23", enf: "", apt: "" },
      { faixa: "24-28", enf: "", apt: "" },
      { faixa: "29-33", enf: "", apt: "" },
      { faixa: "34-38", enf: "", apt: "" },
      { faixa: "39-43", enf: "", apt: "" },
      { faixa: "44-48", enf: "", apt: "" },
      { faixa: "49-53", enf: "", apt: "" },
      { faixa: "54-58", enf: "", apt: "" },
      { faixa: "59+", enf: "", apt: "" },
    ]);
  }

  function handleOpenModalCreate() {
    resetModal();
    setShowModal(true);
  }

  async function handleOpenModalEdit(table) {
    // 1) abre modal
    setShowModal(true);
    setEditingTable(table);

    // 2) preenche cabeçalho
    setMOperadora(table.operatorId);
    setMPlano(table.planId);
    setMVigencia(
      table.startsAt ? new Date(table.startsAt).toISOString().slice(0, 10) : ""
    );

    // 3) busca faixas dessa tabela
    const res = await fetch(
      `${baseUrl}/cadastros/price-tables/${table.id}/items`,
      {
        credentials: "include",
      }
    );
    const items = await res.json();

    // montar faixas na mesma ordem do front
    const baseFaixas = [
      "00-18",
      "19-23",
      "24-28",
      "29-33",
      "34-38",
      "39-43",
      "44-48",
      "49-53",
      "54-58",
      "59+",
    ];

    const mapped = baseFaixas.map((fx) => {
      const found = items.find((it) => it.ageRange === fx);
      return {
        faixa: fx,
        enf: found?.amountEnf ?? "",
        apt: found?.amountApt ?? "",
      };
    });

    setFaixas(mapped);
  }

  function handleCloseModal() {
    setShowModal(false);
    resetModal();
  }

  function handleFaixaChange(index, field, value) {
    setFaixas((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], [field]: value };
      return clone;
    });
  }

  async function handleSaveTable() {
    // monta payload
    const payload = {
      operatorId: mOperadora,
      planId: mPlano,
      effectiveDate: mVigencia,
      items: faixas.map((f) => ({
        ageRange: f.faixa,
        amountEnf: f.enf ? Number(f.enf) : null,
        amountApt: f.apt ? Number(f.apt) : null,
      })),
    };

    if (editingTable) {
      // update
      await fetch(`${baseUrl}/cadastros/price-tables/${editingTable.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    } else {
      // create
      await fetch(`${baseUrl}/cadastros/price-tables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    }

    // recarrega lista
    let url = `${baseUrl}/cadastros/price-tables`;
    const params = [];
    if (fOperadora) params.push(`operatorId=${fOperadora}`);
    if (fPlano) params.push(`planId=${fPlano}`);
    if (fStatus !== "all") params.push(`status=${fStatus}`);
    if (params.length) url = `${url}?${params.join("&")}`;

    const resList = await fetch(url, { credentials: "include" });
    const dataList = await resList.json();
    setTabelas(dataList);

    handleCloseModal();
  }

  return (
    <Wrap>
      <Header>
        <div>
          <Title>Tabelas de preço</Title>
          <Sub>Defina os valores por faixa etária, acomodação e vigência.</Sub>
        </div>
        <Button type="button" onClick={handleOpenModalCreate}>
          Nova tabela de preço
        </Button>
      </Header>

      <Filters>
        <Select
          value={fOperadora}
          onChange={(e) => setFOperadora(e.target.value)}
        >
          <option value="">Todas as operadoras</option>
          {operadoras.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </Select>
        <Select value={fPlano} onChange={(e) => setFPlano(e.target.value)}>
          <option value="">Todos os planos</option>
          {planos.map((pl) => (
            <option key={pl.id} value={pl.id}>
              {pl.name}
            </option>
          ))}
        </Select>
        <Select value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </Select>
      </Filters>

      {tabelas.length === 0 ? (
        <Empty>Nenhuma tabela de preço cadastrada ainda.</Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Operadora</Th>
              <Th>Plano</Th>
              <Th>Vigência</Th>
              <Th>Status</Th>
              <Th style={{ width: "1%" }}>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {tabelas.map((tb) => (
              <tr key={tb.id}>
                <Td>
                  {operadoras.find((op) => op.id === tb.operatorId)?.name ??
                    tb.operatorId}
                </Td>
                <Td>
                  {planos.find((pl) => pl.id === tb.planId)?.name ?? tb.planId}
                </Td>
                <Td>{formatDate(tb.startsAt)}</Td>
                <Td>
                  <StatusPill $status={tb.status ?? "active"}>
                    {tb.status ?? "active"}
                  </StatusPill>
                </Td>
                <Td>
                  <ActionBtn
                    type="button"
                    onClick={() => handleOpenModalEdit(tb)}
                  >
                    Editar
                  </ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {showModal && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <div>
                <div
                  style={{
                    width: "44px",
                    height: "4px",
                    borderRadius: "999px",
                    background: "#ff7b00",
                    marginBottom: ".5rem",
                  }}
                />
                <ModalTitle>
                  {editingTable
                    ? "Editar tabela de preço"
                    : "Nova tabela de preço"}
                </ModalTitle>
                <Sub style={{ marginTop: ".25rem" }}>
                  Preencha os dados gerais e os valores por faixa.
                </Sub>
              </div>
              <Secondary onClick={handleCloseModal}>Fechar</Secondary>
            </ModalHeader>

            <FormRow>
              <Field>
                <Label>Operadora</Label>
                <Select
                  value={mOperadora}
                  onChange={(e) => setMOperadora(e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  {operadoras.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Plano</Label>
                <Select
                  value={mPlano}
                  onChange={(e) => setMPlano(e.target.value)}
                  required
                  disabled={!mOperadora}
                >
                  <option value="">Selecione</option>
                  {planos
                    .filter((pl) =>
                      mOperadora ? pl.operatorId === mOperadora : true
                    )
                    .map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name}
                      </option>
                    ))}
                </Select>
              </Field>
              <Field>
                <Label>Vigência inicial</Label>
                <Input
                  type="date"
                  value={mVigencia}
                  onChange={(e) => setMVigencia(e.target.value)}
                  required
                />
              </Field>
            </FormRow>

            <div>
              <p style={{ fontSize: ".75rem", opacity: 0.6, marginBottom: 6 }}>
                Valores por faixa etária
              </p>
              <FaixasTable>
                <thead>
                  <tr>
                    <FaixasTh>Faixa</FaixasTh>
                    <FaixasTh>Enfermaria (R$)</FaixasTh>
                    <FaixasTh>Apartamento (R$)</FaixasTh>
                  </tr>
                </thead>
                <tbody>
                  {faixas.map((fx, idx) => (
                    <tr key={fx.faixa}>
                      <FaixasTd>{fx.faixa}</FaixasTd>
                      <FaixasTd>
                        <PriceInput
                          type="number"
                          min="0"
                          step="0.01"
                          value={fx.enf}
                          onChange={(e) =>
                            handleFaixaChange(idx, "enf", e.target.value)
                          }
                        />
                      </FaixasTd>
                      <FaixasTd>
                        <PriceInput
                          type="number"
                          min="0"
                          step="0.01"
                          value={fx.apt}
                          onChange={(e) =>
                            handleFaixaChange(idx, "apt", e.target.value)
                          }
                        />
                      </FaixasTd>
                    </tr>
                  ))}
                </tbody>
              </FaixasTable>
            </div>

            <ModalFooter>
              {editingTable &&
                (() => {
                  // normaliza: se vier undefined, tratamos como active
                  const currentStatus = editingTable.status ?? "active";

                  return (
                    <>
                      {/* ATIVAR/DESATIVAR */}
                      <Secondary
                        type="button"
                        $variant="neutral"
                        onClick={async () => {
                          const newStatus =
                            currentStatus === "active" ? "inactive" : "active";

                          // 1) atualiza no back
                          await fetch(
                            `${baseUrl}/cadastros/price-tables/${editingTable.id}`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                              body: JSON.stringify({
                                operatorId: mOperadora,
                                planId: mPlano,
                                effectiveDate: mVigencia,
                                status: newStatus,
                              }),
                            }
                          );

                          // 2) recarrega a lista RESPEITANDO filtros de cima
                          let url = `${baseUrl}/cadastros/price-tables`;
                          const params = [];
                          if (fOperadora)
                            params.push(`operatorId=${fOperadora}`);
                          if (fPlano) params.push(`planId=${fPlano}`);
                          if (fStatus !== "all")
                            params.push(`status=${fStatus}`);
                          if (params.length) url = `${url}?${params.join("&")}`;

                          const res = await fetch(url, {
                            credentials: "include",
                          });
                          const data = await res.json();
                          setTabelas(data);

                          // 3) fecha modal
                          handleCloseModal();
                        }}
                      >
                        {currentStatus === "active" ? "Desativar" : "Ativar"}
                      </Secondary>

                      {/* EXCLUIR */}
                      <Secondary
                        type="button"
                        $variant="danger"
                        onClick={async () => {
                          // 1) apaga no back
                          await fetch(
                            `${baseUrl}/cadastros/price-tables/${editingTable.id}`,
                            {
                              method: "DELETE",
                              credentials: "include",
                            }
                          );

                          // 2) recarrega lista com filtros
                          let url = `${baseUrl}/cadastros/price-tables`;
                          const params = [];
                          if (fOperadora)
                            params.push(`operatorId=${fOperadora}`);
                          if (fPlano) params.push(`planId=${fPlano}`);
                          if (fStatus !== "all")
                            params.push(`status=${fStatus}`);
                          if (params.length) url = `${url}?${params.join("&")}`;

                          const res = await fetch(url, {
                            credentials: "include",
                          });
                          const data = await res.json();
                          setTabelas(data);

                          // 3) fecha modal
                          handleCloseModal();
                        }}
                      >
                        Excluir
                      </Secondary>
                    </>
                  );
                })()}

              <Secondary
                type="button"
                $variant="warn"
                onClick={handleCloseModal}
              >
                Cancelar
              </Secondary>
              <Button type="button" onClick={handleSaveTable}>
                {editingTable ? "Salvar alterações" : "Salvar"}
              </Button>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Wrap>
  );
}
