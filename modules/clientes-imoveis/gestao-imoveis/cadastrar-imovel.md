<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Cadastrar Imóvel
> **Nível 3** — Feature Set: Gestão de Imóveis — Domínio: Clientes e Imóveis

## Descrição
Permite à gerente registrar um novo imóvel que será atendido pelo serviço de limpeza, vinculando-o a um cliente existente e definindo o endereço, tamanho (P, M ou G) e a frequência de limpeza contratada (semanal, quinzenal ou mensal).

---

## Regras de negócio

1. Todo imóvel deve ser vinculado a um cliente ativo. Não é possível cadastrar imóvel para cliente inativo.
2. Os campos Apelido, Endereço completo, Tamanho, Frequência e Cliente são obrigatórios.
3. O Apelido é livre — serve para identificar rapidamente o imóvel (ex: "Casa da Maria — Oak St").
4. Tamanho aceita apenas as opções: P (Pequena), M (Média) ou G (Grande).
5. Frequência aceita apenas: Semanal, Quinzenal ou Mensal.
6. O imóvel é cadastrado como ativo e com "Última limpeza" em branco — será preenchida ao confirmar a primeira agenda.
7. Observações é campo livre para anotações operacionais (acesso, chaves, animais de estimação, etc.).

---

## Cenários

```gherkin
Feature: Cadastrar imóvel

  Background:
    Given que a gerente está autenticada no sistema
    And existe o cliente ativo "Sarah Johnson"

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Cadastro de imóvel com campos obrigatórios
    Given que a gerente acessa a tela de cadastro de imóvel
    When seleciona o cliente "Sarah Johnson"
    And preenche "Apelido" com "Casa Sarah — Oak St"
    And preenche "Endereço completo" com "1234 Oak St, Miami, FL 33101"
    And seleciona "Tamanho" como "M"
    And seleciona "Frequência" como "Quinzenal"
    And clica em "Salvar"
    Then o sistema salva o imóvel e exibe: "Imóvel cadastrado com sucesso."
    And o imóvel aparece na lista de "Sarah Johnson" como ativo

  Scenario: Cadastro com observações
    When a gerente preenche "Observações" com "Chave com a vizinha — Apt 2B"
    And demais campos obrigatórios preenchidos
    And clica em "Salvar"
    Then o sistema salva o imóvel com as observações registradas

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: Tentativa de salvar sem cliente vinculado
    When a gerente não seleciona nenhum cliente
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "Selecione o cliente responsável."

  Scenario: Tentativa de salvar sem apelido
    When a gerente deixa "Apelido" vazio
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "O apelido é obrigatório."

  Scenario: Tentativa de salvar sem tamanho selecionado
    When a gerente não seleciona "Tamanho"
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "Selecione o tamanho do imóvel."

  Scenario: Tentativa de salvar sem frequência selecionada
    When a gerente não seleciona "Frequência"
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "Selecione a frequência de limpeza."

  # ── Conflitos com dados existentes ─────────────────────────────

  Scenario: Tentativa de vincular a cliente inativo
    Given que o cliente "Robert Davis" está inativo
    When a gerente tenta selecionar "Robert Davis" como cliente do imóvel
    Then "Robert Davis" não aparece na lista de clientes disponíveis para seleção
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Cliente | lista de opções | sim | Apenas clientes ativos; busca por nome |
| Apelido | texto | sim | Máximo 100 caracteres |
| Endereço completo | texto longo | sim | Máximo 500 caracteres |
| Tamanho | lista de opções | sim | P, M ou G |
| Frequência | lista de opções | sim | Semanal, Quinzenal ou Mensal |
| Observações | texto longo | não | Máximo 1000 caracteres |

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Ativo | Verdadeiro | No momento do cadastro |
| Última limpeza | Vazio | No cadastro; preenchido ao confirmar primeira agenda |

---

## Comportamento de tela

### Onde fica
Formulário em `/imoveis/novo`, acessível via botão "Novo Imóvel" na lista de imóveis ou na ficha do cliente.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading (salvamento) | Botão "Salvar" com spinner e desabilitado |
| Erro de validação | Mensagem em vermelho abaixo de cada campo com problema |
| Erro de servidor | Toast vermelho: "Não foi possível salvar. Tente novamente." |
| Sucesso | Toast verde: "Imóvel cadastrado com sucesso." Redirecionamento para lista de imóveis |
| Empty state (sem clientes) | Mensagem: "Cadastre um cliente antes de adicionar imóveis." com link para cadastro de cliente |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Imóvel

---

## Cenários técnicos adicionais

```gherkin
  Scenario: POST com body válido retorna 201
    When POST /api/v1/imoveis com body completo e válido
    Then resposta HTTP 201
    And body { "data": { "id": "uuid", "nickname": "...", "active": true, "lastCleanedAt": null }, "meta": null }

  Scenario: POST com clientId de cliente inativo retorna 422
    When POST /api/v1/imoveis com clientId de cliente inativo
    Then resposta HTTP 422
    And body { "error": { "code": "VALIDATION_ERROR", "details": [{ "field": "clientId", "message": "Cliente inativo" }] } }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Mensagens por campo |
| `CLIENTE_NOT_FOUND` | 404 | "Cliente não encontrado." |
| `AUTH_FORBIDDEN` | 403 | "Você não tem permissão para esta ação." |
| `INTERNAL_ERROR` | 500 | "Não foi possível salvar. Tente novamente." |

---

## API

### POST /api/v1/imoveis
**Acesso**: autenticado — role `GERENTE`

**Body**:
```typescript
{
  clientId: string      // UUID do cliente ativo
  nickname: string      // Apelido — max 100 chars
  address: string       // Endereço completo — max 500 chars
  size: 'P' | 'M' | 'G'
  frequency: 'SEMANAL' | 'QUINZENAL' | 'MENSAL'
  notes?: string        // max 1000 chars
}
```

**Resposta de sucesso** — HTTP 201: objeto Imóvel criado

---

## Eventos
Nenhum evento publicado nesta feature.

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'imovel.criado',
  targetEntity: 'Imovel',
  targetId: imovel.id,
  metadata: { nickname: imovel.nickname, clientId: imovel.clientId, frequency: imovel.frequency }
})
```

---

## Arquivos a criar ou alterar

```
src/routes/imoveis.ts           ← rota POST /api/v1/imoveis
src/controllers/imoveis.ts      ← handler de criação
src/services/imoveis.ts         ← lógica de negócio (valida cliente ativo)
src/repositories/imoveis.ts     ← acesso Prisma
src/validations/imoveis.ts      ← schema Zod
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Cadastrar Imóvel | EE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Imóveis · Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
