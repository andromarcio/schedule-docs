# Doc Template 📚

Um template moderno, responsivo e profissional para documentação, com topo, menu lateral esquerdo e visual atual.

## ✨ Características

- ✅ **Design Moderno**: UI limpa e profissional com gradientes elegantes
- ✅ **Menu Lateral**: Navegação intuitiva na esquerda com ícones
- ✅ **Modo Escuro**: Toggle entre tema claro e escuro com persistência
- ✅ **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Sem Dependências**: Apenas HTML, CSS e JavaScript puro
- ✅ **Ícones**: Usa Font Awesome para ícones profissionais
- ✅ **Acessível**: Segue práticas de acessibilidade WCAG
- ✅ **Otimizado**: Performance excelente e SEO-friendly

## 🎨 Estrutura

```
doc-template/
├── index.html      # Arquivo principal HTML
├── styles.css      # Estilos CSS com variáveis
├── script.js       # Interatividade e funcionalidades
└── README.md       # Este arquivo
```

## 🚀 Como Usar

### 1. Abrir Localmente

Simplesmente abra o arquivo `index.html` no seu navegador:

```bash
# Opção 1: Abrir direto
open index.html

# Opção 2: Usar um servidor local (recomendado)
python -m http.server 8000
# Ou com Node.js
npx http-server
```

### 2. Customizar Conteúdo

Edite o `index.html` e atualize:

- **Título**: Mude "Doc Template" para seu nome
- **Logo**: Customize a marca na seção de header
- **Menu**: Adicione/remova itens no sidebar
- **Seções**: Adicione suas próprias seções de conteúdo
- **Links**: Atualize os links para GitHub, suporte, etc.

### 3. Customizar Cores

Edite as variáveis CSS no topo de `styles.css`:

```css
:root {
    --primary-color: #6366f1;        /* Cor principal */
    --primary-dark: #4f46e5;         /* Cor escura */
    --primary-light: #818cf8;        /* Cor clara */
    --secondary-color: #ec4899;      /* Cor secundária */
    --text-dark: #1e293b;            /* Texto escuro */
    --text-muted: #64748b;           /* Texto atenuado */
    --bg-white: #ffffff;             /* Fundo branco */
    --bg-light: #f8fafc;             /* Fundo claro */
}
```

## 📱 Responsividade

O template se adapta automaticamente:

- **Desktop** (>768px): Sidebar fixo na esquerda
- **Tablet** (768px-480px): Sidebar mobile com toggle
- **Mobile** (<480px): Layout otimizado com menu hambúrguer

## 🌙 Modo Escuro

- Clique no ícone da lua no header para alternar
- Preferência é salva no `localStorage`
- Persiste entre recargas da página

## 📋 Funcionalidades do JavaScript

- 🌓 Toggle de tema claro/escuro
- 📌 Navegação suave entre seções
- 📱 Menu responsivo com toggle
- 📋 Cópia de blocos de código com um clique
- ⌨️ Navegação por teclado (ESC para fechar menu)
- 🎯 Destaque automático da seção ativa
- ♿ Suporte a acessibilidade

## 🔧 Personalização Avançada

### Adicionar Nova Seção

```html
<section id="minha-secao" class="content-section">
    <h2>Minha Seção</h2>
    <p>Conteúdo aqui...</p>
</section>
```

### Adicionar Item no Menu

```html
<li><a href="#minha-secao" class="nav-item">
    <i class="fas fa-icon"></i> Meu Item
</a></li>
```

### Bloco de Código

```html
<div class="code-block">
    <pre><code>seu código aqui</code></pre>
</div>
```

### Cards de Recursos

```html
<div class="feature-grid">
    <div class="feature-card">
        <i class="fas fa-icon"></i>
        <h3>Título</h3>
        <p>Descrição</p>
    </div>
</div>
```

## 🎯 Ícones Disponíveis

Este template usa [Font Awesome 6.4](https://fontawesome.com/icons). Alguns exemplos:

- `fa-home` - Home
- `fa-book` - Livro
- `fa-code` - Código
- `fa-cogs` - Configurações
- `fa-github` - GitHub
- `fa-moon` - Lua
- `fa-sun` - Sol
- `fa-check` - Check
- `fa-copy` - Copiar

## 📚 SEO

O template é otimizado para SEO:

- ✅ Semântica HTML5 apropriada
- ✅ Meta tags responsivas
- ✅ Estrutura de headings clara
- ✅ URLs amigáveis com `id` nas seções
- ✅ Performance otimizada

## ♿ Acessibilidade

Recursos de acessibilidade inclusos:

- ✅ Navegação por teclado
- ✅ Labels apropriados
- ✅ Contraste de cores WCAG
- ✅ Textos alternativos para ícones
- ✅ Estrutura semântica HTML

## 🚀 Deploy no GitHub Pages

1. Vá para as configurações do repositório
2. Procure por "GitHub Pages"
3. Selecione "Deploy from a branch"
4. Escolha branch `main` e pasta `/ (root)`
5. Salve

Sua documentação estará em: `https://seu-username.github.io/doc-template`

## 🛠️ Browser Support

- ✅ Chrome/Edge (últimas 2 versões)
- ✅ Firefox (últimas 2 versões)
- ✅ Safari (últimas 2 versões)
- ✅ Mobile browsers

## 📝 Licença

Este template é de código aberto e pode ser usado livremente.

## 🤝 Contribuições

Sinta-se livre para fazer fork, melhorar e compartilhar!

---

**Criado com ❤️ para documentação profissional**

Dúvidas? Abra uma [issue](https://github.com/andromarcio/doc-template/issues) no repositório!
