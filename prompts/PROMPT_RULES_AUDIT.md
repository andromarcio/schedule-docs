# PROMPT_RULES_AUDIT — Varredura de Regras Duplicadas

> **Quando usar**: periodicamente, após adição de novos N3s ou ao perceber
> que regras similares aparecem em features diferentes.
> Sugestão de frequência: a cada sprint, ou sempre que 3+ N3s novos forem aprovados.
>
> **Quem participa**: dev ou analista de requisitos
> **Insumo necessário**: todos os N3s do escopo desejado (domínio, Feature Set ou sistema inteiro)
> **Entrega**:
> - Lista de regras candidatas à promoção (aparecem em 2+ N3s)
> - Lista de regras conflitantes (mesmo cenário, comportamentos diferentes)
> - Lista de regras já no RULES-DICTIONARY que não estão sendo referenciadas
> - Sugestão de entradas para a seção `## Candidatas` do RULES-DICTIONARY
>
> **Próximo passo**: para cada candidata aprovada, usar PROMPT_4A + PROMPT_4B
> para atualizar os N3s afetados substituindo o texto pela referência

---

## INSTRUÇÕES PARA O CLAUDE

Você é um analista de requisitos fazendo uma auditoria de consistência.
Sua missão é identificar redundâncias, conflitos e oportunidades de
centralização nas regras de negócio dos N3 fornecidos.

**Controle de fluxo — Máquina de Estados:**

```
[INICIALIZACAO] → [LEITURA_N3S] → [DETECCAO_DUPLICATAS]
               → [DETECCAO_CONFLITOS] → [VERIFICACAO_REFERENCIAS]
               → [RELATORIO_FINAL]
```

**Princípios da auditoria:**

1. **Duplicata** = mesma regra de negócio com texto diferente em 2+ N3s,
   independente da feature ou domínio.

2. **Conflito** = mesma situação descrita com comportamentos diferentes
   em N3s distintos (ex: um N3 bloqueia, outro permite o mesmo cenário).

3. **Referência ausente** = regra que já existe no RULES-DICTIONARY mas
   está sendo reescrita em texto no N3 em vez de referenciada.

4. **Candidata** = regra única hoje (só em um N3) mas com alta probabilidade
   de se repetir em outras features — identificar pelo padrão da regra.

---

## CONTEXTO DO PROJETO

=== RULES-DICTIONARY.md ===
[cole aqui o conteúdo do RULES-DICTIONARY.md]

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== N3s A AUDITAR ===
[cole aqui os N3s — pode ser um domínio inteiro ou features específicas]

---

## PASSO 1 — Inicialização

**[Estado: INICIALIZACAO]**

Confirme o escopo recebido e aguarde:

> "Recebi [N] N3s para auditoria, cobrindo [domínios/features].
> Vou verificar: duplicatas entre N3s, conflitos de comportamento,
> referências ausentes ao RULES-DICTIONARY e candidatas à promoção.
> Posso iniciar a varredura?"

---

## PASSO 2 — Leitura e indexação

**[Estado: LEITURA_N3S]**

Leia cada N3 e monte internamente um índice de regras:

```
Para cada N3:
  Para cada regra de negócio (seção "Regras específicas desta feature"):
    - Extrair: feature de origem, enunciado da regra, cenários relacionados
    - Classificar: validação / restrição de acesso / ação automática /
                   imutabilidade / limite / fluxo condicional
```

Não apresente este índice ao usuário — é apenas para seu processamento interno.
Ao concluir a leitura, avance para o próximo estado.

---

## PASSO 3 — Detecção de duplicatas

**[Estado: DETECCAO_DUPLICATAS]**

Compare as regras indexadas e identifique grupos com **mesmo significado**,
mesmo que escritas com palavras diferentes.

Exemplos de duplicatas não óbvias a detectar:
- "O campo X não pode ser alterado após criação" em um N3 e
  "X é imutável após salvar" em outro → mesma regra, escrita diferente
- "Apenas admin pode realizar esta ação" em múltiplos N3s →
  pode ser uma regra canônica de permissão
- "Ao concluir, notificar o responsável" em 3+ N3s →
  candidata clara ao RULES-DICTIONARY

---

## PASSO 4 — Detecção de conflitos

**[Estado: DETECCAO_CONFLITOS]**

Identifique regras que descrevem a **mesma situação com comportamentos diferentes**:

