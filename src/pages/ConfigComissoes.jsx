// src/pages/ConfigComissoes.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const Left = styled.div`
  width: 260px;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Right = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const Sub = styled.p`
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.6;
`;

const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const ProfileItem = styled.button`
  border: none;
  background: ${({ $active }) =>
    $active ? "rgba(255,123,0,0.12)" : "transparent"};
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.accent : "transparent")};
  border-radius: 10px;
  padding: 0.4rem 0.5rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
`;

const ProfileName = styled.span`
  font-size: 0.78rem;
  font-weight: 500;
`;

const Pills = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const Tag = styled.span`
  background: rgba(15, 118, 110, 0.12);
  color: #0f766e;
  font-size: 0.6rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
`;

const SmallBtn = styled.button`
  border: none;
  background: transparent;
  font-size: 0.7rem;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
`;

const NewProfileForm = styled.form`
  display: flex;
  gap: 0.4rem;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.background};
  padding: 0.35rem 0.45rem;
  font-size: 0.75rem;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.7rem;
  cursor: pointer;
`;

const Empty = styled.p`
  font-size: 0.72rem;
  opacity: 0.6;
  margin: 0.25rem 0;
`;

const RulesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
`;

const RulesList = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  overflow: hidden;
`;

const RulesRow = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1fr 0.6fr 0.6fr 0.6fr 0.4fr;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  align-items: center;
`;

const RulesHead = styled(RulesRow)`
  background: ${({ theme }) => theme.muted};
  font-size: 0.65rem;
  font-weight: 500;
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 6px;
  padding: 0.25rem 0.35rem;
  font-size: 0.7rem;
`;

const NumberInput = styled.input`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 6px;
  padding: 0.2rem 0.35rem;
  font-size: 0.7rem;
