# PROMPT 4B — N3 Update Técnico
## Atualização de Feature Existente · Parte técnica

> **Quem participa**: dev
> **Insumo necessário**: N3 negocial atualizado (PROMPT_4A aprovado) +
> data-models/[dominio].md + N3 original completo
> **Entrega**: .md completo atualizado + data-models/[dominio].md atualizado
>
> **Pré-requisito**: PROMPT_4A concluído e aprovado pelo PO
>
> ⚠️ **Use este prompt para manutenção (Brownfield).**
> Para features novas do zero, use PROMPT_3B.

---

## INSTRUÇÕES PARA O CLAUDE

Você vai complementar a atualização do N3 negocial com as definições técnicas.
O conteúdo negocial da atualização já foi validado pelo PO e não deve ser alterado.

Para evitar quebra de fluxo, você agirá como uma **Máquina de Estados**:

```
[INICIALIZACAO] → [ANALISE_BREAKING_CHANGES] → [ATUALIZACAO_DATA_MODEL]
                → [GERACAO_TECNICA] → [ARQUIVO_FINAL]
```

Regras da sessão:
- Foque apenas nas partes técnicas afetadas pela mudança
- Campos novos vão para `global/data-models/[dominio].md` — NUNCA no N3
- **Avise explicitamente** se a mudança introduz breaking changes
- Siga rigorosamente o API-PATTERNS.md e o ERROR-DICTIONARY.md
- Sinalize suposições com ⚠️

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DATA-MODEL do domínio (fragmentado) ===
[cole aqui o conteúdo de global/data-models/[dominio].md]

=== API-PATTERNS.md ===
[cole aqui o conteúdo do API-PATTERNS.md]

=== ERROR-DICTIONARY.md ===
[cole aqui o conteúdo do ERROR-DICTIONARY.md]

=== N3 COMPLETO ORIGINAL ===
[cole aqui o .md completo original da feature]

=== N3 NEGOCIAL ATUALIZADO (gerado pelo PROMPT_4A) ===
[cole aqui o .md negocial atualizado e aprovado]

---

## PASSO 1 — Inicialização

**[Estado: INICIALIZACAO]**

Confirme os artefatos recebidos e aguarde:
> "Recebi o N3 original e a atualização negocial de [feature].
> Posso iniciar a análise de breaking changes?"

---

## PASSO 2 — Análise de breaking changes

**[Estado: ANALISE_BREAKING_CHANGES]**

Leia as diferenças entre o N3 original e o atualizado e avalie:

- Esta mudança exige novas migrations de banco?
- Altera o schema de Request ou Response da API de forma incompatível?
- Adiciona campos novos que precisam ir para o data-models/[dominio].md?
- Afeta algum evento publicado ou consumido?
- Afeta workers ou jobs assíncronos?

Gere um alerta obrigatório e aguarde confirmação antes de continuar:

```
⚠️ Análise de Breaking Changes:

Migrations necessárias: [Sim/Não — justificativa]
APIs com schema alterado: [lista ou "Nenhuma"]
Eventos afetados: [lista ou "Nenhum"]
Workers afetados: [lista ou "Nenhum"]
Campos novos para data-models/[dominio].md:
  - Label PO: [x] | Label Dev: [y] | Campo banco: [z] | Tipo: [t]
```

> "Confirma estas mudanças? Posso prosseguir com a atualização técnica?"

---

## PASSO 3 — Atualização do data-model

**[Estado: ATUALIZACAO_DATA_MODEL]**

Se houver campos novos aprovados, liste-os para adição ao fragmento do domínio:

> "⚠️ Os seguintes campos devem ser adicionados ao
> `global/data-models/[dominio].md` antes de implementar:
> [tabela com Label PO | Label Dev | campo banco | tipo SQL | notas]"

---

## PASSO 4 — Geração da atualização técnica

**[Estado: GERACAO_TECNICA]**

Atualize apenas as seções técnicas (`dev-only`) afetadas:
- Mapeamento de campos: atualizar referência ao data-models se entidade mudou
- Cenários técnicos adicionais: adicionar/remover conforme mudanças
- Mapeamento de erros: verificar no ERROR-DICTIONARY.md; propor novos com ⚠️
- API: atualizar endpoints afetados (body, response, erros)
- Eventos: atualizar se payload mudou
- AuditLog: atualizar metadata se campos mudaram
- Arquivos: listar o que precisa ser criado ou alterado

Apresente apenas as seções técnicas alteradas. Pergunte:
> "As seções técnicas atualizadas estão corretas?
> Posso gerar o arquivo final mesclado?"

---

## PASSO 5 — Arquivo final e ações pós-sessão

**[Estado: ARQUIVO_FINAL]**

Gere o arquivo .md completo com negocial + técnico mesclados.

Ao finalizar, informe obrigatoriamente:

> "✅ Atualização do N3 de [feature] concluída.
>
> **Ações obrigatórias antes de implementar:**
>
> 1. Atualizar `global/data-models/[dominio].md` com os campos novos aprovados
> 2. Registrar a mudança em `changelogs/[data]-[feature]-[descricao].md`
> 3. Atualizar o status no `modules/INDEX.md` para ⚠️ Revisão necessária
>    (e voltar para ✅ Implementado após o deploy)
> 4. Se houver breaking change na API, comunicar os consumidores"
