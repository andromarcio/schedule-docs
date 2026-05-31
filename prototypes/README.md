# Protótipos

Diretório central de protótipos visuais do sistema.
Espelha a estrutura de Feature Sets (N2) e features (N3) dos módulos,
mantendo spec e protótipo sempre no mesmo repositório e no mesmo contexto.

---

## Propósito por nível

| Nível | O que armazena | Gerado por |
|---|---|---|
| Feature Set (N2) | Protótipo de **fluxo** — como as telas se conectam e a jornada completa | PROMPT_PROTOTYPE_FLOW ou ferramenta externa |
| Feature (N3) | Protótipos de **estado** — uma tela por estado obrigatório (form, loading, empty, error, success) | PROMPT_PROTOTYPE_SCREEN ou ferramenta externa |

---

## Formatos suportados

| Formato | Extensão | Quando usar |
|---|---|---|
| HTML gerado | `.html` | Protótipo funcional gerado pelo Claude a partir do N3 + Design System; navegável no browser sem dependência de ferramenta |
| Imagem estática | `.png` `.jpg` `.svg` | Sketch em papel fotografado, export do Figma, Excalidraw, Whimsical ou similar |
| Link externo | entrada no README.md do nível | Figma embed, Marvel, InVision ou qualquer ferramenta com URL pública |

Ambos os formatos convivem no mesmo diretório — não há exclusividade.

---

## Estrutura de pastas

```
prototypes/
├── README.md                               ← este arquivo
├── _template/                              ← copie para criar novos
│   └── _template-feature-set/
│       ├── README.md                       ← índice de fluxo (N2)
│       └── _template-feature/
│           ├── README.md                   ← índice de estados (N3)
│           └── assets/                     ← imagens referenciadas nos HTMLs
└── [dominio]/
    └── [feature-set]/
        ├── README.md                       ← índice de fluxo + link para spec N2
        ├── flow.html                       ← protótipo de fluxo gerado
        ├── flow.png                        ← protótipo de fluxo como imagem
        └── [feature]/
            ├── README.md                   ← índice de estados + link para spec N3
            ├── form.html                   ← estado principal / formulário
            ├── loading.html                ← estado de loading (skeleton)
            ├── empty.html                  ← empty state
            ├── error.html                  ← error state
            ├── success.html                ← feedback de sucesso (se página própria)
            ├── modal.html                  ← modal (se a feature usa modal)
            └── assets/
                └── [imagens usadas nos HTMLs]
```

---

## Nomenclatura de arquivos

| Arquivo | Conteúdo |
|---|---|
| `flow.html` / `flow.png` | Fluxo completo do Feature Set |
| `form.html` | Tela principal com formulário preenchível |
| `loading.html` | Tela com skeletons no lugar do conteúdo |
| `empty.html` | Tela sem dados — empty state com ação |
| `error.html` | Tela com error state e botão de retry |
| `success.html` | Tela de confirmação (quando não for toast) |
| `modal.html` | Modal isolado (criação rápida, confirmação de exclusão) |
| `detail.html` | Tela de detalhe de um registro |
| `[custom].html` | Estado específico da feature — descrever no README.md do nível |

---

## Status de fidelidade

Cada protótipo tem um status que indica o nível de detalhe:

| Status | Ícone | Descrição |
|---|---|---|
| Sketch | ✏️ | Rascunho em papel ou wireframe de baixa fidelidade |
| Wireframe | 🔲 | Estrutura e layout sem estilo visual |
| Mockup | 🎨 | Aplicação do Design System — cores, tipografia, componentes |
| Aprovado | ✅ | Validado pelo PO e alinhado com o N3 |
| Desatualizado | ⚠️ | Spec do N3 foi atualizada — protótipo precisa de revisão |

---

## Workflow

```
N3 negocial aprovado
        │
        ▼
PROMPT_PROTOTYPE_SCREEN
        │
        ├─→ Gera .html para cada estado obrigatório
        │   (form, loading, empty, error)
        │
        └─→ Atualiza README.md do nível com status "🎨 Mockup"
                │
                ▼
        PO revisa no browser
                │
                ▼
        Aprovado → status "✅ Aprovado"
        Ajuste   → editar .html + PROMPT_PROTOTYPE_SCREEN novamente
```

---

## Quando usar imagem em vez de HTML

Use imagem (`.png`) quando:
- O protótipo foi criado em Figma, Excalidraw, Whimsical ou ferramenta similar
- O design tem elementos visuais complexos (ilustrações, ícones customizados) que HTML simples não reproduz bem
- É um sketch de ideação rápida — não vale gerar HTML ainda

Use HTML quando:
- Quer que o PO interaja (clicar, preencher campos, ver estados diferentes)
- Quer que o dev use como referência direta de markup e classes CSS
- Quer rastrear o protótipo no git junto com a spec

---

## Relação com a spec

| Arquivo de spec | Arquivo de protótipo |
|---|---|
| `modules/[dom]/[fs]/README.md` (N2) | `prototypes/[dom]/[fs]/README.md` + `flow.html` |
| `modules/[dom]/[fs]/[feat].md` (N3) | `prototypes/[dom]/[fs]/[feat]/README.md` + `[estado].html` |

Quando o N3 é atualizado (via PROMPT_4A/4B), o status do protótipo
correspondente deve ser marcado como ⚠️ Desatualizado até que seja revisado.

---

## Prompts disponíveis

| Prompt | O que gera |
|---|---|
| `prompts/PROMPT_PROTOTYPE_FLOW.md` | Protótipo de fluxo a partir do N2 |
| `prompts/PROMPT_PROTOTYPE_SCREEN.md` | Protótipos de estado a partir do N3 |

---

## Comparação entre os quatro prompts

| | FLOW_FULL | FLOW_COMPONENT | SCREEN_FULL | SCREEN_COMPONENT |
|---|---|---|---|---|
| **O que gera** | Fluxo entre telas | Fluxo entre áreas | Estados isolados | Estados isolados |
| **Tem sidebar/topbar** | ✅ Sim | ❌ Não | ✅ Sim | ❌ Não |
| **Dados de entrada** | N2 | N2 | N3 | N3 |
| **Arquivo de saída** | `flow.html` | `flow-component.html` | `[estado].html` | `[estado]-component.html` |
| **Melhor para** | Apresentação ao cliente | Validação rápida de fluxo | Demo completa | Referência de markup para dev |
| **Declara dependências** | ❌ | ✅ (notas) | ❌ | ✅ (seção dedicada) |
| **Tempo de geração** | Maior | Menor | Maior | Menor |

### Quando usar cada um

**FLOW_FULL** → apresentação de sprint, demo para stakeholder, validar navegação com contexto completo da aplicação.

**FLOW_COMPONENT** → iteração rápida com o PO, validar se a sequência de telas faz sentido sem se preocupar com o visual do shell.

**SCREEN_FULL** → demo de uma feature completa, tela que será fotografada para apresentação ou manual de usuário.

**SCREEN_COMPONENT** → referência de markup para o dev implementar, embutir em Storybook, comparar variações de um mesmo estado.
