<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Editar Cliente
> **Nível 3** — Feature Set: Gestão de Clientes — Domínio: Clientes e Imóveis

## Descrição
Permite à gerente atualizar os dados de um cliente já cadastrado: nome, telefone, e-mail e observações. Não é possível editar o status ativo/inativo por aqui — para inativar, use a feature específica.

---

## Regras de negócio

1. Todos os campos editáveis seguem as mesmas validações do cadastro.
2. O status (ativo/inativo) do cliente **não** pode ser alterado via edição — apenas via Inativar Cliente.
3. A edição é permitida tanto para clientes ativos quanto inativos (para corrigir dados).
4. Se nenhum campo for alterado, o sistema não realiza atualização e exibe mensagem informativa.

---

## Cenários

```gherkin
Feature: Editar cliente

  Background:
    Given que a gerente está autenticada no sistema
    And existe o cliente "Sarah Johnson" cadastrado

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Atualização do telefone do cliente
    Given que a gerente acessa a edição de "Sarah Johnson"
    When altera "Telefone" para "(305) 555-9999"
    And clica em "Salvar"
    Then o sistema salva e exibe: "Cliente atualizado com sucesso."
    And na lista de clientes, o telefone de "Sarah Johnson" aparece como "(305) 555-9999"

  Scenario: Adição de e-mail a cliente que não tinha
    Given que "Sarah Johnson" não possui e-mail cadastrado
    When a gerente preenche "E-mail" com "sarah@gmail.com"
    And clica em "Salvar"
    Then o sistema salva e exibe: "Cliente atualizado com sucesso."

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: Tentativa de remover o nome
    When a gerente apaga o campo "Nome"
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "O nome é obrigatório."

  Scenario: Tentativa de remover o telefone
    When a gerente apaga o campo "Telefone"
    And clica em "Salvar"
    Then o sistema exibe abaixo do campo: "O telefone é obrigatório."

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Nenhuma alteração feita
    Given que a gerente acessa a edição de "Sarah Johnson"
    When clica em "Salvar" sem alterar nenhum campo
    Then o sistema exibe: "Nenhuma alteração detectada."
    And nenhuma atualização é gravada no banco

  Scenario: Edição de cliente inativo
    Given que "John Smith" está inativo
    When a gerente acessa a edição de "John Smith" e corrige o telefone
    And clica em "Salvar"
    Then o sistema salva e exibe: "Cliente atualizado com sucesso."
    And o status inativo permanece inalterado
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Nome | texto | sim | Mínimo 2 caracteres; máximo 255 |
| Telefone | texto | sim | Formato americano `(XXX) XXX-XXXX` |
| E-mail | texto | não | Formato de e-mail válido quando preenchido |
| Observações | texto longo | não | Máximo 1000 caracteres |

*O formulário é pré-preenchido com os dados atuais do cliente.*

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Data de atualização | Data e hora atuais | No momento do salvamento |

---

## Comportamento de tela

### Onde fica
Formulário pré-preenchido em `/clientes/:id/editar`, acessível via botão "Editar" na lista ou na ficha do cliente.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading (carregamento inicial) | Skeleton nos campos enquanto dados são carregados |
| Loading (salvamento) | Botão "Salvar" com spinner e desabilitado |
| Erro de validação | Mensagem em vermelho abaixo de cada campo com problema |
| Erro de servidor | Toast vermelho: "Não foi possível salvar. Tente novamente." |
| Cliente não encontrado | Tela de erro 404 com link para voltar à lista |
| Sucesso | Toast verde: "Cliente atualizado com sucesso." Permanece na tela de edição |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Cliente

---

## Cenários técnicos adicionais

```gherkin
  Scenario: PATCH com body válido retorna 200
    When PATCH /api/v1/clientes/:id com body { phone: "(305) 555-9999" }
    Then resposta HTTP 200
    And body { "data": { "id": "uuid", "phone": "(305) 555-9999", ... }, "meta": null }

  Scenario: PATCH em cliente inexistente retorna 404
    When PATCH /api/v1/clientes/id-inexistente
    Then resposta HTTP 404
    And body { "error": { "code": "CLIENTE_NOT_FOUND" } }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `CLIENTE_NOT_FOUND` | 404 | "Cliente não encontrado." |
| `VALIDATION_ERROR` | 422 | Mensagens por campo |
| `INTERNAL_ERROR` | 500 | "Não foi possível salvar. Tente novamente." |

---

## API

### PATCH /api/v1/clientes/:id
**Acesso**: autenticado — role `GERENTE`

**Body** (todos os campos opcionais — apenas os enviados são atualizados):
```typescript
{
  name?: string
  phone?: string
  email?: string | null
  notes?: string | null
}
```

**Resposta de sucesso** — HTTP 200: objeto Cliente atualizado

---

## Eventos
Nenhum evento publicado nesta feature.

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'cliente.atualizado',
  targetEntity: 'Cliente',
  targetId: cliente.id,
  metadata: { camposAlterados: [...campos], valoresAnteriores: { ... } }
})
```

---

## Arquivos a criar ou alterar

```
src/routes/clientes.ts              ← adicionar rota PATCH /api/v1/clientes/:id
src/controllers/clientes.ts         ← handler de atualização
src/services/clientes.ts            ← lógica de atualização
src/validations/clientes.ts         ← schema Zod de atualização (parcial)
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Editar Cliente | EE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Clientes · Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
