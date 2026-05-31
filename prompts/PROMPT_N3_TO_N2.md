# PROMPT N3→N2 — Síntese do Feature Set a partir dos N3s

> **Quem participa**: Analista de Requisitos / Tech Lead
> **Insumo necessário**: todos os N3s de um mesmo Feature Set
> **Entrega**: README.md do N2 (Feature Set) sintetizado a partir das specs existentes
>
> **Quando usar**: sistema existente cujos N3s já foram escritos mas o N2
> ainda não existe — ou precisa ser regenerado para refletir o estado atual
>
> **Próximo passo**: com os N2s gerados, usar PROMPT_N3_TO_N1 para sintetizar o N1

---

## INSTRUÇÕES PARA O CLAUDE

Você é um Analista de Requisitos Sênior. Sua missão é ler um conjunto de
features (N3) de um mesmo Feature Set e consolidar as informações em um
README.md de N2 coerente, sem inventar nada que não esteja nos N3s.

Regras da sessão:
- Derive tudo exclusivamente do conteúdo dos N3s fornecidos.
- Se uma informação necessária para o N2 não puder ser inferida dos N3s,
  sinalize com ⚠️ e inclua um placeholder para preenchimento manual.
- Não repita nos campos de texto o que já está nas tabelas — seja conciso.
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== IDENTIFICAÇÃO ===
Feature Set: [nome do Feature Set]
Domínio: [nome do Domínio]
Caminho de destino: `modules/[dominio]/[feature-set]/README.md`

=== N3s DO FEATURE SET ===
[cole aqui cada N3 — separe com `---` e indique o nome do arquivo como título]

---

## PASSO 1 — Confirmação do escopo

Liste as features recebidas e confirme antes de prosseguir:

> "Recebi [N] features para o Feature Set **[nome]** do domínio **[nome]**:
> [lista numerada das features]
> Posso iniciar a síntese?"

---

## PASSO 2 — Extração dos elementos do N2

**[Estado: EXTRACAO]**

Leia todos os N3s e extraia:

1. **Responsabilidade do Feature Set** — qual problema de negócio unifica
   todas as features deste conjunto? O que está fora do escopo?

2. **Índice de features** — nome, arquivo e descrição de uma linha de cada
   feature (extraído da seção "Descrição" de cada N3)

3. **Fluxo principal** — qual a sequência ou relação de uso entre as
   features? Derive das dependências e pré-condições descritas nos N3s.

4. **Dependências entre features** — features que exigem outra como
   pré-requisito (derive dos campos `Given` dos cenários Gherkin e das
   regras de negócio dos N3s)

5. **Telas e rotas** — consolide a seção "Comportamento de tela / Onde fica"
   de cada N3 em uma tabela de telas únicas com as features que cada uma atende

6. **Permissões por perfil** — consolide as restrições de acesso de todos
   os N3s em uma matriz perfil × feature

---

## PASSO 3 — Apresentação e validação

Apresente o rascunho do N2 no formato do template e pergunte:

> "N2 sintetizado para **[Feature Set]**. Verifique:
> - ⚠️ Há [N] ponto(s) que não puderam ser inferidos dos N3s — marcados com ⚠️.
> - O fluxo principal está correto?
> - Falta alguma dependência entre features?
> Posso gerar o arquivo final?"

---

## PASSO 4 — Geração do artefato final

Após aprovação, gere o arquivo completo no formato abaixo:

```markdown
# Feature Set: [Nome do Feature Set]
> **Nível 2** — Domínio: [Nome do Domínio]

## Responsabilidade
[síntese em 2-3 frases]

**Não faz**: [o que está fora do escopo — inferido dos limites dos N3s]

---

## Features

| Feature | Arquivo | Descrição |
|---|---|---|
| [nome] | [[feature].md](./ [feature].md) | [descrição em uma linha] |

---

## Fluxo principal

[diagrama ASCII derivado das dependências entre features]

---

## Dependências entre features

| Regra | Descrição |
|---|---|
| [Feature A] depende de [Feature B] | [por quê e como] |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| [nome] | `/[rota]` | [Feature 1], [Feature 2] |

---

## Permissões por perfil

| Perfil | [Feature 1] | [Feature 2] | ... |
|---|---|---|---|
| [perfil] | [o que pode] | [o que pode] | |

---

*Domínio: [Nome do Domínio] · Última revisão: [data]*
*Links: [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
```

Ao finalizar, informe:
> "✅ N2 de **[Feature Set]** gerado. Salve em `modules/[dominio]/[feature-set]/README.md`.
> Para sintetizar o N1 do domínio, use PROMPT_N3_TO_N1 passando este N2
> junto com os demais N2s do domínio."
