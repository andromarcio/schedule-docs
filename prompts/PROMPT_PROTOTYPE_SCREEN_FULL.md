# PROMPT_PROTOTYPE_SCREEN — Protótipos de Estado (N3)

> **Quem participa**: dev / designer / PO técnico
> **Insumo necessário**: DESIGN-SYSTEM.md + N3 da feature
> **Entrega**: um arquivo HTML por estado obrigatório da feature
> (form, loading, empty, error) + estados adicionais identificados no N3
>
> **Pré-requisito**: N3 aprovado (PROMPT_3B concluído)
> **Onde salvar**: `prototypes/[dominio]/[feature-set]/[feature]/[estado].html`

---

## INSTRUÇÕES PARA O CLAUDE

Você vai gerar protótipos HTML de cada estado de tela de uma feature,
seguindo rigorosamente os padrões do DESIGN-SYSTEM.md e as regras
de comportamento descritas no N3.

### Regras de geração

1. **Fidelidade ao Design System**: use exatamente os tokens, componentes
   e padrões definidos no DESIGN-SYSTEM.md. Não invente estilos.
   Sinalize lacunas com `<!-- TODO: definir no Design System -->`.

2. **HTML auto-contido**: CSS e JS inline no mesmo arquivo.
   Sem dependências externas (exceto fontes especificadas no DESIGN-SYSTEM.md).

3. **Um arquivo por estado**: não misture estados em um único arquivo.
   `form.html` mostra apenas o estado de formulário.
   `loading.html` mostra apenas o estado de loading com skeletons.

4. **Campos mapeados do N3**: os campos do formulário devem corresponder
   exatamente aos listados na tabela de campos do N3, usando o Label PO
   como texto do label na tela. Os tipos de input devem refletir o tipo
   do campo (texto → `<input type="text">`, data → date picker, lista de
   opções → `<select>`, sim/não → toggle, arquivo → file input).

5. **Mensagens do N3**: as mensagens de erro, validação e sucesso exibidas
   no protótipo devem ser exatamente as definidas nos cenários Gherkin do N3.
   Não inventar mensagens.

6. **Dados fictícios realistas**: formulários pré-preenchidos, tabelas e listas
   devem ter dados que façam sentido para o domínio. Nunca "Lorem ipsum".

7. **Estado de campos por role**: se o N3 define que um campo é bloqueado
   para um perfil específico, o protótipo deve mostrar essa versão com o
   campo desabilitado e tooltip explicativo.

8. **Anotar o que o HTML não captura**: comportamentos assíncronos,
   validações em tempo real e regras de negócio complexas devem ser
   anotados no painel de notas do protótipo.

---

## CONTEXTO DO PROJETO

=== DESIGN-SYSTEM.md ===
[cole aqui o conteúdo do DESIGN-SYSTEM.md]

=== N3 DA FEATURE ===
[cole aqui o arquivo completo da feature]

---

## PASSO 1 — Mapeamento de estados

Leia o N3 e identifique os estados a gerar. Apresente a lista:

| Arquivo a gerar | Estado | Base no N3 |
|---|---|---|
| `form.html` | Formulário principal | Seção "Campos" + "Comportamento de tela: Loading" |
| `loading.html` | Skeleton de loading | Seção "Comportamento de tela: Loading" |
| `empty.html` | Sem dados | Seção "Comportamento de tela: Empty state" |
| `error.html` | Erro de servidor | Seção "Comportamento de tela: Error state" |
| `modal.html` | Modal (se aplicável) | Seção "Onde fica" |
| `[custom].html` | [estado específico] | Seção "[referência]" |

Pergunte:
> "Os estados mapeados acima estão corretos?
> Qual deles deseja gerar primeiro?"

---

## PASSO 2 — Geração estado a estado

Gere um estado por vez. Após gerar, pergunte se aprova antes de avançar.

