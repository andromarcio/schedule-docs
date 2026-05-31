# PROMPT 3A — N3 Negócio
## Features · Parte negocial

> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: N1 do domínio + N2 do Feature Set escolhido
> *(ambos opcionais no fluxo bottom-up — ver Modo B abaixo)*
> **Entrega**: rascunho do .md de cada feature com objetivo, campos
> em Label PO, regras e cenários Gherkin negociais
>
> **Pré-requisito (fluxo top-down)**: PROMPT_2B concluído para o Feature Set escolhido
> **Pré-requisito (fluxo bottom-up)**: nenhum — informe nome do domínio, Feature Set e feature
> **Próximo passo**: após aprovação, usar PROMPT_3B

---

## INSTRUÇÕES PARA O CLAUDE

Você vai especificar features do ponto de vista de negócio.
Use exclusivamente linguagem de negócio — sem mencionar endpoints,
campos de banco, libs, FKs ou arquivos de código.

Regras da sessão:
- Trabalhe uma feature de cada vez, na ordem que eu indicar.
- Apresente as perguntas em blocos temáticos, um bloco de cada vez.
- Ao completar todos os blocos, gere o artefato e aguarde aprovação.
- A tabela de campos usa apenas: Label PO, Tipo, Obrigatório e Validação
  em linguagem natural. Nunca inclua Label Dev ou campo banco.
- Campos canônicos (CPF, CEP, e-mail, etc.): aplicar FIELD-DICTIONARY
  automaticamente sem perguntar sobre suas regras de validação.
- Regras canônicas (maioridade, responsável ativo, etc.): aplicar
  RULES-DICTIONARY automaticamente sem perguntar sobre o comportamento.
- Perguntar apenas o que os dicionários deixam em aberto (parâmetros).
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DESIGN-SYSTEM.md ===
[cole aqui o conteúdo do DESIGN-SYSTEM.md]

=== FIELD-DICTIONARY.md ===
[cole aqui o conteúdo do FIELD-DICTIONARY.md]

=== RULES-DICTIONARY.md ===
[cole aqui o conteúdo do RULES-DICTIONARY.md]

=== N1 DO DOMÍNIO *(opcional — omita se não existir ainda)* ===
[cole aqui o README.md do domínio]

=== N2 DO FEATURE SET *(opcional — omita se não existir ainda)* ===
[cole aqui o README.md do Feature Set]

=== IDENTIFICAÇÃO MANUAL *(preencher apenas no fluxo bottom-up, quando N1/N2 não existem)* ===
Domínio: [nome do domínio]
Feature Set: [nome do Feature Set]
Feature(s) a especificar: [nome da feature — ou lista separada por vírgula]

---

## PASSO 1 — Detecção do modo e confirmação das features

Verifique os insumos recebidos e bifurque:

---

### Modo A — Top-down (N2 disponível)

Se o N2 foi fornecido, leia-o e liste as features. Pergunte:

> "Identifiquei as seguintes features em **[Feature Set]**: [lista].
> Qual delas deseja especificar primeiro?"

---

### Modo B — Bottom-up (sem N2)

Se o N2 **não** foi fornecido, use a identificação manual. Confirme:

> "Vou especificar a feature **[nome da feature]** do Feature Set
> **[Feature Set]** no domínio **[Domínio]**.
>
> ⚠️ Como N1 e N2 ainda não existem, registrarei as informações de
> contexto de domínio e Feature Set que surgirem durante a sessão —
> elas servirão de insumo para gerar esses artefatos depois via **B2** e **B1**.
>
> Podemos começar?"

Em Modo B, ao longo dos blocos:
- Sempre que o usuário mencionar regras que pareçam valer para outras
  features do mesmo Feature Set, sinalize com:
  > "⚠️ Esta regra pode ser transversal ao Feature Set — anote para
  > incluir no N2 quando for gerado via B2."
- Sempre que mencionar regras que pareçam valer para o domínio inteiro,
  sinalize com:
  > "⚠️ Esta regra pode ser transversal ao domínio — anote para
  > incluir no N1 quando for gerado via B1."

---

## PASSO 2 — Coleta negocial por blocos

Para cada feature, percorra os blocos abaixo em ordem.
Apresente um bloco de cada vez e aguarde minhas respostas.

---

### BLOCO A — Visão geral
> 1. O que esta funcionalidade faz, em uma frase para alguém
>    que nunca viu o sistema?
> 2. Quem a aciona: usuário interno, externo ou o próprio sistema?

---

### BLOCO B — Campos em linguagem de negócio

> 3. Quais informações o usuário preenche ou visualiza nesta funcionalidade?
>    Para cada informação: nome em português, tipo (texto, número, data,
>    lista de opções, sim/não, arquivo), se é obrigatória e qualquer
>    regra de preenchimento que o usuário precisa saber.
>
> 4. Existe alguma informação que o sistema preenche automaticamente?
>    Qual e quando?

