# PROMPT 3B — N3 Técnico
## Features · Parte técnica

> **Quem participa**: dev
> **Insumo necessário**: .md negocial aprovado pelo PO + N1 + N2 + DATA-MODEL.md
> **Entrega**: .md completo + DATA-MODEL.md atualizado com campos novos
>
> **Pré-requisito**: PROMPT_3A concluído e aprovado para a feature
> **Atenção**: campos novos identificados nesta sessão vão para o
> DATA-MODEL.md, nunca para uma tabela de mapeamento dentro do N3

---

## INSTRUÇÕES PARA O CLAUDE

Você vai complementar o N3 negocial com as definições técnicas da feature.
O conteúdo negocial já foi validado pelo PO e não deve ser alterado.

Regras da sessão:
- Trabalhe uma feature de cada vez.
- **Passo 1 é obrigatório antes de qualquer outro**: cruzar todos os campos
  do N3 com o DATA-MODEL.md. Campos novos requerem aprovação explícita e
  devem ser listados para adição ao DATA-MODEL.md — nunca adicionados ao N3.
- O N3 não terá tabela de mapeamento de campos — apenas referência:
  `→ ver DATA-MODEL.md: Entidade [Nome]`
- Aplicar FIELD-DICTIONARY e RULES-DICTIONARY automaticamente.
- Siga rigorosamente o API-PATTERNS.md para todos os endpoints.
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DATA-MODEL.md ===
[cole aqui o conteúdo do DATA-MODEL.md]

=== API-PATTERNS.md ===
[cole aqui o conteúdo do API-PATTERNS.md]

=== FIELD-DICTIONARY.md ===
[cole aqui o conteúdo do FIELD-DICTIONARY.md]

=== RULES-DICTIONARY.md ===
[cole aqui o conteúdo do RULES-DICTIONARY.md]

=== N1 DO DOMÍNIO ===
[cole aqui o README.md do domínio]

=== N2 DO FEATURE SET ===
[cole aqui o README.md do Feature Set]

=== N3 NEGOCIAL DA FEATURE (gerado pelo PROMPT 3A) ===
[cole aqui o .md negocial aprovado]

---

## PASSO 1 — Cruzamento de campos com DATA-MODEL.md

**Este passo é obrigatório e deve ser concluído antes de qualquer outro.**

Leia cada campo da tabela de campos do N3 negocial e:

1. Localize no DATA-MODEL.md o Label Dev e o campo banco correspondentes
2. Se o campo existir: confirme e prossiga
3. Se o campo NÃO existir: proponha Label Dev e campo banco com ⚠️

Apresente o resultado:

```
Campos existentes no DATA-MODEL.md:
- "[Label PO]" → Label Dev: [camelCase] | Campo banco: [snake_case] ✅

Campos NOVOS (requerem aprovação e adição ao DATA-MODEL.md):
⚠️ "[Label PO]" → Label Dev proposto: [camelCase] | Campo banco: [snake_case] | Tipo: [tipo SQL]
```

**Aguarde aprovação explícita de todos os campos novos antes de continuar.**

Após aprovação, a seção técnica do N3 terá apenas:
```markdown
## Mapeamento de campos
→ ver DATA-MODEL.md: Entidade [Nome da Entidade]
```

---

## PASSO 2 — Endpoints

**Pergunta 1**
> "Quantos e quais tipos de operação esta feature realiza?
> Existe algum processamento assíncrono (em segundo plano)?"

Com a resposta e seguindo rigorosamente o API-PATTERNS.md, defina
para cada endpoint:
- Método HTTP e rota
- Acesso (público / autenticado; quais roles)
- Body ou query params tipados em TypeScript
  (usar Label Dev dos campos — ver DATA-MODEL.md para referência)
- Exemplo de resposta de sucesso (JSON com HTTP status)
- Tabela de respostas de erro (HTTP | code | situação)

---

## PASSO 3 — Eventos e AuditLog

**Pergunta 2**
> "O N3 negocial menciona ações automáticas ao concluir (e-mail,
> notificação, tarefa). Quais módulos precisam saber que esta ação ocorreu?
> Existe algum evento que esta feature consome de outros módulos?"

Com a resposta, defina:

**Eventos publicados**: evento | quando | payload | consumidores

**Eventos consumidos**: evento | publicado por | reação

**AuditLog** (se a regra de negócio exige rastreabilidade):
```typescript
logAction({
  organizationId: context.organizationId,
  userId: context.userId,
  action: '[entidade.acao]',
  targetEntity: '[Entidade]',
  targetId: [entidade].id,
  metadata: { [Label Dev dos campos relevantes] }
  // Label Dev completo: ver DATA-MODEL.md: Entidade [Nome]
})
```

---

## PASSO 4 — Cenários Gherkin técnicos

Com base nos cenários negociais do N3, gere os cenários técnicos adicionais:
- Comportamento de cookies, headers e tokens de sessão
- Formato exato de erros HTTP (status + JSON de resposta)
- Jobs assíncronos (polling de status, falhas de worker)
- Race conditions relevantes

Para cenários de campos canônicos e regras canônicas, use marcadores
de importação em vez de reescrever:
```gherkin
# ← FIELD-DICTIONARY: [nome do campo] (cenários já especificados)
# ← RULES-DICTIONARY: [nome da regra] (cenários já especificados)
```

---

## PASSO 5 — Arquivos e dependências

Com base em tudo definido, liste:

**Arquivos a criar ou alterar**:
```
[caminho/arquivo]     ← [o que faz]
```

**Dependências**:
- [Lib/Serviço] — [para que é usado nesta feature]

---

## PASSO 6 — Geração do arquivo final

Apresente apenas as seções técnicas geradas. Pergunte:
> "As seções técnicas do N3 de [feature] estão corretas?
> Posso gerar o arquivo final mesclado?"

Após aprovação, gere o arquivo completo:

📄 `modules/[dominio]/[feature-set]/[feature].md` — versão completa

**Estrutura obrigatória**:
```
# [Nome]

## Descrição                         ← negocial
## Regras de negócio                 ← negocial (com refs. aos dicionários)
## Cenários                          ← negocial (grupos negociais + marcadores)
## Campos                            ← negocial (Label PO | Tipo | Obrig. | Validação)
## Campos automáticos                ← negocial (Label PO | Valor | Quando)
## Comportamento de tela             ← negocial

<div class="dev-only">
## Mapeamento de campos              ← apenas: → ver DATA-MODEL.md: Entidade [Nome]
## Cenários técnicos adicionais      ← técnico
## Mapeamento de erros               ← técnico
## API                               ← técnico
## Eventos                           ← técnico
## AuditLog                          ← técnico
## Arquivos a criar ou alterar       ← técnico
## Dependências                      ← técnico
</div>

## Métricas de tamanho               ← APF (sem COSMIC)
## Implementação                     ← rastreabilidade (preenchido após dev)
```

---

## PASSO 7 — Ações pós-sessão

Ao finalizar, informe obrigatoriamente:

> "✅ N3 de [feature] completo.
>
> **Ações obrigatórias antes de implementar:**
>
> 1. Adicionar ao DATA-MODEL.md — Entidade [Nome]:
> [tabela com campos novos aprovados, se houver]
>
> 2. Atualizar status no modules/INDEX.md:
> [feature] → 📋 Especificado
>
> 3. Após implementar: preencher seção 'Implementação' no N3
> e atualizar status para ✅ Implementado"
