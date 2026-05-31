# Data Model: Clientes e Imóveis
> Fragmento do DATA-MODEL.md — cole apenas este arquivo nas sessões
> que envolvam o domínio Clientes e Imóveis.
>
> **ALIs deste domínio**: ALI Clientes e Imóveis
> Detalhes de contagem: seção `## Arquivos Lógicos` no rodapé deste arquivo.

---

## Cliente
> **ALI: ALI Clientes e Imóveis** · entidade principal

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(255) | sim | Nome completo ou apelido do responsável |
| Telefone | phone | phone | varchar(20) | sim | Formato americano: (XXX) XXX-XXXX |
| E-mail | email | email | varchar(255) | não | Para envio de confirmações futuras |
| Observações | notes | notes | text | não | Instruções especiais, preferências |
| Ativo | active | active | boolean | automático | Default true; false = inativado |

---

## Imóvel
> **ALI: ALI Clientes e Imóveis** · entidade de suporte (imóvel vinculado ao cliente)

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Apelido | nickname | nickname | varchar(100) | sim | Ex: "Casa da Maria — Oak St" |
| Endereço completo | address | address | varchar(500) | sim | Rua, número, cidade, estado, ZIP |
| Tamanho | size | size | enum(P,M,G) | sim | P=pequena, M=média, G=grande |
| Frequência | frequency | frequency | enum(SEMANAL,QUINZENAL,MENSAL) | sim | Frequência de limpeza contratada |
| Observações | notes | notes | text | não | Acesso, chaves, animais, etc. |
| Ativo | active | active | boolean | automático | Default true; false = não gera agenda |
| Última limpeza | lastCleanedAt | last_cleaned_at | date | automático | Atualizado ao confirmar agenda |
| Cliente | clientId | client_id | uuid | sim | FK → clientes.id |

---

## Arquivos Lógicos deste domínio

> DET calculado excluindo os 4 campos globais (id, createdAt, updatedAt, deletedAt).
> Critérios de complexidade: ver `global/SIZING.md`.

| ALI / AIE | Tipo | Entidades constituintes | RET | DET | Complexidade | PF |
|---|---|---|---|---|---|---|
| ALI Clientes e Imóveis | ALI | Cliente (principal) · Imóvel (subgrupo) | 2 | 13 | Média | 10 |

**Total deste domínio: 10 PF**

<details>
<summary>Memória de cálculo</summary>

**ALI: Clientes e Imóveis**
- RET: 2 (Cliente e Imóvel formam subgrupos distintos)
- DET Cliente: name, phone, email, notes, active = 5
- DET Imóvel: nickname, address, size, frequency, notes, active, lastCleanedAt, clientId = 8
- DET total: **13**
- Complexidade: RET 2 × DET 13 → tabela SIZING.md → **Média → 10 PF**

</details>
