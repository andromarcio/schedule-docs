<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Cadastrar Cliente
> **Nível 3** — Feature Set: Gestão de Clientes — Domínio: Clientes e Imóveis

## Descrição
Permite à gerente registrar um novo cliente no sistema, informando nome, telefone e, opcionalmente, e-mail e observações. O cliente cadastrado fica disponível para vinculação aos imóveis.

---

## Regras de negócio

1. Nome e Telefone são obrigatórios; E-mail e Observações são opcionais.
2. O telefone deve seguir o formato americano: `(XXX) XXX-XXXX`.
3. Não existe unicidade de nome — dois clientes podem ter o mesmo nome; o sistema diferencia-os pelo ID.
4. Cliente é criado sempre com status ativo.
5. Não é possível cadastrar cliente sem pelo menos um telefone de contato.

---

## Cenários

```gherkin
Feature: Cadastrar cliente

  Background:
    Given que a gerente está autenticada no sistema

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Cadastro com campos obrigatórios preenchidos
    Given que a gerente acessa a tela de cadastro de cliente
    When preenche "Nome" com "Sarah Johnson"
    And preenche "Telefone" com "(305) 555-1234"
    And clica em "Salvar"
    Then o sistema salva o cliente e exibe: "Cliente cadastrado com sucesso."
    And a gerente é redirecionada para a lista de clientes
    And "Sarah Johnson" aparece na lista como ativo

  Scenario: Cadastro com todos os campos preenchidos
    Given que a gerente acessa a tela de cadastro de cliente
    When preenche "Nome" com "Emily Torres"
    And preenche "Telefone" com "(786) 555-9876"
    And preenche "E-mail" com "emily@email.com"
    And preenche "Observações" com "Prefere contato pelo e-mail"
    And clica em "Salvar"
    Then o sistema salva o cliente e exibe: "Cliente cadastrado com sucesso."

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: Tentativa de salvar sem informar o nome
    When a gerente deixa o campo "Nome" vazio
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "O nome é obrigatório."

  Scenario: Tentativa de salvar sem informar o telefone
    When a gerente deixa o campo "Telefone" vazio
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "O telefone é obrigatório."

  Scenario: Telefone em formato inválido
    When a gerente preenche "Telefone" com "30555512"
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "Informe o telefone no formato (XXX) XXX-XXXX."

  Scenario: E-mail em formato inválido
    When a gerente preenche "E-mail" com "emily@"
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "Informe um e-mail válido."
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Nome | texto | sim | Mínimo 2 caracteres; máximo 255 |
| Telefone | texto | sim | Formato americano `(XXX) XXX-XXXX` |
| E-mail | texto | não | Formato de e-mail válido quando preenchido |
| Observações | texto longo | não | Máximo 1000 caracteres |

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Ativo | Verdadeiro | No momento do cadastro |

---

## Comportamento de tela

### Onde fica
Formulário em página própria acessível via botão "Novo Cliente" na lista de clientes (`/clientes/novo`).

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading | Botão "Salvar" exibe spinner e fica desabilitado durante o envio |
| Erro de validação | Mensagem em vermelho abaixo de cada campo com problema; foco no primeiro campo com erro |
| Erro de servidor | Toast vermelho no topo: "Não foi possível salvar. Tente novamente." |
| Sucesso | Toast verde: "Cliente cadastrado com sucesso." Redirecionamento para `/clientes` |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Cliente

---

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento técnico ──────────────────────────────────────

  Scenario: POST com body válido retorna 201
    When POST /api/v1/clientes com body { name, phone }
    Then resposta HTTP 201
    And body { "data": { "id": "uuid", "name": "...", "phone": "...", "active": true }, "meta": null }

  Scenario: POST com campo obrigatório ausente retorna 422
    When POST /api/v1/clientes sem campo "name"
    Then resposta HTTP 422
    And body { "data": null, "error": { "code": "VALIDATION_ERROR", "details": [{ "field": "name", ... }] } }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Mensagens por campo (ver cenários acima) |
| `INTERNAL_ERROR` | 500 | "Não foi possível salvar. Tente novamente." |

---

## API

### POST /api/v1/clientes
**Acesso**: autenticado — role `GERENTE`

**Body**:
```typescript
{
  name: string          // Label PO: Nome — obrigatório; min 2, max 255 chars
  phone: string         // Label PO: Telefone — obrigatório; regex (XXX) XXX-XXXX
  email?: string        // Label PO: E-mail — opcional; formato válido
  notes?: string        // Label PO: Observações — opcional; max 1000 chars
}
```

**Resposta de sucesso** — HTTP 201:
```json
{
  "data": {
    "id": "uuid",
    "name": "Sarah Johnson",
    "phone": "(305) 555-1234",
    "email": null,
    "notes": null,
    "active": true,
    "createdAt": "2026-05-31T10:00:00Z"
  },
  "meta": null
}
```

**Respostas de erro**:
| HTTP | Code | Situação |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Campos inválidos ou ausentes |
| 403 | `AUTH_FORBIDDEN` | Perfil sem permissão (ex: MEMBRO) |
| 500 | `INTERNAL_ERROR` | Falha inesperada |

---

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| — | — | — | — |

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'cliente.criado',
  targetEntity: 'Cliente',
  targetId: cliente.id,
  metadata: { name: cliente.name, phone: cliente.phone }
})
```

---

## Arquivos a criar ou alterar

```
src/routes/clientes.ts              ← rota POST /api/v1/clientes
src/controllers/clientes.ts         ← handler de criação
src/services/clientes.ts            ← lógica de negócio
src/repositories/clientes.ts        ← acesso Prisma
src/validations/clientes.ts         ← schema Zod de criação
```

---

## Dependências

- **Prisma** — persistência no banco PostgreSQL
- **Zod** — validação de campos no backend

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Cadastrar Cliente | EE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| POST /api/v1/clientes | cleansched-api | src/routes/clientes.ts | — |
| Tela de cadastro | cleansched-web | src/pages/clientes/novo.tsx | — |

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Clientes · Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
