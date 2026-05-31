<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Cadastrar Membro
> **Nível 3** — Feature Set: Gestão de Membros — Domínio: Equipe

## Descrição
Permite à gerente registrar uma nova membro fixa da equipe. Ao cadastrar, o sistema cria automaticamente um acesso (usuário) para que a membro possa consultar sua agenda e registrar disponibilidade no app.

---

## Regras de negócio

1. Nome e Telefone são obrigatórios.
2. O tipo da membro cadastrada por aqui é sempre **FIXO** — helpers são cadastradas em outra feature.
3. O sistema cria automaticamente um usuário com perfil **MEMBRO** vinculado ao cadastro.
4. A senha inicial é gerada automaticamente e enviada por texto copiável para que a gerente compartilhe com a membro via WhatsApp.
5. O e-mail para acesso é opcional — se informado, o usuário usa e-mail + senha; se não informado, usa número de telefone como identificador de login.
6. Não é possível cadastrar dois membros com o mesmo telefone.

---

## Cenários

```gherkin
Feature: Cadastrar membro da equipe

  Background:
    Given que a gerente está autenticada no sistema

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Cadastro com campos obrigatórios
    When a gerente preenche "Nome" com "Ana Oliveira"
    And preenche "Telefone" com "(786) 555-2222"
    And clica em "Salvar"
    Then o sistema cadastra a membro e cria o usuário vinculado
    And exibe: "Membro cadastrada com sucesso."
    And exibe a senha provisória para compartilhamento: "Senha provisória: XXXX-XXXX"

  Scenario: Cadastro com e-mail para acesso
    When a gerente preenche "Nome" com "Carol Santos"
    And preenche "Telefone" com "(305) 555-3333"
    And preenche "E-mail de acesso" com "carol@gmail.com"
    And clica em "Salvar"
    Then o sistema cria usuário vinculado com login por e-mail
    And exibe senha provisória para ser compartilhada

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: Nome vazio
    When a gerente deixa "Nome" vazio e clica em "Salvar"
    Then o sistema exibe: "O nome é obrigatório."

  Scenario: Telefone vazio
    When a gerente deixa "Telefone" vazio e clica em "Salvar"
    Then o sistema exibe: "O telefone é obrigatório."

  Scenario: Telefone em formato inválido
    When a gerente preenche "Telefone" com "78655522"
    Then o sistema exibe: "Informe o telefone no formato (XXX) XXX-XXXX."

  # ── Conflitos com dados existentes ─────────────────────────────

  Scenario: Telefone já cadastrado em outra membro
    Given que já existe a membro "Lucia" com telefone "(786) 555-2222"
    When a gerente tenta cadastrar outra membro com o mesmo telefone
    And clica em "Salvar"
    Then o sistema exibe: "Este telefone já está associado a outra membro da equipe."
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Nome | texto | sim | Mínimo 2 caracteres; máximo 255 |
| Telefone | texto | sim | Formato `(XXX) XXX-XXXX`; único no sistema |
| E-mail de acesso | texto | não | Formato de e-mail válido; único se informado |
| Observações | texto longo | não | Máximo 1000 caracteres |

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Tipo | FIXO | No momento do cadastro |
| Ativo | Verdadeiro | No momento do cadastro |
| Senha provisória | Gerada aleatoriamente (8 chars) | No momento da criação do usuário |

---

## Comportamento de tela

### Onde fica
Formulário em `/equipe/novo`. Após salvar, a tela exibe a senha provisória gerada em destaque para que a gerente possa copiá-la e enviar à membro.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading | Botão com spinner durante o cadastro |
| Erro de validação | Mensagem abaixo de cada campo |
| Erro de servidor | Toast vermelho: "Não foi possível salvar. Tente novamente." |
| Sucesso | Painel de confirmação com senha provisória copiável e botão "Copiar para WhatsApp" |
| Empty state | — |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Membro da Equipe

---

## Cenários técnicos adicionais

```gherkin
  Scenario: POST retorna 201 com usuário criado
    When POST /api/v1/equipe/membros com body válido
    Then resposta HTTP 201
    And body inclui { "data": { "id": "uuid", "type": "FIXO", "userId": "uuid" } }

  Scenario: POST com telefone duplicado retorna 409
    When POST /api/v1/equipe/membros com telefone já cadastrado
    Then resposta HTTP 409
    And body { "error": { "code": "MEMBRO_TELEFONE_DUPLICADO" } }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Mensagens por campo |
| `MEMBRO_TELEFONE_DUPLICADO` | 409 | "Este telefone já está associado a outra membro da equipe." |
| `AUTH_FORBIDDEN` | 403 | "Você não tem permissão para esta ação." |
| `INTERNAL_ERROR` | 500 | "Não foi possível salvar. Tente novamente." |

---

## API

### POST /api/v1/equipe/membros
**Acesso**: autenticado — role `GERENTE`

**Body**:
```typescript
{
  name: string
  phone: string
  email?: string
  notes?: string
}
```

**Resposta de sucesso** — HTTP 201:
```json
{
  "data": {
    "id": "uuid",
    "name": "Ana Oliveira",
    "phone": "(786) 555-2222",
    "type": "FIXO",
    "active": true,
    "userId": "uuid",
    "temporaryPassword": "ABCD-1234"
  },
  "meta": null
}
```

> ⚠️ `temporaryPassword` retorna **apenas na criação** — não é armazenado em plaintext.

---

## Eventos
Nenhum evento publicado nesta feature.

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'membro.criado',
  targetEntity: 'MembroEquipe',
  targetId: membro.id,
  metadata: { name: membro.name, type: 'FIXO' }
})
```

---

## Arquivos a criar ou alterar

```
src/routes/equipe.ts              ← rota POST /api/v1/equipe/membros
src/services/membros.ts           ← lógica + geração de usuário e senha provisória
src/repositories/membros.ts       ← acesso Prisma (transaction: membro + user)
src/validations/membros.ts        ← schema Zod
src/lib/crypto.ts                 ← geração de senha provisória aleatória
```

---

## Dependências

- **bcrypt** — hash da senha provisória antes de armazenar

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Cadastrar Membro | EE | Média | 4 |

**Total: 4 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Membros · Domínio: Equipe · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
