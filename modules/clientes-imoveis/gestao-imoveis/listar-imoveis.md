<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Listar Imóveis
> **Nível 3** — Feature Set: Gestão de Imóveis — Domínio: Clientes e Imóveis

## Descrição
Exibe a lista de imóveis cadastrados, com filtros por cliente, status e frequência. É o ponto de entrada para cadastrar, editar e inativar imóveis.

---

## Regras de negócio

1. Por padrão, a lista exibe somente imóveis **ativos**.
2. A gerente pode filtrar por cliente específico, por status (ativo/inativo/todos) e por frequência.
3. A busca é feita pelo endereço (parcial, case-insensitive).
4. A lista é ordenada pelo nome do cliente em ordem alfabética, depois por endereço.
5. MEMBRO só visualiza imóveis vinculados à sua própria agenda.

---

## Cenários

```gherkin
Feature: Listar imóveis

  Background:
    Given que a gerente está autenticada no sistema

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Exibição padrão — apenas imóveis ativos
    Given que existem imóveis ativos e inativos cadastrados
    When a gerente acessa "/imoveis"
    Then o sistema exibe somente os imóveis com status ativo
    And a lista está ordenada por nome do cliente, depois por endereço

  Scenario: Filtro por cliente
    Given que a cliente "Sarah Johnson" tem 3 imóveis cadastrados
    When a gerente seleciona "Sarah Johnson" no filtro de cliente
    Then a lista exibe apenas os imóveis dessa cliente

  Scenario: Filtro por frequência
    When a gerente seleciona "Semanal" no filtro de frequência
    Then a lista exibe apenas imóveis com frequência semanal

  Scenario: Busca por endereço parcial
    When a gerente digita "Oak" no campo de busca
    Then a lista exibe apenas imóveis cujo endereço contém "Oak"

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Lista vazia — nenhum imóvel cadastrado
    Given que não há imóveis cadastrados
    When a gerente acessa "/imoveis"
    Then o sistema exibe: "Nenhum imóvel cadastrado. Clique em 'Novo Imóvel' para começar."

  Scenario: Busca sem resultado
    When a gerente busca por "xyz123"
    Then o sistema exibe: "Nenhum imóvel encontrado para essa busca."
```

---

## Campos exibidos na lista

| Coluna | Campo | Observação |
|---|---|---|
| Endereço | `address` | Clicável — abre edição |
| Cliente | `client.name` | — |
| Tamanho | `size` | ex: "Médio" |
| Frequência | `frequency` | ex: "Semanal" |
| Status | `active` | Badge "Ativo" / "Inativo" |
| Ações | — | Botões Editar e Inativar |

---

## Comportamento de tela

### Onde fica
Página `/imoveis` — tela principal de imóveis do domínio Clientes e Imóveis.

### Elementos da tela

| Elemento | Comportamento |
|---|---|
| Campo de busca | Filtra por endereço em tempo real (debounce 300ms) |
| Filtro "Cliente" | Select com lista de clientes ativos; opção "Todos" selecionada por padrão |
| Filtro "Frequência" | Select: Todos · Semanal · Quinzenal · Mensal |
| Filtro de status | Segmented control: "Ativos" (padrão) · "Inativos" · "Todos" |
| Botão "Novo Imóvel" | Navega para `/imoveis/novo` |
| Linha da lista | Clique no endereço navega para `/imoveis/:id/editar` |
| Botão "Editar" | Navega para `/imoveis/:id/editar` |
| Botão "Inativar" | Abre modal de confirmação (feature Inativar Imóvel) |

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading inicial | Esqueleto de linhas (skeleton loader) |
| Lista preenchida | Exibe linhas com dados |
| Lista vazia | Mensagem de estado vazio com CTA para cadastrar |
| Sem resultado de busca/filtro | Mensagem de resultado vazio; filtros podem ser limpos |
| Erro de servidor | Toast vermelho: "Não foi possível carregar a lista. Tente novamente." |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Imóvel

---

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento técnico ──────────────────────────────────────

  Scenario: GET sem filtros retorna ativos ordenados
    When GET /api/v1/imoveis
    Then resposta HTTP 200
    And body { "data": [...imóveis ativos], "meta": { "total": N } }

  Scenario: GET com filtro de cliente
    When GET /api/v1/imoveis?clientId=uuid
    Then resposta HTTP 200
    And apenas imóveis vinculados a esse cliente

  Scenario: GET com filtro de frequência
    When GET /api/v1/imoveis?frequency=weekly
    Then resposta HTTP 200
    And apenas imóveis com frequency = "weekly"
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `INTERNAL_ERROR` | 500 | "Não foi possível carregar a lista. Tente novamente." |

---

## API

### GET /api/v1/imoveis
**Acesso**: autenticado — role `GERENTE` (visão completa); `MEMBRO` (apenas própria agenda)

**Query params**:
```typescript
search?: string      // filtra por address (ILIKE %search%)
clientId?: string    // filtra por client_id
frequency?: string   // weekly | biweekly | monthly
active?: boolean     // default: true
```

**Resposta de sucesso** — HTTP 200:
```json
{
  "data": [
    {
      "id": "uuid",
      "address": "123 Oak Street",
      "size": "medium",
      "frequency": "weekly",
      "active": true,
      "client": { "id": "uuid", "name": "Sarah Johnson" }
    }
  ],
  "meta": { "total": 1 }
}
```

**Respostas de erro**:
| HTTP | Code | Situação |
|---|---|---|
| 403 | `AUTH_FORBIDDEN` | Perfil sem permissão |
| 500 | `INTERNAL_ERROR` | Falha inesperada |

---

## Arquivos a criar ou alterar

```
src/routes/imoveis.ts               ← rota GET /api/v1/imoveis
src/controllers/imoveis.ts          ← handler de listagem
src/services/imoveis.ts             ← lógica de filtro e ordenação
src/repositories/imoveis.ts         ← query Prisma com where dinâmico
```

---

## Dependências

- **Prisma** — persistência no banco PostgreSQL
- **Zod** — validação dos query params

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Listar Imóveis | CE | Média | 4 |

**Total: 4 PF**

---

## Implementação

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| GET /api/v1/imoveis | cleansched-api | src/routes/imoveis.ts | — |
| Tela de lista | cleansched-web | src/pages/imoveis/index.tsx | — |

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Imóveis · Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
