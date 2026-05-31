# PROMPT 2A — N2 Negócio
## Feature Sets · Parte negocial

> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: N1 completo do domínio escolhido
> **Entrega**: rascunho do README.md de cada Feature Set com fluxo
> principal, telas e permissões — sem campos técnicos ou endpoints
>
> **Pré-requisito**: PROMPT_1B concluído para o domínio escolhido
> **Próximo passo**: após aprovação, usar PROMPT_2B com cada README.md gerado

---

## INSTRUÇÕES PARA O CLAUDE

Você vai detalhar os Feature Sets de um domínio do ponto de vista de negócio.
Foque em fluxos, jornadas e regras — sem mencionar endpoints, FKs ou libs.

Regras da sessão:
- Trabalhe um Feature Set de cada vez, na ordem que eu indicar.
- Ao completar as perguntas de um Feature Set, gere o artefato parcial
  e aguarde aprovação antes de iniciar o próximo.
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== N1 DO DOMÍNIO ESCOLHIDO ===
[cole aqui o README.md completo do domínio]

---

## PASSO 1 — Confirmação dos Feature Sets

Leia o N1 e liste os Feature Sets identificados. Pergunte:
> "Identifiquei os seguintes Feature Sets no domínio [nome]: [lista].
> Qual deles deseja detalhar primeiro?"

Aguarde minha escolha antes de prosseguir.

---

## PASSO 2 — Detalhamento negocial de cada Feature Set

Para cada Feature Set que eu indicar, faça as perguntas abaixo
em sequência, uma de cada vez, aguardando minha resposta:

**Pergunta 1 — Features**
> "Quais são as funcionalidades individuais deste grupo?
> Para cada uma: nome e uma linha do que o usuário consegue fazer."

**Pergunta 2 — Jornada principal**
> "Descreva a jornada principal do usuário dentro deste grupo,
> do início ao fim, em linguagem natural.
> O que ele faz primeiro? O que acontece depois? Como termina?"

**Pergunta 3 — Dependências entre funcionalidades**
> "Alguma funcionalidade depende de outra para existir ou funcionar?
> Existe alguma ordem obrigatória ou exclusão mútua entre elas?"

**Pergunta 4 — Telas**
> "Quais telas o usuário vai ver neste grupo de funcionalidades?
> Para cada tela: nome, o que ela mostra e quais funcionalidades ela atende."

**Pergunta 5 — Permissões**
> "Quem pode usar este grupo de funcionalidades?
> Existem diferenças de acesso entre perfis de usuário?
> Descreva em linguagem de negócio — sem mencionar nomes técnicos de roles."

Com as respostas, gere o artefato parcial:

📄 `modules/[dominio]/[feature-set]/README.md` — seções negociais

Seções geradas nesta etapa:
- Responsabilidade (o que faz e o que não faz)
- Features (tabela: nome, arquivo N3 futuro, descrição)
- Fluxo principal (diagrama em texto ou lista numerada)
- Dependências entre features
- Telas (tabela: nome, rota, features atendidas)
- Permissões por perfil (descrição negocial)

Após apresentar, pergunte:
> "O N2 de [Feature Set] está correto?
> Ajusta algo ou avanço para o próximo Feature Set?"

Repita o Passo 2 para cada Feature Set que eu indicar.

---

## PASSO 3 — Confirmação de cobertura

Após todos os Feature Sets do domínio aprovados, confirme:
> "Todos os Feature Sets do domínio [nome] foram detalhados.
> Para especificar as features individualmente, use o PROMPT_3A."
