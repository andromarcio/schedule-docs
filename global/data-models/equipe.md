# Data Model: Equipe
> Fragmento do DATA-MODEL.md — cole apenas este arquivo nas sessões
> que envolvam o domínio Equipe.
>
> **ALIs deste domínio**: ALI Equipe
> Detalhes de contagem: seção `## Arquivos Lógicos` no rodapé deste arquivo.

---

## Membro da Equipe
> **ALI: ALI Equipe** · entidade principal

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(255) | sim | Nome completo |
| Telefone | phone | phone | varchar(20) | sim | Formato americano: (XXX) XXX-XXXX |
| Tipo | type | type | enum(FIXO,HELPER) | sim | FIXO=funcionária fixa; HELPER=avulsa |
| Ativo | active | active | boolean | automático | Default true; HELPER sempre true enquanto cadastrado |
| Observações | notes | notes | text | não | Habilidades, restrições, observações |
| Usuário vinculado | userId | user_id | uuid | não | FK → users.id; apenas para membros FIXO que acessam o app |

---

## Disponibilidade
> **ALI: ALI Equipe** · entidade de suporte (registro de disponibilidade diária)

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Membro | memberId | member_id | uuid | sim | FK → membro_equipe.id |
| Data | date | date | date | sim | Data específica do registro |
| Disponível | available | available | boolean | sim | true=disponível; false=indisponível |
| Motivo | reason | reason | text | não | Ex: "consulta médica", "viagem" |

---

## Arquivos Lógicos deste domínio

> DET calculado excluindo os 4 campos globais (id, createdAt, updatedAt, deletedAt).
> Critérios de complexidade: ver `global/SIZING.md`.

| ALI / AIE | Tipo | Entidades constituintes | RET | DET | Complexidade | PF |
|---|---|---|---|---|---|---|
| ALI Equipe | ALI | Membro da Equipe (principal) · Disponibilidade (subgrupo) | 2 | 9 | Baixa | 7 |

**Total deste domínio: 7 PF**

<details>
<summary>Memória de cálculo</summary>

**ALI: Equipe**
- RET: 2 (Membro da Equipe e Disponibilidade como subgrupos)
- DET Membro: name, phone, type, active, notes, userId = 6
- DET Disponibilidade: memberId, date, available, reason = 4 (memberId é DET pois é FK significativa)
- DET total excluindo global: **9** (memberId conta como referência de negócio)
- Complexidade: RET 2 × DET 9 → tabela SIZING.md → **Baixa → 7 PF**

</details>
