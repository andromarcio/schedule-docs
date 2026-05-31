# N0 — Visão Estratégica de Produto
> **Nível 0** — Documento raiz do sistema
>
> **Objetivo**: prover contexto de negócio, perfil dos usuários e métricas
> de sucesso para balizar as inferências feitas pelo LLM durante as sessões
> de especificação de N1, N2 e N3.
>
> **Quando usar**: incluir este arquivo (ou seu conteúdo) sempre que iniciar
> a concepção de um novo Domínio (N1) ou Feature Set (N2).

---

## 1. Propósito geral do sistema

[Descreva em 1 ou 2 parágrafos qual é o objetivo central do sistema.
Qual problema ele resolve e qual valor ele entrega ao usuário final?]

---

## 2. Personas e usuários principais

Descreva os principais perfis de usuários que interagem com o sistema,
suas necessidades e restrições.

### [Nome da Persona 1 — ex: Administrador do Sistema]
- **Perfil**: [descrição breve — cargo, contexto, nível técnico]
- **Objetivos principais**: [o que essa persona tenta realizar no sistema]
- **Dores / Desafios**: [quais problemas enfrenta que o sistema deve aliviar]

### [Nome da Persona 2 — ex: Cliente Final]
- **Perfil**: [descrição breve]
- **Objetivos principais**: [o que essa persona tenta realizar]
- **Dores / Desafios**: [quais problemas enfrenta]

### [Nome da Persona 3 — ex: Analista / Operador]
- **Perfil**: [descrição breve]
- **Objetivos principais**: [o que essa persona tenta realizar]
- **Dores / Desafios**: [quais problemas enfrenta]

---

## 3. Métricas de sucesso (KPIs)

Liste como o sucesso das funcionalidades será medido.

| Métrica | Meta | Como medir |
|---|---|---|
| [ex: Redução no tempo de resposta do suporte] | [ex: 20% em 6 meses] | [ex: relatório mensal de tickets] |
| [ex: Taxa de conversão de leads] | [ex: 15% acima do atual] | [ex: dashboard de captação] |

---

## 4. Tom de voz e princípios de UX

Quais são as diretrizes de comunicação do sistema?

| Princípio | Descrição |
|---|---|
| [ex: Linguagem simples] | [A interface deve ser acessível, sem jargões técnicos] |
| [ex: Tom prestativo em erros] | [Mensagens de erro devem ser calmas e orientativas, nunca acusatórias] |
| [ex: Eficiência para usuários recorrentes] | [Fluxos frequentes devem ter atalhos e poucos cliques] |

---

## 5. Restrições e premissas globais

[Liste restrições de negócio, regulatórias ou técnicas que impactam
decisões de design do sistema como um todo.]

- [ex: O sistema deve ser compatível com LGPD]
- [ex: Nenhum dado sensível pode ser armazenado fora do Brasil]
- [ex: O sistema deve funcionar offline para os módulos X e Y]

---

*Documento raiz do sistema — referenciar no MASTER.md e incluir nas
sessões de criação de N1 e N2.*
