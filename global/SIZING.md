# SIZING.md
> Convenções de medição de tamanho funcional do sistema.
> Fonte única de critérios para contagem APF e COSMIC.
> Atualizar sempre que uma nova convenção for adotada.

---

## Normas adotadas

| Método | Norma | Versão |
|---|---|---|
| APF | IFPUG CPM | 4.3.1 |
| COSMIC | COSMIC FSM | 5.0 |

> ⚠️ Registre aqui a versão exata adotada pela organização antes de iniciar qualquer contagem.

---

## APF — Análise de Pontos de Função

### Mapeamento da estrutura de documentação → elementos APF

| Elemento APF | Definição | Onde identificar nesta estrutura |
|---|---|---|
| ALI (Arquivo Lógico Interno) | Grupo de dados mantido pelo sistema | `global/DATA-MODEL.md` — uma entidade principal = um ALI candidato |
| AIE (Arquivo de Interface Externa) | Grupo de dados de sistema externo usado mas não mantido | `global/API-PATTERNS.md` + seção "Integrações" do N1 |
| EE (Entrada Externa) | Transação que processa dados de fora para dentro | `## API` do N3 — verbos POST / PUT / PATCH / DELETE **expostos além da fronteira lógica do sistema** |
| SE (Saída Externa) | Transação que envia dados com lógica de processamento | `## API` do N3 — GET com cálculo, relatório ou transformação **exposto além da fronteira lógica** |
| CE (Consulta Externa) | Transação que recupera dados sem lógica adicional | `## API` do N3 — GET simples de listagem ou detalhe **exposto além da fronteira lógica** |

### Critério de complexidade — Funções de Dados (ALI / AIE)

| RET \ DET | 1–19 | 20–50 | 51+ |
|---|---|---|---|
| 1 | Baixa | Baixa | Média |
| 2–5 | Baixa | Média | Alta |
| 6+ | Média | Alta | Alta |

**Como contar DET**: cada campo da tabela `## Campos` do N3 = 1 DET.
Campos automáticos do sistema (createdAt, updatedAt, id, organizationId) = **não contam**.
**Como contar RET**: subgrupos lógicos dentro da entidade. Na ausência de subgrupos explícitos, considerar RET = 1.

### Critério de complexidade — Funções de Transação (EE / SE / CE)

| FTR \ DET | 1–4 | 5–15 | 16+ |
|---|---|---|---|
| 0–1 | Baixa | Baixa | Média |
| 2–3 | Baixa | Média | Alta |
| 4+ | Média | Alta | Alta |

**Como contar FTR**: número de ALIs ou AIEs lidos ou mantidos pela transação — identificável pela seção `## Dependências` e pelas tabelas referenciadas no `## API` do N3.
**Como contar DET**: campos no body/query da requisição + campos na resposta de sucesso. Campos de controle (HTTP status, organizationId, cursor de paginação) = **não contam**.

### Tabela de pontos por complexidade

| Tipo | Baixa | Média | Alta |
|---|---|---|---|
| ALI | 7 | 10 | 15 |
| AIE | 5 | 7 | 10 |
| EE | 3 | 4 | 6 |
| SE | 4 | 5 | 7 |
| CE | 3 | 4 | 6 |

---

## COSMIC — Common Software Measurement International Consortium

### Mapeamento da estrutura de documentação → movimentos COSMIC

| Movimento | Definição | Onde identificar nesta estrutura |
|---|---|---|
| Entry (E) | Dado movendo-se de fora do processo para dentro | Campo no body/query do `## API` do N3 |
| Exit (X) | Dado movendo-se de dentro do processo para fora | Campo na resposta do `## API` do N3 |
| Read (R) | Leitura de dado persistido | Cada ALI/AIE consultado pela transação |
| Write (W) | Escrita de dado persistido | Cada ALI criado, alterado ou removido pela transação |

**1 CFP = 1 movimento (E, X, R ou W)**

### Convenções de contagem COSMIC nesta estrutura

- **Granularidade**: contar por endpoint documentado no `## API` do N3.
- **Entry**: cada campo distinto no body ou query params = 1 E. Campos de controle (authorization header, organizationId via JWT, cursor) = **não contam**.
- **Exit**: cada campo distinto na resposta de sucesso = 1 X. Envelope padrão (`data`, `meta`, `error`) = **não conta**, apenas os campos de negócio internos.
- **Read**: cada entidade/ALI lida para processar ou responder = 1 R. Leituras de validação (verificar duplicata, checar permissão) = **contam**.
- **Write**: cada entidade/ALI criada, atualizada ou removida = 1 W. Soft delete = 1 W.
- **Eventos publicados** (`## Eventos` do N3): cada evento publicado implica 1 X adicional.
- **Eventos consumidos** (`## Eventos` do N3): cada evento consumido implica 1 E adicional por campo relevante no payload.

---

## Convenções de registro no N3

Toda feature especificada no N3 deve ter a seção `## Métricas de tamanho` preenchida
**após** a aprovação do N3 negocial e **antes** do início do desenvolvimento.

A contagem é responsabilidade do Dev, revisada pelo Tech Lead, e pode ser auditada
pelo PO com base nos campos e endpoints documentados no mesmo N3.

