<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Domínio: Clientes e Imóveis
> **Nível 1** — Visão estratégica do domínio

## Responsabilidade
Este domínio gerencia o cadastro dos clientes (responsáveis pelos imóveis) e dos imóveis que serão atendidos pelo serviço de limpeza. Aqui ficam todas as informações sobre com quem a empresa trabalha e onde realiza os serviços, incluindo o tamanho de cada imóvel e a frequência de limpeza contratada.

### O que este domínio NÃO faz
| Responsabilidade | Pertence a |
|---|---|
| Definir quem vai limpar cada casa | Domínio: Agendamento |
| Registrar quando a limpeza foi realizada | Domínio: Agendamento |
| Gerir disponibilidade da equipe | Domínio: Equipe |

---

## Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Gestão de Clientes](./gestao-clientes/README.md) | `clientes-imoveis/gestao-clientes/` | Cadastro e manutenção dos dados dos clientes | 3 |
| [Gestão de Imóveis](./gestao-imoveis/README.md) | `clientes-imoveis/gestao-imoveis/` | Cadastro e manutenção dos imóveis e seus contratos de limpeza | 3 |

---

## Regras transversais do domínio

1. Todo imóvel deve estar vinculado a um cliente ativo; não é possível cadastrar imóvel para cliente inativo.
2. A inativação de um cliente inativa automaticamente todos os seus imóveis em cascata.
3. Imóveis inativos não aparecem na geração de agenda semanal. → ver RULES-DICTIONARY: Imóvel inativo não gera agenda
4. O endereço dos imóveis segue o formato americano (estado, cidade, ZIP code).
5. O tamanho do imóvel (P, M, G) é informativo — não determina duração nem preço no sistema.

---

## Integrações com outros domínios

### Leitura — domínios que consomem dados deste domínio
| Domínio | O que consome | Como |
|---|---|---|
| Agendamento | Lista de imóveis ativos, frequência e última limpeza | Leitura direta (FK) |

### Escrita — domínios que criam ou alteram dados deste domínio
| Domínio | O que altera | Situação |
|---|---|---|
| Agendamento | Campo "Última limpeza" do imóvel | Ao confirmar a agenda semanal (via evento `agenda.confirmada`) |

---

<div class="dev-only">

## Entidades do domínio

| Entidade | Descrição | Campos no DATA-MODEL.md |
|---|---|---|
| Cliente | Pessoa responsável pelo(s) imóvel(eis) | → ver DATA-MODEL.md: Cliente |
| Imóvel | Residência ou espaço a ser limpo | → ver DATA-MODEL.md: Imóvel |

---

## Dependências externas

| Serviço | Uso | Lib sugerida |
|---|---|---|
| — | Sem dependências externas nesta versão | — |

---

## Regras de acesso consolidadas

| Role | Pode fazer |
|---|---|
| GERENTE | CRUD completo de clientes e imóveis; inativar; visualizar histórico |
| MEMBRO | Apenas visualizar imóveis (endereço/observações) da sua agenda do dia |

---

</div>

---

*Última revisão: 2026-05-31*
*Links: [Gestão de Clientes](./gestao-clientes/README.md) · [Gestão de Imóveis](./gestao-imoveis/README.md) · [INDEX geral](../INDEX.md)*