### Estrutura base de cada arquivo

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Estado]: [Feature] — [Feature Set]</title>
  <style>
    /* Tokens do Design System */
    :root {
      --color-primary: [do DESIGN-SYSTEM];
      --color-danger: [do DESIGN-SYSTEM];
      --color-success: [do DESIGN-SYSTEM];
      --color-warning: [do DESIGN-SYSTEM];
      --color-neutral: [do DESIGN-SYSTEM];
      --font-body: [do DESIGN-SYSTEM];
      --radius: [do DESIGN-SYSTEM];
      /* ... demais tokens */
    }

    /* Reset e base */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-body); background: #F5F5F5; }

    /* Layout: sidebar + topbar + conteúdo */
    .app-layout { display: flex; height: 100vh; }
    .sidebar { width: 240px; /* ... */ }
    .main { flex: 1; display: flex; flex-direction: column; }
    .topbar { /* ... */ }
    .content { flex: 1; padding: 24px; max-width: 1280px; /* ... */ }

    /* Componentes: botões, inputs, labels, erros, toasts */
    /* Skeleton (apenas em loading.html) */
    /* Empty state (apenas em empty.html) */
    /* Error state (apenas em error.html) */

    /* Painel de notas */
    .prototype-notes { /* ... */ }
    .prototype-badge { /* ... */ }
  </style>
</head>
<body>
  <div class="prototype-badge">🔲 [ESTADO] — Protótipo</div>

  <div class="app-layout">
    <nav class="sidebar">
      <!-- sidebar com item ativo destacado -->
    </nav>
    <div class="main">
      <header class="topbar">
        <!-- breadcrumb: Domínio > Feature Set > Feature -->
      </header>
      <main class="content">
        <!-- conteúdo do estado específico -->
      </main>
    </div>
  </div>

  <div class="prototype-notes">
    <strong>📋 Notas — [Estado]:</strong>
    <ul>
      <li>[comportamento não representável visualmente]</li>
    </ul>
  </div>
</body>
</html>
```

### Padrões por estado

**`form.html`**
- Formulário com todos os campos do N3, labels correspondendo ao Label PO
- Campos obrigatórios com `*` na cor `danger`
- Botão primário à direita do rodapé, cancelar à esquerda
- Dados pré-preenchidos com exemplos realistas
- Mostrar uma mensagem de erro de validação em pelo menos um campo (para referência)

**`loading.html`**
- Substituir todo conteúdo dinâmico por blocos skeleton (fundo cinza, animação pulse)
- Botões e ações desabilitados ou ocultados
- Skeleton com proporções equivalentes ao conteúdo real

**`empty.html`**
- Ícone ilustrativo (pode ser SVG simples)
- Título: o que não foi encontrado
- Descrição: por que está vazio ou o que o usuário pode fazer
- Botão de ação primária (quando aplicável, conforme N3)

**`error.html`**
- Ícone de erro
- Mensagem descritiva (conforme definida no N3, não genérica)
- Botão "Tentar novamente"

**`modal.html`**
- Modal centralizado sobre overlay semitransparente
- Estrutura: título + descrição + ações
- Para modal de exclusão: botão danger + cancelar

---

## PASSO 3 — Geração do README do nível

Após gerar todos os estados aprovados, gere ou atualize o
`prototypes/[dominio]/[feature-set]/[feature]/README.md`
preenchendo a tabela de estados com os arquivos gerados e status `🎨 Mockup`.

---

## PASSO 4 — Entrega

Ao finalizar todos os estados, informe:

> "✅ Protótipos de [feature] gerados.
>
> **Salvar em**: `prototypes/[dominio]/[feature-set]/[feature]/`
>
> **Arquivos gerados**:
> - `form.html` — [estado]
> - `loading.html` — [estado]
> - `empty.html` — [estado]
> - `error.html` — [estado]
>
> **Notas pendentes** (comportamentos não representados):
> - [lista]
>
> **Próximo passo**: PO revisa no browser e atualiza o status
> no README.md para ✅ Aprovado ou solicita ajustes."
