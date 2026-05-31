# DESIGN-SYSTEM.md
> Padrões de interface e componentes. Cole em sessões que envolvam
> criação ou alteração de telas.

---

## Layout geral

- **Sidebar**: fixa à esquerda, [largura]px, colapsável
- **Topbar**: breadcrumb + busca global + avatar do usuário
- **Área de conteúdo**: padding [valor]px; max-width [valor]px
- **Grid**: [descrever sistema de grid utilizado]

---

## Paleta de cores

| Token | Valor | Uso |
|---|---|---|
| `primary` | [ex: #2563EB] | Botão primário, links, destaques |
| `danger` | [ex: #DC2626] | Erros, exclusão, alertas críticos |
| `warning` | [ex: #D97706] | Avisos, atenção |
| `success` | [ex: #16A34A] | Confirmações, status positivo |
| `neutral` | [ex: #6B7280] | Textos secundários, bordas |

---

## Tipografia

| Elemento | Fonte | Tamanho | Peso |
|---|---|---|---|
| Título de página | [fonte] | [tamanho] | [peso] |
| Subtítulo | [fonte] | [tamanho] | [peso] |
| Corpo | [fonte] | [tamanho] | [peso] |
| Label de campo | [fonte] | [tamanho] | [peso] |
| Mensagem de erro | [fonte] | [tamanho] | [peso] |

---

## Componentes padrão

> Sempre usar componentes de `/components/ui` — nunca criar inline.

### Botões
| Variante | Uso | Posição padrão |
|---|---|---|
| Primary | Ação principal | Direita do rodapé do formulário |
| Secondary | Ação secundária | À esquerda do Primary |
| Ghost / Cancel | Cancelar ou descartar | À esquerda do Secondary |
| Danger | Excluir, desativar | Separado das demais ações |

### Formulários
- Label sempre **acima** do campo
- Campos obrigatórios marcados com `*` na cor `danger`
- Mensagem de erro exibida **abaixo** do campo, na cor `danger`
- Placeholder apenas para exemplificar formato — nunca substituir label
- Campos desabilitados com opacidade reduzida e cursor `not-allowed`

### Tabelas e listas
- Coluna de ações sempre na **última coluna**
- Linha clicável leva ao detalhe do registro
- Paginação no **rodapé** da tabela

### Modais
- Confirmação de exclusão: **sempre modal** — nunca `confirm()` nativo
- Estrutura: título + descrição + botão de ação (danger) + botão cancelar
- Fechar com ESC ou clique fora da área

### Toasts / Notificações
- Posição: [ex: canto superior direito]
- Duração: [ex: 5 segundos] para sucesso; [ex: persistente] para erro
- Nunca usar `alert()` nativo

---

## Estados obrigatórios de tela

Todo módulo deve tratar e exibir os quatro estados abaixo.

### Loading
- Usar **skeleton** no lugar do conteúdo que está carregando
- Nunca usar spinner genérico isolado
- Blocos de skeleton com a mesma proporção do conteúdo real

### Empty state
- Ícone ilustrativo + título + descrição + botão de ação (quando aplicável)

### Error state
- Ícone de erro + mensagem descritiva + botão "Tentar novamente"

### Success
- Toast com mensagem de confirmação
- Nunca redirecionar sem feedback visual

---

## Padrões de navegação

- Breadcrumb atualizado em toda navegação
- URL sempre reflete o estado atual (filtros, tabs, modal aberto)
- Botão Voltar do browser deve funcionar corretamente
- Links externos sempre abrem em nova aba

---

## Acessibilidade (mínimo obrigatório)

- Todo campo de formulário com `label` associado via `for`/`id`
- Imagens com `alt` descritivo
- Ícones de ação com `aria-label`
- Contraste mínimo de 4.5:1 para textos
- Navegação completa por teclado em formulários e modais
