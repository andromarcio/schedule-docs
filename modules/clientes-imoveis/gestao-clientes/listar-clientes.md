<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Listar Clientes
> **Nível 3** — Feature Set: Gestão de Clientes — Domínio: Clientes e Imóveis

## Descrição
Exibe a lista de todos os clientes cadastrados, com busca por nome e filtro por status (ativo/inativo). É a tela central de gerenciamento de clientes — ponto de entrada para cadastrar, editar e inativar.

---

## Regras de negócio

1. Por padrão, a lista exibe somente clientes **ativos**.
2. A gerente pode alternar para exibir clientes inativos ou todos.
3. A busca é feita pelo nome (parcial, case-insensitive).
4. A lista é ordenada por nome em ordem alfabética crescente.
5. Clientes sem imóveis cadastrados são exibidos normalmente na lista.

---

## Cenários

```gherkin
Feature: Listar clientes

  Background:
    Given que a gerente está autenticada no sistema

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Exibição padrão — apenas clientes ativos
    Given que existem clientes ativos e inativos cadastrados
    When a gerente acessa "/clientes"
    Then o sistema exibe somente os clientes com status ativo
    And a lista está ordenada alfabeticamente por nome

  Scenario: Busca por nome parcial
    Given que existem os clientes "Sarah Johnson" e "Emily Torres"
    When a gerente digita "sarah" no campo de busca
    Then a lista exibe apenas "Sarah Johnson"

  Scenario: Filtro por clientes inativos
    When a gerente seleciona o filtro "Inativos"
    Then a lista exibe somente os clientes com status inativo

  Scenario: Filtro "Todos"
    When a gerente seleciona o filtro "Todos"
    Then a lista exibe clientes ativos e inativos

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Lista vazia — nenhum cliente cadastrado
    Given que não há clientes cadastrados
    When a gerente acessa "/clientes"
    Then o sistema exibe: "Nenhum cliente cadastrado. Clique em 'Novo Cliente' para começar."

  Scenario: Busca sem resultado
    When a gerente busca por "xyz123"
    Then o sistema exibe: "Nenhum cliente encontrado para essa busca."
```

---

## Campos exibidos na lista

| Coluna | Campo | Observação |
|---|---|---|
| Nome | `name` | Clicável — abre edição |
| Telefone | `phone` | — |
| Imóveis | contagem de imóveis ativos | — |
| Status | `active` | Badge "Ativo" / "Inativo" |
| Ações | — | Botões Editar e Inativar |

---

## Comportamento de tela

### Onde fica
Página `/clientes` — tela principal do domínio Clientes e Imóveis.

### Elementos da tela

| Elemento | Comportamento |
|---|---|
| Campo de busca | Filtra em tempo real (debounce 300ms) ao digitar |
| Filtro de status | Segmented control: "Ativos" (padrão) · "Inativos" · "Todos" |
| Botão "Novo Cliente" | Navega para `/clientes/novo` |
| Linha da lista | Clique no nome navega para `/clientes/:id/editar` |
| Botão "Editar" | Navega para `/clientes/:id/editar` |
| Botão "Inativar" | Abre modal de confirmação (feature Inativar Cliente) |

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading inicial | Esqueleto de linhas (skeleton loader) durante carregamento |
| Lista preenchida | Exibe linhas com dados |
| Lista vazia | Mensagem de estado vazio com CTA para cadastrar |
| Sem resultado de busca | Mensagem de resultado vazio; busca pode ser limpa |
| Erro de servidor | Toast vermelho: "Não foi possível carregar a lista. Tente novamente." |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Cliente

---

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento técnico ──────────────────────────────────────

  Scenario: GET sem filtros retorna ativos ordenados por nome
    When GET /api/v1/clientes
    Then resposta HTTP 200
    And body { "data": [...clientes ativos], "meta": { "total": N } }
    And itens ordenados por name ASC

  Scenario: GET com filtro de busca
    When GET /api/v1/clientes?search=sarah
    Then resposta HTTP 200
    And apenas clientes cujo name contém "sarah" (case-insensitive)

  Scenario: GET com filtro de status
    When GET /api/v1/clientes?active=false
    Then resposta HTTP 200
    And apenas clientes com active = false
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `INTERNAL_ERROR` | 500 | "Não foi possível carregar a lista. Tente novamente." |

---

## API

### GET /api/v1/clientes
**Acesso**: autenticado — role `GERENTE`

**Query params**:
```typescript
search?: string    // filtra por name (ILIKE %search%)
active?: boolean   // default: true; "all" retorna ambos
```

**Resposta de sucesso** — HTTP 200:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Sarah Johnson",
      "phone": "(305) 555-1234",
      "email": null,
      "activePropertiesCount": 2,
      "active": true
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
src/routes/clientes.ts              ← rota GET /api/v1/clientes
src/controllers/clientes.ts         ← handler de listagem
src/services/clientes.ts            ← lógica de filtro e ordenação
src/repositories/clientes.ts        ← query Prisma com where dinâmico
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
| Listar Clientes | CE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| GET /api/v1/clientes | cleansched-api | src/routes/clientes.ts | — |
| Tela de lista | cleansched-web | src/pages/clientes/index.tsx | — |

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Clientes · Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
