# ERROR-DICTIONARY.md
> Dicionário centralizado de códigos de erro de API do CleanSched.
> Todo novo código de erro criado durante a especificação técnica (N3)
> deve ser registrado aqui para evitar duplicidade de chaves e garantir
> consistência no frontend.
>
> Padrão: `[DOMINIO]_[DESCRICAO]` em SCREAMING_SNAKE_CASE
>
> **Como referenciar nos N3**:
> No Mapeamento de erros (seção dev-only), cite a chave:
> `→ ver ERROR-DICTIONARY: CLIENTE_NOT_FOUND`

---

## 1. Erros globais (qualquer rota)

| Código de erro | HTTP | Situação |
|---|---|---|
| `AUTH_UNAUTHENTICATED` | 401 | Token ausente ou assinatura inválida |
| `AUTH_TOKEN_EXPIRED` | 401 | Token válido, mas expirado — renovar via refresh |
| `AUTH_FORBIDDEN` | 403 | Usuário autenticado, mas sem permissão para a ação |
| `VALIDATION_ERROR` | 422 | Um ou mais campos no body/query são inválidos (ver `details`) |
| `RESOURCE_NOT_FOUND` | 404 | Registro não existe ou foi excluído (soft delete) |
| `INTERNAL_ERROR` | 500 | Falha genérica de servidor — nunca expor stack trace |

---

## 2. Erros de Clientes e Imóveis

| Código de erro | HTTP | Situação |
|---|---|---|
| `CLIENTE_NOT_FOUND` | 404 | Cliente não existe ou foi excluído |
| `CLIENTE_JA_INATIVO` | 422 | Tentativa de inativar cliente já inativo |
| `CLIENTE_TEM_IMOVEIS_ATIVOS` | 422 | Inativação negada — cliente tem imóveis ativos (deve inativar imóveis primeiro, ou a inativação é em cascata conforme regra) |
| `IMOVEL_NOT_FOUND` | 404 | Imóvel não existe ou foi excluído |
| `IMOVEL_JA_INATIVO` | 422 | Tentativa de inativar imóvel já inativo |
| `IMOVEL_COM_AGENDA_FUTURA` | 422 | Inativação bloqueada — imóvel possui itens de agenda em datas futuras ainda não concluídos |

---

## 3. Erros de Equipe

| Código de erro | HTTP | Situação |
|---|---|---|
| `MEMBRO_NOT_FOUND` | 404 | Membro não existe ou foi excluído |
| `MEMBRO_JA_INATIVO` | 422 | Tentativa de inativar membro já inativo |
| `MEMBRO_INDISPONIVEL` | 422 | Membro possui registro de indisponibilidade na data solicitada |
| `DISPONIBILIDADE_DUPLICADA` | 409 | Já existe registro de disponibilidade para este membro nesta data |
| `DISPONIBILIDADE_NOT_FOUND` | 404 | Registro de disponibilidade não encontrado |
| `MEMBRO_SEM_USUARIO` | 422 | Operação requer usuário vinculado ao membro |

---

## 4. Erros de Agendamento

| Código de erro | HTTP | Situação |
|---|---|---|
| `AGENDA_NOT_FOUND` | 404 | Agenda semanal não encontrada |
| `AGENDA_JA_CONFIRMADA` | 422 | Tentativa de alterar agenda com status CONFIRMADA |
| `AGENDA_JA_EXISTE` | 409 | Já existe agenda para a semana informada |
| `AGENDA_LIMITE_DIA_EXCEDIDO` | 422 | Dia já possui 5 imóveis agendados (limite máximo) |
| `AGENDA_IMOVEL_JA_AGENDADO` | 409 | Imóvel já está presente na agenda desta semana |
| `AGENDA_ITEM_NOT_FOUND` | 404 | Item de agenda não encontrado |
| `AGENDA_ITEM_SEM_LIDER` | 422 | Confirmação bloqueada — item de agenda sem membro com função LIDER atribuído |
| `AGENDA_DATA_INVALIDA` | 422 | Data de limpeza não pertence à semana da agenda (segunda a sexta) |

---

## 5. Erros de Autenticação (Identity)

| Código de erro | HTTP | Situação |
|---|---|---|
| `AUTH_INVALID_CREDENTIALS` | 401 | E-mail e/ou senha incorretos |
| `AUTH_USER_DISABLED` | 403 | Conta de usuário inativa |
| `AUTH_USER_NOT_FOUND` | 404 | Usuário não encontrado |