### Arquitetura BFF (Java + Angular)

Nesta arquitetura, o frontend Angular e o backend Java formam uma única fronteira
lógica do sistema. Endpoints consumidos exclusivamente pelo próprio frontend
**não cruzam a fronteira** e, portanto, **não são contados como EE, SE ou CE**.

| Situação do endpoint | Conta como |
|---|---|
| Consumido apenas pelo frontend Angular deste sistema | **Não conta** |
| Consumido por outro sistema (integração, API pública, parceiro) | EE / SE / CE conforme o tipo |
| Consumido por um worker ou job interno ao sistema | **Não conta** |

**Funções de Dados (ALI / AIE)** não são registradas na seção `## Métricas de tamanho`
do N3 — vivem centralmente em `global/DATA-MODEL.md` e nos fragmentos
`global/data-models/[dominio].md`. Ver seção *Como manter o registro de ALIs sincronizado*.

### O que contar e o que não contar no N3

Cada artefato N3 corresponde a uma única funcionalidade. Registre nele apenas
as funções de transação geradas por essa funcionalidade:

| O que encontrar no N3 | Contar? | Como contar |
|---|---|---|
| ALI — entidade mantida por este sistema | **Não** | Contado centralmente no DATA-MODEL.md |
| AIE — entidade de sistema externo referenciada | **Não** | Contado centralmente no DATA-MODEL.md |
| Endpoint exposto a sistema externo (POST/PUT/PATCH/DELETE) | **Sim** | EE |
| Endpoint exposto a sistema externo (GET com transformação) | **Sim** | SE |
| Endpoint exposto a sistema externo (GET simples) | **Sim** | CE |
| Endpoint consumido apenas pelo frontend deste sistema (BFF) | **Não** | — |
| Combobox / dropdown que carrega dados de um ALI ou AIE | **Sim** | CE (sem lógica) ou SE (com lógica de filtro ou transformação) |

> **Regra do combobox**: sempre que uma tela carrega uma lista de opções a partir
> de uma entidade marcada como ALI ou AIE — independentemente de ser via endpoint
> BFF interno — essa consulta de suporte à interface **conta como CE ou SE**,
> pois representa uma transação funcional distinta da funcionalidade principal.
> Contar uma vez por entidade consultada, por tela onde ocorre.

### Quem conta e quando

| Etapa | Responsável | Momento |
|---|---|---|
| Contagem inicial | Dev que especificou o N3 técnico | Após PROMPT_3B |
| Revisão | Tech Lead do domínio | Antes de mover para `🔄 Em desenvolvimento` |
| Auditoria | Papel externo (se contratual) | Pontual, baseado nos N3 com status `✅ Implementado` |

---

## Consolidação no INDEX.md

O `modules/INDEX.md` deve manter os totais acumulados por feature, domínio e sistema:

```markdown
| Feature | Domínio | Status | PF | CFP |
|---|---|---|---|---|
| [Feature] | [Domínio] | ✅ Implementado | 12 | 18 |
```

Totais de domínio e sistema são calculados por soma das features com status
`📋 Especificado`, `🔄 Em desenvolvimento` e `✅ Implementado`.
Features `❌ Deprecadas` são excluídas do total vigente mas mantidas no histórico.

---

## Glossário rápido

| Sigla | Significado |
|---|---|
| APF | Análise de Pontos de Função |
| PF | Ponto de Função |
| ALI | Arquivo Lógico Interno |
| AIE | Arquivo de Interface Externa |
| EE | Entrada Externa |
| SE | Saída Externa |
| CE | Consulta Externa |
| DET | Data Element Type (campo) |
| RET | Record Element Type (subgrupo lógico) |
| FTR | File Type Referenced (arquivos referenciados) |
| COSMIC | Common Software Measurement International Consortium |
| CFP | COSMIC Function Point |
| E | Entry (movimento COSMIC) |
| X | Exit (movimento COSMIC) |
| R | Read (movimento COSMIC) |
| W | Write (movimento COSMIC) |

---

*Última revisão: —*
*Links: [MASTER.md](./MASTER.md) · [DATA-MODEL.md](./DATA-MODEL.md) · [INDEX geral](../modules/INDEX.md)*

---

## Como manter o registro de ALIs sincronizado

O registro central de ALIs vive em `global/DATA-MODEL.md → ## Arquivos Lógicos (APF)`.
A fonte de cálculo vive nos fragmentos `global/data-models/[dominio].md → ## Arquivos Lógicos deste domínio`.

Fluxo de atualização:

```
Nova entidade criada (PROMPT_3B)
          │
          ├─→ Definir a qual ALI pertence
          │        ├─ ALI existente → anotar cabeçalho da entidade + recalcular DET/RET
          │        └─ ALI novo      → criar linha no fragmento + anotar cabeçalho
          │
          ├─→ Atualizar seção "## Arquivos Lógicos" no fragmento data-models/[dominio].md
          │
          └─→ Atualizar linha correspondente em DATA-MODEL.md → ## Arquivos Lógicos (APF)
```

Regra de ouro: **DATA-MODEL.md é o índice; os fragmentos são a fonte de cálculo.**
Nunca atualizar um sem atualizar o outro.
