# DATA-MODEL.md
> **Índice e fonte de verdade** para nomenclatura e mapeamento de campos.
> Os modelos detalhados estão fragmentados por domínio em `global/data-models/`
> para otimizar o contexto enviado ao LLM — cole apenas o fragmento do
> domínio que está sendo trabalhado, não o arquivo inteiro.
>
> Os N3 referenciam com: `→ ver DATA-MODEL.md: Entidade [Nome]`
> Os N3 **nunca** duplicam Label Dev ou campo banco em suas tabelas.

---

## Convenção de nomenclatura

| Camada | Convenção | Exemplo | Onde aparece |
|---|---|---|---|
| Label PO | Português, title case, sem jargão | `Nome completo` | N3 (campos), Gherkin, telas |
| Label Dev | camelCase, inglês, autoexplicativo | `fullName` | **data-models/[dominio].md** — apenas aqui |
| Campo banco | [CONVENÇÃO DA ORGANIZAÇÃO] | `full_name` | **data-models/[dominio].md** — apenas aqui |

> ⚠️ Informe aqui a convenção de banco de dados da sua organização.

---

## Campos globais (presentes em todas as tabelas)

Estão implícitos — não precisam ser listados nos arquivos de domínio.

| Label PO | Label Dev | Campo banco | Tipo SQL | Notas |
|---|---|---|---|---|
| Identificador | id | id | uuid | PK; gerado automaticamente |
| Organização | organizationId | organization_id | uuid | FK → organizations; multitenancy |
| Data de criação | createdAt | created_at | timestamptz | Gerado automaticamente |
| Data de atualização | updatedAt | updated_at | timestamptz | Atualizado automaticamente |
| Data de exclusão | deletedAt | deleted_at | timestamptz | Soft delete; null = ativo |

---

## Modelos por domínio

| Domínio | Arquivo | Entidades |
|---|---|---|
| Identity | [data-models/identity.md](./data-models/identity.md) | Organization, User, AuditLog |
| Contacts | [data-models/contacts.md](./data-models/contacts.md) | Contact, Tag, SmartList, ImportJob |
| Communication | [data-models/communication.md](./data-models/communication.md) | Message, EmailTemplate, WhatsAppConversation |
| Work | [data-models/work.md](./data-models/work.md) | Task, Notification |
| Capture | [data-models/capture.md](./data-models/capture.md) | Form, FormSubmission |

---

## Enums do sistema

| Enum | Campo banco | Valores | Usado em |
|---|---|---|---|
| Role | role | admin, agent, viewer | User.role |
| Provider | provider | local, google | User.provider |
| ContactSource | source | manual, form, import, api | Contact.source |
| MessageChannel | channel | email, sms, whatsapp | Message.channel |
| MessageStatus | status | pending, sent, delivered, failed | Message.status |
| TaskStatus | status | open, in_progress, done, cancelled | Task.status |
| TaskPriority | priority | low, medium, high | Task.priority |
| ImportJobStatus | status | pending, processing, done, failed | ImportJob.status |

---

## Campos adicionados recentemente

| Data | Entidade | Label PO | Label Dev | Campo banco | Tipo | N3 de origem |
|---|---|---|---|---|---|---|
| [data] | [entidade] | [label PO] | [camelCase] | [snake_case] | [tipo] | [link] |

---

## Relacionamentos

```
Organization 1──N User
Organization 1──N Contact
Organization 1──N Tag
Organization 1──N SmartList
Organization 1──N Form
Organization 1──N ImportJob

User (owner)    1──N Contact
User (assigned) 1──N Task
User            1──N Message (remetente)
User            1──N Notification

Contact N──N Tag (via Contact.tags[])
Contact 1──N Message
Contact 1──N Task
Contact 1──N FormSubmission

Form     1──N FormSubmission
ImportJob 1──N Contact (criados pela importação)
```

---

## Índices e restrições de unicidade

| Tabela | Campos | Tipo | Justificativa |
|---|---|---|---|
| users | (organization_id, email) | UNIQUE | E-mail único por organização |
| contacts | (organization_id, email) | UNIQUE partial (IS NOT NULL) | E-mail único por organização |
| tags | (organization_id, name) | UNIQUE | Tag única por organização |
| smart_lists | (organization_id, name) | UNIQUE | Nome de lista único por organização |
| forms | (organization_id, slug) | UNIQUE | Slug único por organização |
| organizations | (slug) | UNIQUE | Slug único global |
| contacts | (organization_id) | INDEX | Listagens frequentes |
| tasks | (organization_id, assigned_to) | INDEX | Filtro por responsável |
| messages | (organization_id, contact_id) | INDEX | Histórico por contato |

---

## Arquivos Lógicos (APF)

> Registro central de ALIs e AIEs do sistema.
> Mantido via atualização dos fragmentos `global/data-models/[dominio].md`.
> A contagem de DET **exclui** os 5 campos globais (id, organizationId, createdAt, updatedAt, deletedAt).
> Critérios de complexidade: ver `global/SIZING.md`.

### ALIs — Arquivos Lógicos Internos

| ALI | Domínio | Entidades constituintes | RET | DET | Complexidade | PF |
|---|---|---|---|---|---|---|
| [Nome do ALI] | [Domínio] | [Entidade1], [Entidade2] | [N] | [N] | Baixa / Média / Alta | [7/10/15] |

**Total ALIs: [N] PF**

### AIEs — Arquivos de Interface Externa

| AIE | Sistema externo | Entidades / estruturas usadas | RET | DET | Complexidade | PF |
|---|---|---|---|---|---|---|
| [Nome da AIE] | [ex: SendGrid, Twilio] | [estrutura de dados] | [N] | [N] | Baixa / Média / Alta | [5/7/10] |

**Total AIEs: [N] PF**

---

> ℹ️ **Como manter esta seção**
> 1. Ao criar ou alterar uma entidade num fragmento `data-models/[dominio].md`,
>    atualize a linha do ALI correspondente (RET, DET, Complexidade, PF).
> 2. Se uma nova entidade formar um ALI novo, adicione a linha aqui
>    **e** anote o ALI no cabeçalho da entidade no fragmento do domínio.
> 3. Entidades de suporte (tabelas de junção, tabelas de auditoria) geralmente
>    não formam ALI próprio — pertencem ao ALI da entidade principal.
