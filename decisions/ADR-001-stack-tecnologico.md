# ADR-001: Escolha da Stack Tecnológica do CleanSched

**Status**: Aceito
**Data**: 2026-05-31
**Autor**: Proposta inicial

---

## Contexto e problema

O CleanSched é um sistema operacional para uma microempresa de limpeza residencial com 1 gerente e de 3 a 5 membros de equipe. O sistema precisa:
- Funcionar bem no celular (uso principal em campo)
- Ter custo de infraestrutura baixo
- Ser desenvolvido e mantido por uma equipe pequena
- Ser simples de operar (sem necessidade de administração técnica constante)

---

## Decisão

Adotar a seguinte stack:

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend | React 18 + Tailwind CSS + TypeScript | Ecossistema maduro, PWA nativo, grande comunidade |
| Backend | Node.js + Express + TypeScript | Simplicidade, mesma linguagem no full-stack, reduz contexto de troca |
| ORM | Prisma | Type-safe, migrations automáticas, excelente DX |
| Banco | PostgreSQL 15 | Confiável, suportado nativamente pelo Railway |
| Auth | JWT (access + refresh token) | Sem necessidade de OAuth; app privado e controlado |
| Deploy | Railway (API + banco) + Vercel (frontend) | Custo baixo, zero-ops, deploy via git push |
| PWA | Vite PWA Plugin | Instalação no celular sem app store |

---

## Alternativas consideradas

### Alternativa A: Next.js full-stack (monorepo)
- **Prós**: Menos repos, SSR nativo, API Routes integradas
- **Contras**: Mais complexidade de deploy para app mobile-first; overhead de SSR desnecessário para esta app SPA

### Alternativa B: Firebase (BaaS)
- **Prós**: Zero backend a manter, auth e realtime prontos
- **Contras**: Vendor lock-in severo; custo imprevisível com crescimento; menos flexibilidade nas regras de negócio; migração futura muito custosa

### Alternativa C: Flutter (app nativo)
- **Prós**: Experiência mobile superior
- **Contras**: Publicação em app stores; custo de desenvolver iOS + Android; complexidade muito maior para o escopo atual

---

## Consequências

### Positivas
- Stack dominante no mercado — fácil de encontrar devs
- Railway + Vercel oferecem tier gratuito suficiente para o volume inicial
- TypeScript no backend e frontend reduz bugs de contrato entre camadas
- PWA permite "instalar" no celular da gerente e das membros sem app store

### Negativas
- Express é menos opinionado que Fastify ou NestJS — requer mais disciplina na organização do código
- Sem realtime nativo — atualizações da agenda requerem refresh manual (aceitável para o escopo atual)

### Riscos
- Railway pode ter indisponibilidade ocasional — aceitável para um app operacional não-crítico
- A gerente precisará de um tutorial mínimo para instalar o PWA no iPhone (não é automático como na Play Store)

---

## Impacto nos artefatos

| Artefato | Impacto |
|---|---|
| `global/MASTER.md` | Stack documentada |
| `repos/INDEX.md` | Três repositórios: cleansched-api, cleansched-web, cleansched-docs |
| Todos os N3 (seção dev-only) | Arquivos seguem estrutura de pastas definida no MASTER.md |

---

## Notas adicionais

- A decisão de não usar OAuth (Google/Apple) é intencional: o app é privado, com número controlado de usuários, e o fluxo de convite+senha é suficiente.
- Caso o negócio cresça para múltiplos times/empresas, multitenancy pode ser adicionado posteriormente sem mudar a stack.
- Avaliar o uso de Socket.io para notificações em tempo real quando o número de membros crescer.
