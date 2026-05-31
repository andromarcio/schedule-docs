# DATA-MODEL.md
> **Índice e fonte de verdade** para nomenclatura e mapeamento de campos.
> Os modelos detalhados estão fragmentados por domínio em `global/data-models/`
> para otimizar o contexto enviado ao LLM — cole apenas o fragmento do
> domínio que está sendo trabalhado, não o arquivo inteiro.
>
> Os N3 referenciam com: `→ ver DATA-MODEL.md: Entidade [Nome]`
> Os N3 **nunca** duplicam Label Dev ou campo banco em suas tabelas.

---

## Convenção de nomenclatura

| Camada | Convenção | Exemplo | Onde aparece |
|---|---|---|---|
| Label PO | Português, title case, sem jargão | `Nome completo` | N3 (campos), Gherkin, telas |
| Label Dev | camelCase, inglês, autoexplicativo | `fullName` | **data-models/[dominio].md** — apenas aqui |
| Campo banco | snake_case, inglês | `full_name` | **data-models/[dominio].md** — apenas aqui |

---

## Campos globais (presentes em todas as tabelas)

Estão implícitos — não precisam ser listados nos arquivos de domínio.

> ⚠️ Sistema **single-tenant** — não há campo `organization_id`.

| Label PO | Label Dev | Campo banco | Tipo SQL | Notas |
|---|---|---|---|---|
| Identificador | id | id | uuid | PK; gerado automaticamente |
| Data de criação | createdAt | created_at | timestamptz | Gerado automaticamente |
| Data de atualização | updatedAt | updated_at | timestamptz | Atualizado automaticamente |
| Data de exclusão | deletedAt | deleted_at | timestamptz | Soft delete; null = ativo |

---

## Modelos por domínio

| Domínio | Arquivo | Entidades |
|---|---|---|
| Clientes e Imóveis | [data-models/clientes-imoveis.md](./data-models/clientes-imoveis.md) | Cliente, Imóvel |
| Equipe | [data-models/equipe.md](./data-models/equipe.md) | Membro da Equipe, Disponibilidade |
| Agendamento | [data-models/agendamento.md](./data-models/agendamento.md) | Agenda Semanal, Item de Agenda, Membro do Item |

---

## Enums do sistema

| Enum | Campo banco | Valores | Usado em |
|---|---|---|---|
| TamanhoImovel | size | P, M, G | imovel.size |
| FrequenciaImovel | frequency | SEMANAL, QUINZENAL, MENSAL | imovel.frequency |
| TipoMembro | type | FIXO, HELPER | membro_equipe.type |
| StatusAgenda | status | RASCUNHO, CONFIRMADA | agenda_semanal.status |
| FuncaoNaLimpeza | role | LIDER, AUXILIAR | agenda_item_membro.role |
| PerfilUsuario | role | GERENTE, MEMBRO | user.role |

---

## Campos adicionados recentemente

| Data | Entidade | Label PO | Label Dev | Campo banco | Tipo | N3 de origem |
|---|---|---|---|---|---|---|
| 2026-05-31 | — | — | — | — | — | versão inicial |

---

## Relacionamentos

```
Cliente 1──N Imóvel

Imóvel N──N AgendaSemanal (via AgendaItem)

AgendaSemanal 1──N AgendaItem
AgendaItem 1──N AgendaItemMembro
AgendaItem N──1 Imóvel

MembrodaEquipe 1──N Disponibilidade
MembrodaEquipe N──N AgendaItem (via AgendaItemMembro)
```

---

## Índices e restrições de unicidade

| Tabela | Campos | Tipo | Justificativa |
|---|---|---|---|
| imoveis | (client_id) | INDEX | Listagem de imóveis por cliente |
| disponibilidade | (member_id, date) | UNIQUE | Um registro por membro por dia |
| agenda_semanal | (week_start) | UNIQUE | Uma agenda por semana |
| agenda_items | (schedule_id, property_id) | UNIQUE | Imóvel único por agenda semanal |
| agenda_items | (schedule_id, cleaning_date, day_order) | UNIQUE | Ordem única por dia |
| agenda_item_membros | (schedule_item_id, member_id) | UNIQUE | Membro único por item |

---

## Arquivos Lógicos (APF)

> Registro central de ALIs do sistema.
> A contagem de DET **exclui** os 4 campos globais (id, createdAt, updatedAt, deletedAt).
> Critérios de complexidade: ver `global/SIZING.md`.

### ALIs — Arquivos Lógicos Internos

| ALI | Domínio | Entidades constituintes | RET | DET | Complexidade | PF |
|---|---|---|---|---|---|---|
| ALI Clientes e Imóveis | Clientes e Imóveis | Cliente, Imóvel | 2 | 13 | Média | 10 |
| ALI Equipe | Equipe | Membro da Equipe, Disponibilidade | 2 | 9 | Baixa | 7 |
| ALI Agendamento | Agendamento | Agenda Semanal, Item de Agenda, Membro do Item | 3 | 14 | Alta | 15 |
| ALI Usuários | Identity | Usuário | 1 | 4 | Baixa | 7 |

**Total ALIs: 39 PF**