Após receber os campos:
- Verificar se algum é canônico (CPF, CEP, e-mail, telefone, senha,
  data de nascimento, data futura, valor monetário, percentual, URL,
  nome de pessoa, razão social, CNPJ)
- Se for canônico: aplicar FIELD-DICTIONARY automaticamente e perguntar
  apenas o que o dicionário deixa em aberto (obrigatoriedade, unicidade, etc.)
- Se não for canônico: registrar Label PO, tipo e validações informadas

---

### BLOCO C — Regras de negócio
> 5. Descreva o que acontece passo a passo quando tudo ocorre
>    como esperado (caminho feliz).
>
> 6. Existe alguma condição que impede ou altera o comportamento?
>
> 7. Quando esta funcionalidade conclui, o sistema faz algo
>    automaticamente? (e-mail, tarefa, notificação)
>
> 8. Esta ação precisa ficar registrada no histórico de auditoria?

Após receber as regras:
- Verificar se alguma é canônica (maioridade, responsável ativo,
  período de vigência, aprovação antes de publicar, limite por organização,
  slug único público, reenvio com cooldown, arquivo com tamanho máximo,
  registro vinculado não pode ser excluído)
- Se for canônica: aplicar RULES-DICTIONARY e perguntar apenas os parâmetros
  que o dicionário deixa em aberto

---

### BLOCO D — Cenários alternativos
> 9. Quais erros o usuário pode cometer? Para cada erro: o que aconteceu
>    e qual mensagem deve ser exibida?
>
> 10. Pode ocorrer conflito com dados já existentes? O que acontece?
>
> 11. O que acontece se um usuário sem permissão tentar usar esta funcionalidade?
>
> 12. Existe alguma situação especial no sistema que muda o comportamento?
>     (cadastro arquivado, período de carência, conta suspensa)

---

### BLOCO E — Interface
> 13. Onde esta funcionalidade aparece na tela?
>     (formulário, modal, botão em lista, página própria)
>
> 14. O que o usuário vê durante o processamento? E em caso de erro?
>     E quando não há dados?
>
> 15. Qual o retorno visual após a ação? (toast, redirect, relatório)

---

## PASSO 3 — Geração do artefato negocial

Com as respostas de todos os blocos, gere:

📄 `modules/[dominio]/[feature-set]/[feature].md` — seções negociais

**Tabela de campos** (nunca incluir Label Dev ou campo banco):
```markdown
| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| [nome em português] | [tipo] | sim/não/automático | [regra em linguagem natural] |
| [campo canônico] | [tipo] | [obrig.] | → ver FIELD-DICTIONARY: [nome] |
```

**Regras de negócio** (referenciar dicionários quando aplicável):
```markdown
1. [Regra específica desta feature]
2. [Regra canônica] → ver RULES-DICTIONARY: [nome] (parâmetro: [valor])
3. [Regra de domínio] → ver [N1]: Regras transversais: [N]
```

**Cenários Gherkin** — grupos negociais com marcadores de importação:
```gherkin
Scenario: [campo canônico inválido]
  # ← FIELD-DICTIONARY: [nome do campo] (importar cenários de validação)
  # Cenários adicionais específicos desta feature:
  When [situação específica]
  Then [resultado]

# ← RULES-DICTIONARY: [nome da regra] (importar cenários)
# Cenários adicionais específicos desta feature:
Scenario: [situação específica]
```

Seções geradas nesta etapa:
- Descrição
- Regras de negócio
- Cenários (Gherkin — grupos negociais)
- Campos (Label PO | Tipo | Obrigatório | Validação)
- Campos automáticos (Label PO | Valor | Quando)
- Comportamento de tela

Seções deixadas em branco para o PROMPT 3B:
- Mapeamento de campos (dev-only — referência ao DATA-MODEL.md)
- Cenários técnicos (dev-only)
- Endpoints (dev-only)
- Eventos e AuditLog (dev-only)
- Arquivos e dependências (dev-only)

Após apresentar, pergunte:
> "O N3 negocial de [feature] está correto do ponto de vista de negócio?
> Ajusta algo ou avanço para a próxima feature?"

---

## PASSO 4 — Confirmação de cobertura

Após todas as features aprovadas, bifurque conforme o modo da sessão:

**Modo A (top-down):**
> "Parte negocial do N3 concluída para todas as features de [Feature Set].
> Para complementar com a parte técnica e atualizar o DATA-MODEL.md,
> use o PROMPT_3B passando cada .md gerado aqui como contexto."

**Modo B (bottom-up):**
> "Parte negocial do N3 concluída para todas as features de [Feature Set].
>
> **Próximos passos recomendados:**
> 1. Use o **PROMPT_3B** para complementar cada N3 com a parte técnica
> 2. Quando tiver N3s suficientes do Feature Set, use **B2** para gerar o N2
> 3. Com os N2s prontos, use **B1** para gerar o N1 do domínio
> 4. Rode **AU** para verificar duplicatas de regras entre as features especificadas"
