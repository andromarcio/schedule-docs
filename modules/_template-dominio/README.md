<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Domínio: [Nome do Domínio]
> **Nível 1** — Visão estratégica do domínio

## Responsabilidade
[Descrição em 2-3 frases do que este domínio faz e para quem.]

### O que este domínio NÃO faz
| Responsabilidade | Pertence a |
|---|---|
| [o que não faz] | [Domínio responsável] |

---

## Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Nome](./[pasta]/README.md) | `[dominio]/[pasta]/` | [descrição em uma linha] | [N] |

---

## Regras transversais do domínio

1. [Regra que se aplica a todas as features deste domínio]
2. [Regra que se aplica a todas as features deste domínio]

---

## Integrações com outros domínios

### Leitura — domínios que consomem dados deste domínio
| Domínio | O que consome | Como |
|---|---|---|
| [Domínio] | [entidade/campo em Label PO] | FK / Evento / Serviço |

### Escrita — domínios que criam ou alteram dados deste domínio
| Domínio | O que altera | Situação |
|---|---|---|
| [Domínio] | [entidade/campo em Label PO] | [quando ocorre] |

---

<div class="dev-only">

## Entidades do domínio

<!--
  Apenas nome e descrição das entidades — campos completos estão no DATA-MODEL.md.
-->

| Entidade | Descrição | Campos no DATA-MODEL.md |
|---|---|---|
| [Nome] | [descrição em uma linha] | → ver DATA-MODEL.md: [Nome] |

---

## Dependências externas

| Serviço | Uso | Lib sugerida |
|---|---|---|
| [serviço] | [para que é usado] | [lib] |

---

## Regras de acesso consolidadas

| Role | Pode fazer |
|---|---|
| [role] | [permissões resumidas] |

---

</div>

---

*Última revisão: —*
*Links: [Feature Set 1](./[pasta]/README.md) · [INDEX geral](../INDEX.md)*