Exemplos:
- N3 de Create Contact: "e-mail duplicado → bloquear e exibir mensagem"
  N3 de Import Contacts: "e-mail duplicado → ignorar linha silenciosamente"
  → Comportamentos diferentes são **intencionais** (contextos distintos)?
  → Ou é um conflito não percebido?

Para cada conflito encontrado, classificar como:
- ⚠️ **Provável conflito**: mesmo contexto, comportamentos opostos — requer decisão
- 💡 **Intencional**: contextos diferentes justificam comportamentos diferentes

---

## PASSO 5 — Verificação de referências ausentes

**[Estado: VERIFICACAO_REFERENCIAS]**

Para cada regra dos N3s, verificar se ela já existe no RULES-DICTIONARY
(global, cross-domain ou domain-scoped) e está sendo reescrita em texto
em vez de referenciada.

Sinalizar como referência ausente quando:
- O N3 descreve em texto uma regra que tem entrada no RULES-DICTIONARY
- A descrição é equivalente mesmo com palavras diferentes

---

## PASSO 6 — Relatório final

**[Estado: RELATORIO_FINAL]**

Apresente o relatório completo estruturado:

---

```markdown
# Relatório de Auditoria de Regras
Data: [data]
Escopo: [N3s auditados]
Gerado por: PROMPT_RULES_AUDIT

---

## 1. Duplicatas identificadas

### [Grupo de duplicata 1]
**Descrição**: [o que a regra faz]
**Encontrada em**:
- `[feature-a]`: "[trecho da regra]"
- `[feature-b]`: "[trecho da regra]"
- `[feature-c]`: "[trecho da regra]"

**Recomendação**: Promover ao RULES-DICTIONARY com escopo [escopo sugerido].
**Ação**: Substituir texto nos N3 por `→ ver RULES-DICTIONARY: [nome sugerido]`

---

## 2. Conflitos identificados

### ⚠️ [Conflito 1] — Provável conflito
**Situação**: [descrição da situação conflitante]
**N3 [feature-a]**: [comportamento A]
**N3 [feature-b]**: [comportamento B]
**Pergunta para o PO**: [o que precisa ser decidido]

### 💡 [Conflito 2] — Intencional
**Situação**: [descrição]
**Justificativa**: [por que os comportamentos diferentes fazem sentido]
**Ação**: Documentar a justificativa no N3 para evitar confusão futura.

---

## 3. Referências ausentes ao RULES-DICTIONARY

| N3 | Regra reescrita em texto | Deveria referenciar |
|---|---|---|
| `[feature]` | "[trecho]" | `→ ver RULES-DICTIONARY: [entrada]` |

**Ação**: Usar PROMPT_4A para atualizar cada N3 listado.

---

## 4. Candidatas à promoção (únicas hoje, alta chance de se repetirem)

| Regra | N3 de origem | Por que é candidata | Promover quando |
|---|---|---|---|
| [nome sugerido] | `[feature]` | [padrão que indica reusabilidade] | [condição] |

**Ação sugerida**: Adicionar à seção `## Candidatas` do RULES-DICTIONARY.

---

## 5. Resumo executivo

| Categoria | Quantidade | Ação necessária |
|---|---|---|
| Duplicatas a centralizar | [N] | Promover ao RULES-DICTIONARY + atualizar N3s |
| Conflitos a resolver | [N] | Decisão do PO |
| Referências ausentes | [N] | Atualizar N3s via PROMPT_4A |
| Candidatas a monitorar | [N] | Adicionar à seção Candidatas |
| N3s sem pendências | [N] | Nenhuma |

---

## 6. Entradas sugeridas para RULES-DICTIONARY

Para cada duplicata aprovada para promoção, gere o bloco pronto
para colar no RULES-DICTIONARY:

### [Nome da regra]

**Escopo**: [global | cross-domain | nome-do-domínio]
**Descrição**: [texto unificado da regra]

**Comportamento**:
1. [comportamento 1]
2. [comportamento 2]

**Parâmetros definidos pelo N3** (se houver):
- [parâmetro]

**Cenários Gherkin**:
[cenários unificados ou marcador de importação]

**Origem**: unificado de [lista de N3s] — auditoria de [data]
```

---

Ao finalizar, pergunte:

> "Auditoria concluída. Deseja que eu gere os PRs de atualização
> para os N3s com referências ausentes usando o PROMPT_4A?
> Se sim, informe quais conflitos foram resolvidos pelo PO primeiro."
