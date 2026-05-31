<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Cadastrar Helper
> **Nível 3** — Feature Set: Gestão de Helpers — Domínio: Equipe

## Descrição
Permite à gerente registrar uma helper — profissional autônoma contratada de forma avulsa para cobrir ausências da equipe fixa. Helpers não têm acesso ao app; servem apenas como opção de atribuição na agenda semanal.

---

## Regras de negócio

1. Nome e Telefone são obrigatórios.
2. O tipo da helper é sempre **HELPER** — não cria usuário de acesso ao app.
3. Helpers são consideradas disponíveis por padrão — não registram disponibilidade.
4. Não é possível cadastrar duas helpers com o mesmo telefone.
5. Uma helper cadastrada fica permanentemente disponível para seleção enquanto não for excluída; não existe conceito de inativação de helper — apenas exclusão (soft delete).

---

## Cenários

```gherkin
Feature: Cadastrar helper

  Background:
    Given que a gerente está autenticada

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Cadastrar helper com dados básicos
    When a gerente preenche "Nome" com "Jessica Lima"
    And preenche "Telefone" com "(305) 555-7777"
    And clica em "Salvar"
    Then o sistema cadastra a helper e exibe: "Helper cadastrada com sucesso."
    And "Jessica Lima" aparece disponível para atribuição nas agendas

  Scenario: Cadastrar helper com observações
    When a gerente adiciona "Observações" com "Especialista em limpeza pós-obra"
    And demais campos preenchidos
    And clica em "Salvar"
    Then o sistema salva com as observações

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: Nome vazio
    When a gerente deixa "Nome" vazio
    Then o sistema exibe: "O nome é obrigatório."

  Scenario: Telefone duplicado
    Given que "Marta Souza" já está cadastrada com "(305) 555-7777"
    When a gerente tenta cadastrar outra helper com o mesmo telefone
    Then o sistema exibe: "Este telefone já está cadastrado."
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Nome | texto | sim | Mínimo 2 caracteres; máximo 255 |
| Telefone | texto | sim | Formato `(XXX) XXX-XXXX`; único |
| Observações | texto longo | não | Máximo 1000 caracteres |

### Campos preenchidos automaticamente

| Label PO | Valor | Quando |
|---|---|---|
| Tipo | HELPER | No momento do cadastro |
| Ativo | Verdadeiro | No momento do cadastro |

---

## Comportamento de tela

### Onde fica
Formulário em `/equipe/helpers/novo`.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading | Botão com spinner |
| Erro de validação | Mensagem abaixo do campo |
| Sucesso | Toast verde: "Helper cadastrada com sucesso." |
| Erro de servidor | Toast vermelho: "Não foi possível salvar. Tente novamente." |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Membro da Equipe (type = HELPER)

---

## API

### POST /api/v1/equipe/helpers
**Acesso**: autenticado — role `GERENTE`

**Body**:
```typescript
{
  name: string
  phone: string
  notes?: string
}
```

**Resposta de sucesso** — HTTP 201: objeto Membro com `type: "HELPER"`

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Mensagens por campo |
| `MEMBRO_TELEFONE_DUPLICADO` | 409 | "Este telefone já está cadastrado." |

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'helper.criada',
  targetEntity: 'MembroEquipe',
  targetId: helper.id,
  metadata: { name: helper.name, type: 'HELPER' }
})
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Cadastrar Helper | EE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Helpers · Domínio: Equipe · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
