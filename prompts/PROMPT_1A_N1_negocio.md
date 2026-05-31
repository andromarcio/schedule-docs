# PROMPT 1A — N1 Negócio
## Domínios do sistema · Parte negocial

> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: visão geral do sistema em linguagem natural
> **Entrega**: rascunho do README.md de cada domínio com responsabilidades,
> limites e Feature Sets — sem campos de banco ou detalhes técnicos
>
> **Próximo passo**: após aprovação, usar PROMPT_1B com cada README.md gerado

---

## INSTRUÇÕES PARA O CLAUDE

Você vai me ajudar a mapear os domínios do sistema do ponto de vista
de negócio. Foque exclusivamente em linguagem de negócio — sem mencionar
tabelas, campos de banco, endpoints ou tecnologias.

Regras da sessão:
- Faça uma pergunta de cada vez e aguarde minha resposta antes de prosseguir.
- Ao completar as perguntas de um domínio, gere o artefato parcial e aguarde
  aprovação antes de iniciar o próximo.
- Sinalize suposições com ⚠️.
- Ao final, gere o INDEX negocial com a visão consolidada do sistema.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

---

## PASSO 1 — Mapeamento geral

Faça esta pergunta única e aguarde:

> "Quais são as grandes áreas de negócio do sistema?
> Liste cada uma com nome e uma frase descrevendo o que ela cuida."

Com a resposta, monte a lista de domínios, confirme comigo e pergunte:
> "Confirmo as áreas acima. Posso detalhar a primeira?"

---

## PASSO 2 — Detalhamento negocial de cada domínio

Para cada domínio, faça as perguntas abaixo em sequência,
uma de cada vez, aguardando minha resposta:

**Pergunta 1 — Propósito e limites**
> "Em uma ou duas frases: o que a área [nome] faz?
> E o que ela explicitamente não faz — onde termina sua responsabilidade?"

**Pergunta 2 — Agrupamentos funcionais**
> "Quais são os grupos de funcionalidade dentro desta área?
> Para cada grupo: nome e uma linha do que engloba.
> Pense em termos do que o usuário faz, não de como o sistema funciona."

**Pergunta 3 — Regras que valem para tudo nesta área**
> "Existe alguma regra de negócio que se aplica a tudo dentro desta área?
> Exemplos: 'qualquer ação exige aprovação de um gerente',
> 'dados desta área são visíveis apenas para o time de vendas'."

**Pergunta 4 — Relação com outras áreas**
> "Esta área depende de informações de outras áreas para funcionar?
> Outras áreas dependem desta? Descreva em linguagem de negócio."

Com as respostas, gere o artefato parcial:

📄 `modules/[dominio]/README.md` — seções negociais

Seções geradas nesta etapa:
- Responsabilidade (o que faz e o que não faz)
- Agrupamentos funcionais / Feature Sets (nome + descrição)
- Regras transversais de negócio
- Dependências com outras áreas (descrição negocial, sem FK ou joins)

Seções deixadas em branco para o PROMPT 1B:
- Entidades e campos
- Integrações técnicas

Após apresentar, pergunte:
> "O N1 negocial de [domínio] está correto?
> Ajusta algo ou avanço para o próximo domínio?"

---

## PASSO 3 — INDEX negocial

Após todos os domínios aprovados, gere:

📄 `modules/INDEX.md` — versão negocial

Conteúdo:
- Tabela de domínios com nome, responsabilidade e Feature Sets
- Mapa de dependências entre domínios em linguagem de negócio
- Lista de regras que cruzam mais de um domínio

Ao apresentar, informe:
> "Parte negocial do N1 concluída. Para complementar com os campos,
> entidades e integrações técnicas, use o PROMPT_1B passando
> cada README.md gerado aqui como contexto."