`;

export default function ConfigComissoes() {
  const baseUrl = "http://localhost:4000/cadastros";

  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");

  const [operators, setOperators] = useState([]);
  const [plans, setPlans] = useState([]);

  const [rules, setRules] = useState([]);

  // form de nova regra
  const [ruleOperator, setRuleOperator] = useState("");
  const [rulePlan, setRulePlan] = useState("");
  const [rulePercent, setRulePercent] = useState("");
  const [ruleP1, setRuleP1] = useState("");
  const [ruleP2, setRuleP2] = useState("");
  const [ruleP3, setRuleP3] = useState("");

  useEffect(() => {
    async function loadAll() {
      const [pRes, oRes, plRes] = await Promise.all([
        fetch(`${baseUrl}/commission-profiles`, { credentials: "include" }),
        fetch(`${baseUrl}/operators`, { credentials: "include" }),
        fetch(`${baseUrl}/plans`, { credentials: "include" }),
      ]);

      const pJson = await pRes.json();
      const oJson = await oRes.json();
      const plJson = await plRes.json();

      const pData = Array.isArray(pJson)
        ? pJson
        : Array.isArray(pJson?.data)
        ? pJson.data
        : [];

      setProfiles(pData);
      setOperators(oJson);
      setPlans(plJson);

      if (pData.length > 0) {
        const first = pData[0];
        setSelectedProfile(first);
        const rRes = await fetch(
          `${baseUrl}/commission-profiles/${first.id}/rules`,
          { credentials: "include" }
        );
        const rJson = await rRes.json();
        setRules(Array.isArray(rJson) ? rJson : []);
      }
    }

    loadAll();
  }, []);

  async function handleCreateProfile(e) {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const res = await fetch(`${baseUrl}/commission-profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newProfileName.trim(), status: "active" }),
    });
    const created = await res.json();

    const listRes = await fetch(`${baseUrl}/commission-profiles`, {
      credentials: "include",
    });
    const listJson = await listRes.json();
    const list = Array.isArray(listJson)
      ? listJson
      : Array.isArray(listJson?.data)
      ? listJson.data
      : [];
    setProfiles(list);

    const prof = list.find((p) => p.id === created.id) || list[0] || null;
    setSelectedProfile(prof);
    setNewProfileName("");

    if (prof) {
      const rulesRes = await fetch(
        `${baseUrl}/commission-profiles/${prof.id}/rules`,
        { credentials: "include" }
      );
      const rulesData = await rulesRes.json();
      setRules(Array.isArray(rulesData) ? rulesData : []);
    } else {
      setRules([]);
    }
  }

  async function handleSelectProfile(p) {
    setSelectedProfile(p);
    const rRes = await fetch(`${baseUrl}/commission-profiles/${p.id}/rules`, {
      credentials: "include",
    });
    const rJson = await rRes.json();
    setRules(Array.isArray(rJson) ? rJson : []);
  }

  async function handleDeleteProfile(id) {
    await fetch(`${baseUrl}/commission-profiles/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const listRes = await fetch(`${baseUrl}/commission-profiles`, {
      credentials: "include",
    });
    const listJson = await listRes.json();
    const list = Array.isArray(listJson)
      ? listJson
      : Array.isArray(listJson?.data)
      ? listJson.data
      : [];
    setProfiles(list);
    if (list.length > 0) {
      setSelectedProfile(list[0]);
      const rRes = await fetch(
        `${baseUrl}/commission-profiles/${list[0].id}/rules`,
        { credentials: "include" }
      );
      const rJson = await rRes.json();
      setRules(Array.isArray(rJson) ? rJson : []);
    } else {
      setSelectedProfile(null);
      setRules([]);
    }
  }

  async function handleAddRule() {
    if (!selectedProfile) return;
    if (!ruleOperator || !rulePlan || !rulePercent) return;

    await fetch(`${baseUrl}/commission-profiles/${selectedProfile.id}/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        operatorId: ruleOperator,
        planId: rulePlan,
        commissionPercent: Number(rulePercent),
        parcel1: Number(ruleP1) || 0,
        parcel2: Number(ruleP2) || 0,
        parcel3: Number(ruleP3) || 0,
      }),
    });

    const rRes = await fetch(
      `${baseUrl}/commission-profiles/${selectedProfile.id}/rules`,
      { credentials: "include" }
    );
    const rJson = await rRes.json();
    setRules(Array.isArray(rJson) ? rJson : []);

    setRuleOperator("");
    setRulePlan("");
    setRulePercent("");
    setRuleP1("");
    setRuleP2("");
    setRuleP3("");
  }

  async function handleDeleteRule(ruleId) {
    await fetch(`${baseUrl}/commission-profile-rules/${ruleId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (selectedProfile) {
      const rRes = await fetch(
        `${baseUrl}/commission-profiles/${selectedProfile.id}/rules`,
        { credentials: "include" }
      );
      const rJson = await rRes.json();
      setRules(Array.isArray(rJson) ? rJson : []);
    }
  }

  return (
    <div>
      <Title>Regras de comissão</Title>
      <Sub>Cadastre perfis e regras específicas por operadora e plano.</Sub>
      <Wrap style={{ marginTop: "1rem" }}>
        <Left>
          <strong style={{ fontSize: "0.7rem", opacity: 0.6 }}>Perfis</strong>
          <ProfileList>
            {!profiles || profiles.length === 0 ? (
              <Empty>Nenhum perfil ainda.</Empty>
            ) : (
              profiles.map((p) => (
                <ProfileItem
                  key={p.id}
                  $active={selectedProfile?.id === p.id}
                  onClick={() => handleSelectProfile(p)}
                >
                  <div>
                    <ProfileName>{p.name}</ProfileName>
                    <Pills>
                      <Tag>{p.status ?? "active"}</Tag>
                    </Pills>
                  </div>
                  <SmallBtn
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(p.id);
                    }}
                  >
                    ×
                  </SmallBtn>
                </ProfileItem>
              ))
            )}
          </ProfileList>
          <NewProfileForm onSubmit={handleCreateProfile}>
            <Input
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Novo perfil..."
            />
            <Button type="submit">Add</Button>
          </NewProfileForm>
        </Left>

        <Right>
          {!selectedProfile ? (
            <Empty>Selecione um perfil para ver as regras.</Empty>
          ) : (
            <>
              <RulesHeader>
                <div>
                  <h3 style={{ margin: 0, fontSize: "0.9rem" }}>
                    {selectedProfile.name}
                  </h3>
                  <Sub>Regras específicas deste perfil</Sub>
                </div>
              </RulesHeader>

              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Select
                  value={ruleOperator}
                  onChange={(e) => setRuleOperator(e.target.value)}
                >
                  <option value="">Operadora</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name}
                    </option>
                  ))}
                </Select>
                <Select
                  value={rulePlan}
                  onChange={(e) => setRulePlan(e.target.value)}
                  disabled={!ruleOperator}
                >
                  <option value="">Plano</option>
                  {plans
                    .filter((p) =>
                      ruleOperator ? p.operatorId === ruleOperator : true
                    )
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </Select>
                <NumberInput
                  type="number"
                  placeholder="% comissão"
                  value={rulePercent}
                  onChange={(e) => setRulePercent(e.target.value)}
                />
                <NumberInput
                  type="number"
                  placeholder="P1 %"
                  value={ruleP1}
                  onChange={(e) => setRuleP1(e.target.value)}
                />
                <NumberInput
                  type="number"
                  placeholder="P2 %"
                  value={ruleP2}
                  onChange={(e) => setRuleP2(e.target.value)}
                />
                <NumberInput
                  type="number"
                  placeholder="P3 %"
                  value={ruleP3}
                  onChange={(e) => setRuleP3(e.target.value)}
                />
                <Button type="button" onClick={handleAddRule}>
                  Adicionar regra
                </Button>
              </div>

              <RulesList>
                <RulesHead>
                  <div>Operadora</div>
                  <div>Plano</div>
                  <div>Comissão (%)</div>
                  <div>P1 (%)</div>
                  <div>P2 (%)</div>
                  <div>Ações</div>
                </RulesHead>
                {rules.length === 0 ? (
                  <div style={{ padding: "0.5rem", fontSize: "0.7rem" }}>
                    Nenhuma regra para este perfil.
                  </div>
                ) : (
                  rules.map((r) => {
                    const op = operators.find((o) => o.id === r.operatorId);
                    const pl = plans.find((p) => p.id === r.planId);
                    return (
                      <RulesRow key={r.id}>
                        <div>{op ? op.name : r.operatorId}</div>
                        <div>{pl ? pl.name : r.planId}</div>
                        <div>{r.commissionPercent}</div>
                        <div>{r.parcel1}</div>
                        <div>{r.parcel2}</div>
                        <div>
                          <SmallBtn
                            type="button"
                            onClick={() => handleDeleteRule(r.id)}
                          >
                            Remover
                          </SmallBtn>
                        </div>
                      </RulesRow>
                    );
                  })
                )}
              </RulesList>
            </>
          )}
        </Right>
      </Wrap>
    </div>
  );
}
