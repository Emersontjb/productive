# ⚡ Produtive - App de Produtividade

<p align="center">
  <img src="https://img.shields.io/badge/vers%C3%A3o-1.0.0-blue?style=for-the-badge" alt="Versão">
  <img src="https://img.shields.io/badge/licen%C3%A7a-MIT-green?style=for-the-badge" alt="Licença">
  <img src="https://img.shields.io/badge/plataforma-PWA-orange?style=for-the-badge" alt="Plataforma">
</p>

## 📱 Descrição

**Produtive** é um aplicativo de produtividade completo e moderno, desenvolvido com tecnologias web padrão (HTML, CSS e JavaScript). O app funciona como um **PWA (Progressive Web App)**, o que significa que pode ser instalado diretamente no seu dispositivo móvel e usado offline.

### ✨ Funcionalidades Principais

| Módulo | Descrição |
|--------|----------|
| **📝 Tarefas** | Crie, organize e acompanhe suas tarefas diarias com prioridades e filtros |
| **📓 Notas** | Faça anotações rápidas e organize suas ideias |
| **📅 Agenda** | Calendário mensal com eventos e lembretes |

---

## 🚀 Como Usar

### Opção 1: Acessar Online

Simplemente abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Safari, Firefox, Edge).

### Opção 2: Instalar como App

#### No Android (Chrome):
1. Acesse o app pelo navegador Chrome
2. Toque no menu (três pontos)
3. Selecione **"Adicionar à tela inicial"**
4. Confirme a instalação

#### No iOS (Safari):
1. Acesse o app pelo Safari
2. Toque no botão Compartilhar (+)
3. Selecione **"Adicionar à Tela de Início"**
4. Confirme a instalação

#### No Computador:
1. Abra o arquivo `index.html` no navegador
2. Para instalar: clique no ícone de install na barra de endereço (Chrome)

---

## 💻 Desenvolvimento

### Estrutura de Arquivos

```
produtive/
├── index.html      # Estrutura principal do app
├── styles.css    # Estilos e design visual
├── app.js       # Lógica e funcionalidades
├── manifest.json # Configuração PWA
├── sw.js        # Service Worker (offline)
└── README.md    # Este arquivo
```

### Tecnologias Usadas

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilos e animações |
| **JavaScript** | Lógica e interactivity |
| **localStorage** | Armazenamento de dados |
| **PWA** | Funcionalidades offline |

### Pré-requisitos

- Navegador moderno (Chrome 80+, Firefox 75+, Safari, Edge)
- Não requer servidor ou backend
- Funciona sem internet (após primeiro acesso)

---

## 🔧 Configuração do Ambiente de Desenvolvimento

### Executando Localmente

#### Com Python (recomendado):
```bash
# Navegue até a pasta do projeto
cd productive

# Inicie o servidor
python3 -m http.server 3000

# Acesse no navegador
# http://localhost:3000
```

#### Com Node.js:
```bash
# Navegue até a pasta do projeto
cd productive

# Instale as dependências
npm install

# Inicie o servidor
node server.js

# Acesse no navegador
# http://localhost:3000
```

#### Com Live Server (VS Code):
1. Instale a extensão "Live Server"
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

---

## 📖 Documentação Técnica

### Sistema de Armazenamento

Os dados são salvos no **localStorage** do navegador - um armazenamento persistente que mantém os dados mesmo após fechar o navegador ou desligar o dispositivo.

#### Estrutura dos Dados:

```javascript
// Tarefas
{
  titulo: "string",       // Nome da tarefa
  data: "YYYY-MM-DD",   // Data para conclusão
  prioridade: "",     // "baixa", "média", "alta" ou ""
  completed: false     // true/false
}

// Notas
{
  titulo: "string",    // Título da nota
  conteudo: "string",  // Texto da nota
  data: "ISO Date"   // Data de criação
}

// Eventos
{
  titulo: "string",    // Nome do evento
  data: "YYYY-MM-DD", // Data do evento
  hora: "HH:MM"    // Horário do evento
}
```

### PWA (Progressive Web App)

O app usa service workers para funcionar offline:

1. **Cache**: Arquivos são salvos localmente na primeira visita
2. **Offline**: O app funciona sem internet
3. **Install**: Pode ser instalado como app nativo

#### Atualizando o App

Para atualizar o app após mudanças no código:

1. Incremente a versão em `sw.js` (CACHE_NAME)
2. Os usuários farão download automatico na próxima visita

---

## 🎨 Design System

### Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Primária | `#6366f1` | Botões, links, destaques |
| Primária Escura | `#4f46e5` | Hover, estados ativos |
| Secundária | `#10b981` | Sucesso, eventos |
| Perigo | `#ef4444` | Erro, excluir |
| Aviso | `#f59e0b` | Atenção, prioridade média |
| Fundo | `#f8fafc` | Fundo principal |
| Texto | `#1e293b` | Texto principal |
| Texto Claro | `#64748b` | Texto secundário |

### Tipografia

- **Fonte do Sistema**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Títulos**: 1.25rem - 1.5rem
- **Corpo**: 0.85rem - 1rem

### Layout

- Largura máxima: 600px (centro da tela)
- Breakpoint mobile: 480px
- Padding: 1rem (desktop), 0.75rem (mobile)
- Border-radius: 8px - 16px

---

## 📝 Lista de Tarefas de Desenvolvimento

- [x] Estrutura HTML
- [x] Estilização CSS
- [x] Sistema de tarefas
- [x] Sistema de notas
- [x] Calendário
- [x] PWA manifest
- [x] Service Worker
- [x] Documentação

---

## 🤝 Contribuindo

Sinta-se livre para contribuir! Para contribuir:

1. Fork este repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

## 🏆 Créditos

Desenvolvido com ❤️ para melhorar sua produtividade.

---

## ❓ Perguntas Frequentes

### Posso usar offline?
Sim! O app funciona offline após o primeiro acesso. Os dados ficam salvos no seu navegador.

### Meus dados estão seguros?
Sim! Todos os dados são armazenados localmente no seu dispositivo. Não enviamos nenhum dado para servidores externos.

### Posso personalizar o app?
Sim! Você pode modificar as cores no arquivo `styles.css` alterando as variáveis CSS na seção `:root`.

### Funciona no iOS?
Sim! Use o Safari para melhor compatibilidade. Toque em Compartilhar > "Adicionar à Tela de Início".

### Como fazer backup dos dados?
Os dados ficam no navegador. Para fazer backup, você pode:
1. Exportar os dados via extensão de navegador
2.手动mente copiar do localStorage

### Posso sincronizar entre dispositivos?
Atualmente não. O app salva dados localmente. Para sincronização, seria necessário um backend com banco de dados.

---

<p align="center">
  Feito com ❤️ por Produtive
</p>