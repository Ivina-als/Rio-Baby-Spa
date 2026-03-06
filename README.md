# 🛁 Rio Baby Spa - Landing Page (SPA Modular)

Este projeto é uma Landing Page desenvolvida para o **Rio Baby Spa**. A arquitetura foi pensada para ser modular e leve, facilitando a futura migração e implementação exclusiva dentro da plataforma **Wix**.

## 🚀 Como Visualizar o Projeto Localmente

Para rodar este projeto, você não precisa de Node.js, NPM ou configurações complexas de servidor.

1. **Requisito**: Ter o [VS Code](https://code.visualstudio.com/) instalado.
2. **Extensão**: Instale a extensão **Live Server** (de Ritwick Dey) no VS Code.
3. **Execução**:
   - Abra a pasta raiz do projeto no VS Code.
   - Clique com o botão direito no arquivo `index.html`.
   - Selecione **"Open with Live Server"**.
   - A página será servida em `http://127.0.0.1:5500`.

> **Nota**: O uso de um servidor (como o Live Server) é obrigatório porque o projeto utiliza **JavaScript Modules (ESM)** e requisições `fetch` para carregar as seções dinamicamente.

---

## 🛠️ Estrutura do Projeto

O código segue o padrão de **Single Page Application (SPA)** manual para garantir organização e performance:

- **`index.html`**: O esqueleto da página com os pontos de injeção (`-root`).
- **`/sections`**: Contém os fragmentos de HTML de cada parte do site (Ex: `services.html`).
- **`/css`**:
  - `global.css`: Reset e estilos base.
  - `colors.css`: Variáveis de cores.
  - `*.css`: Estilos específicos por componente.
- **`/js`**:
  - `main.js`: Gerencia o carregamento assíncrono das seções e o controle de callbacks.
  - `sections/`: Scripts de comportamento específico (Ex: inicialização de carrossel e modais).
  - `utils/`: Utilitários globais.

---

## 💎 Funcionalidades Implementadas

- **Carrossel de Serviços**: Sistema dinâmico com paginação (dots) e suporte a itens desabilitados (pacotes sazonais).
- **Modais Dinâmicos**: Lógica de clique preparada para exibir detalhes dos pacotes sem sobrecarregar o DOM.
- **Performance**:
  - Renderização sob demanda via JavaScript.
  - Uso de imagens em formato `.webp` com `lazy loading` para otimização de banda.

---

## 📝 Observações para Implementação no Wix

Este repositório é uma **base de código fonte pura**. Para a migração:

1. **HTML**: Deve ser transposto para elementos de "Custom Element" ou "Embed HTML" no editor Wix.
2. **CSS**: Pode ser centralizado no CSS Global do site.
3. **JS/Velo**: A lógica de `fetch` das seções pode ser adaptada para o banco de dados (CMS) do Wix para facilitar edição de conteúdos.

---

### 👨‍💻 Desenvolvedor

Projeto estruturado para o **Rio Baby Spa**.
