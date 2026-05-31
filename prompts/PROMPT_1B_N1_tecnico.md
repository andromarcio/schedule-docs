# PROMPT 1B — N1 Técnico
## Domínios do sistema · Parte técnica

> **Quem participa**: dev
> **Insumo necessário**: README.md negocial gerado pelo PROMPT 1A (aprovado pelo PO)
> **Entrega**: README.md completo (negócio + técnico) + DATA-MODEL.md atualizado
>
> **Pré-requisito**: PROMPT_1A concluído e aprovado pelo PO
> **Atenção**: campos novos identificados nesta sessão devem ser adicionados
> ao DATA-MODEL.md — nunca dentro do N1 ou de qualquer artefato de spec

---

## INSTRUÇÕES PARA O CLAUDE

Você vai complementar o N1 negocial com as definições técnicas do domínio.
O conteúdo negocial já foi validado pelo PO e não deve ser alterado.

Regras da sessão:
- Trabalhe um domínio de cada vez.
- Cruze todos os campos com o DATA-MODEL.md. Campos já existentes: use
  exatamente os nomes de lá. Campos novos: proponha Label Dev (camelCase)
  e campo banco (seguindo a convenção do MASTER.md), sinalize com ⚠️ e
  aguarde aprovação explícita antes de continuar.
- O N1 não lista campos detalhados — apenas nome e descrição das entidades,
  com referência ao DATA-MODEL.md. Os campos completos vivem no DATA-MODEL.md.
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DATA-MODEL.md ===
[cole aqui o conteúdo do DATA-MODEL.md]

=== API-PATTERNS.md ===
[cole aqui o conteúdo do API-PATTERNS.md]

=== N1 NEGOCIAL DO DOMÍNIO (gerado pelo PROMPT 1A) ===
[cole aqui o README.md negocial do domínio a ser complementado]

---

## PASSO 1 — Entidades e campos

**Pergunta 1 — Entidades**
> "Quais tabelas do banco de dados pertencem a este domínio?
> Liste cada uma com uma linha de descrição."

**Pergunta 2 — Campos de cada entidade**
> Para cada entidade identificada, pergunte individualmente:
> "Para a entidade [nome], quais campos ela possui além dos globais
> (id, organizationId, createdAt, updatedAt, deletedAt)?
> Para cada campo: Label PO (português), tipo de dado e se é obrigatório."

Após receber os campos de cada entidade:
- Cruze com o DATA-MODEL.md
- Campos já existentes: confirme que estão corretos e siga em frente
- Campos novos: proponha Label Dev e campo banco com ⚠️
- **Aguarde aprovação de todos os campos novos antes de continuar**
- Ao final desta etapa, liste todos os campos novos aprovados para
  adição ao DATA-MODEL.md

---

## PASSO 2 — Integrações técnicas

**Pergunta 3 — Dependências externas**
> "Este domínio chama algum serviço externo?
> Para cada um: nome, para que é usado e lib sugerida."

**Pergunta 4 — Integrações entre domínios**
> "Quais entidades deste domínio são referenciadas por outros domínios?
> Quais entidades de outros domínios este domínio referencia?
> Como é feita essa integração — FK, evento ou chamada de serviço?"

---

## PASSO 3 — Consolidação técnica

Com as respostas, gere as seções técnicas (sem repetir as negociais):

- Entidades do domínio (apenas: nome | descrição | → DATA-MODEL.md: [nome])
- Dependências externas (tabela: serviço, uso, lib)
- Integrações com outros domínios (leitura e escrita separadas, com tipo de integração)
- Regras de acesso por role

Apresente apenas as seções técnicas. Pergunte:
> "As seções técnicas do N1 de [domínio] estão corretas?
> Posso gerar o arquivo final mesclado?"

---

## PASSO 4 — Geração do arquivo final

Após aprovação, gere:

📄 `modules/[dominio]/README.md` — versão completa

Aplique a marcação de visibilidade:
- Seções negociais: visíveis para todos
- Seções técnicas: dentro de `<div class="dev-only">`

---

## PASSO 5 — Atualização do DATA-MODEL.md

Liste todos os campos novos aprovados nesta sessão:

> "⚠️ Os seguintes campos foram aprovados e devem ser adicionados ao
> DATA-MODEL.md antes de iniciar qualquer N2 deste domínio:
>
> **Entidade [Nome]**
> | Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
> |---|---|---|---|---|---|
> | [campo] | [camelCase] | [snake_case] | [tipo] | [sim/não/auto] | [notas] |"

Ao finalizar, informe:
> "N1 de [domínio] completo. Atualize o DATA-MODEL.md com os campos
> acima antes de iniciar os N2. Use o PROMPT_2A para detalhar os Feature Sets."
