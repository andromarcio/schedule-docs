# PR Template — Repositório de Documentação

## Tipo de alteração

- [ ] 📋 Novo N1 (domínio)
- [ ] 📋 Novo N2 (Feature Set)
- [ ] 📋 Novo N3 — parte negocial
- [ ] 🔧 Novo N3 — parte técnica
- [ ] ✏️ Atualização de spec existente
- [ ] 🗂️ Atualização do DATA-MODEL.md
- [ ] 📁 Novo ADR
- [ ] 📝 Changelog de mudança

---

## Feature(s) afetada(s)

| Domínio | Feature Set | Feature | Arquivo |
|---|---|---|---|
| [domínio] | [feature set] | [feature] | [link] |

---

## Descrição da mudança

[O que foi adicionado ou alterado e por quê.]

---

## Checklist — Novo N3 negocial

- [ ] Objetivo em linguagem de negócio (sem jargão técnico)
- [ ] Tabela de campos com Label PO, Tipo, Obrigatório e Validação
      **sem Label Dev ou campo banco** (esses ficam no DATA-MODEL.md)
- [ ] Campos canônicos referenciam FIELD-DICTIONARY
- [ ] Regras canônicas referenciam RULES-DICTIONARY
- [ ] Regras de domínio referenciam o N1
- [ ] Cenários Gherkin cobrem: caminho feliz, erros de validação,
      conflitos, restrições de acesso e estados especiais
- [ ] Campos e regras canônicas usam marcadores de importação
- [ ] Comportamento de tela (loading, erro, empty, sucesso)
- [ ] Aprovado pelo PO antes de abrir este PR

---

## Checklist — Novo N3 técnico

- [ ] Seção "Mapeamento de campos" contém APENAS a referência:
      `→ ver DATA-MODEL.md: Entidade [Nome]` (sem tabela de mapeamento)
- [ ] Campos novos aprovados foram adicionados ao DATA-MODEL.md
      **antes** deste PR (ou em PR separado já mergeado)
- [ ] Endpoints seguindo o API-PATTERNS.md
- [ ] Tabela de erros com códigos e HTTP status
- [ ] Eventos publicados e consumidos documentados
- [ ] AuditLog com action, targetEntity e metadata
- [ ] Arquivos a criar/alterar listados
- [ ] Cenários técnicos dentro de `dev-only`
- [ ] PR do N3 negocial aprovado referenciado: [link]

---

## Checklist — Atualização do DATA-MODEL.md

- [ ] Campos novos listados com Label PO, Label Dev, campo banco e tipo SQL
- [ ] Entidade correta identificada
- [ ] Convenção de nomenclatura da organização respeitada
- [ ] N3 de origem referenciado na coluna "Campos adicionados recentemente"

---

## Checklist — Atualização de spec existente

- [ ] Trecho anterior documentado no changelog
- [ ] Motivo da mudança explicado
- [ ] N2 atualizado se endpoints ou campos do N3 mudaram
- [ ] N1 atualizado se entidades mudaram
- [ ] DATA-MODEL.md atualizado se campos mudaram
- [ ] INDEX.md atualizado se status ou rastreabilidade mudaram

---

## Checklist geral

- [ ] Nenhuma seção técnica está fora de `<div class="dev-only">`
- [ ] Nenhuma seção negocial usa jargão técnico
- [ ] Nenhum Label Dev ou campo banco aparece em tabelas de campos do N3
- [ ] Links relativos entre arquivos funcionando
- [ ] Status no INDEX.md atualizado

---

## Referências

- PR negocial relacionado: [link ou N/A]
- ADR relacionado: [link ou N/A]
- Issue ou ticket: [link]

---

## Checklist — Protótipos

*(preencher apenas se este PR alterar spec que já tem protótipo associado)*

- [ ] Protótipos de fluxo existentes marcados como ⚠️ Desatualizado
      em `prototypes/[dominio]/[feature-set]/README.md`
- [ ] Protótipos de estado existentes marcados como ⚠️ Desatualizado
      em `prototypes/[dominio]/[feature-set]/[feature]/README.md`
- [ ] Novos protótipos gerados via PROMPT_PROTOTYPE_FLOW ou PROMPT_PROTOTYPE_SCREEN
- [ ] README do nível atualizado com status e data de revisão
