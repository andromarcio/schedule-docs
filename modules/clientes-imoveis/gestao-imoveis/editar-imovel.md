<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Editar Imóvel
> **Nível 3** — Feature Set: Gestão de Imóveis — Domínio: Clientes e Imóveis

## Descrição
Permite à gerente atualizar os dados de um imóvel já cadastrado: apelido, endereço, tamanho, frequência e observações. A alteração de frequência tem efeito imediato na próxima geração de agenda.

---

## Regras de negócio

1. Todos os campos seguem as mesmas validações do cadastro.
2. Não é possível alterar o cliente vinculado ao imóvel — para vincular a outro cliente, deve-se inativar e recadastrar.
3. A alteração de frequência só afeta a **próxima** geração de agenda — agendas já geradas não são recalculadas.
4. O campo "Última limpeza" não é editável — é atualizado apenas pelo sistema ao confirmar uma agenda.
5. A edição é permitida em imóveis ativos e inativos.
6. O status (ativo/inativo) não pode ser alterado por aqui — apenas via Inativar Imóvel.

---

## Cenários

```gherkin
Feature: Editar imóvel

  Background:
    Given que a gerente está autenticada no sistema
    And existe o imóvel "Casa Sarah — Oak St" cadastrado

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Alteração da frequência de quinzenal para mensal
    Given que a gerente acessa a edição de "Casa Sarah — Oak St"
    When altera "Frequência" para "Mensal"
    And clica em "Salvar"
    Then o sistema salva e exibe: "Imóvel atualizado com sucesso."
    And na próxima geração de agenda, o imóvel aparecerá com frequência mensal

  Scenario: Atualização de observações
    When a gerente altera "Observações" para "Chave no vaso de flor da entrada"
    And clica em "Salvar"
    Then o sistema salva e exibe: "Imóvel atualizado com sucesso."

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: Tentativa de apagar o apelido
    When a gerente apaga o campo "Apelido"
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "O apelido é obrigatório."

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Nenhuma alteração feita
    Given que a gerente acessa a edição sem alterar nada
    When clica em "Salvar"
    Then o sistema exibe: "Nenhuma alteração detectada."
    And nenhuma atualização é gravada
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Apelido | texto | sim | Máximo 100 caracteres |
| Endereço completo | texto longo | sim | Máximo 500 caracteres |
| Tamanho | lista de opções | sim | P, M ou G |
| Frequência | lista de opções | sim | Semanal, Quinzenal ou Mensal |
| Observações | texto longo | não | Máximo 1000 caracteres |

*Cliente e Última limpeza são exibidos somente leitura no formulário.*

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Data de atualização | Data e hora atuais | No momento do salvamento |

---

## Comportamento de tela

### Onde fica
Formulário pré-preenchido em `/imoveis/:id/editar`, acessível via botão "Editar" na ficha ou lista de imóveis.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading (carregamento inicial) | Skeleton nos campos |
| Loading (salvamento) | Botão com spinner e desabilitado |
| Erro de validação | Mensagem em vermelho abaixo de cada campo |
| Erro de servidor | Toast vermelho: "Não foi possível salvar. Tente novamente." |
| Imóvel não encontrado | Tela de erro 404 |
| Sucesso | Toast verde: "Imóvel atualizado com sucesso." |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Imóvel

---

## API

### PATCH /api/v1/imoveis/:id
**Acesso**: autenticado — role `GERENTE`

**Body** (parcial):
```typescript
{
  nickname?: string
  address?: string
  size?: 'P' | 'M' | 'G'
  frequency?: 'SEMANAL' | 'QUINZENAL' | 'MENSAL'
  notes?: string | null
}
```

**Resposta de sucesso** — HTTP 200: objeto Imóvel atualizado

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `IMOVEL_NOT_FOUND` | 404 | "Imóvel não encontrado." |
| `VALIDATION_ERROR` | 422 | Mensagens por campo |
| `INTERNAL_ERROR` | 500 | "Não foi possível salvar. Tente novamente." |

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'imovel.atualizado',
  targetEntity: 'Imovel',
  targetId: imovel.id,
  metadata: { camposAlterados: [...campos] }
})
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Editar Imóvel | EE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Imóveis · Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
