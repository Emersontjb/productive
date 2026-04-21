# 📚 Documentação Técnica Completa

## Visão Geral do Projeto

### O que é o Produtive?

O **Produtive** é um aplicativo de produtividade pessoais desenvolvido como PWA (Progressive Web App). Ele combina três ferramentas essenciais de produtividade em um único app:

1. **Gerenciador de Tarefas (To-Do)**: Para organizar o que você precisa fazer
2. **Notas**: Para capturar ideias e informações importantes
3. **Agenda**: Para visualizar eventos e compromissos em um calendário

### Por que PWA?

Um PWA (Progressive Web App) é um tipo de aplicação web que usa tecnologias modernas para oferecer uma experiência semelhante a um app nativo. Vantagens:

- **Instalável**: Pode ser adicionado à tela inicial do celular
- **Offline**: Funciona sem internet
- **Rápido**: Carrega instantaneamente após a primeira visita
- **Multi-plataforma**: Funciona em Android, iOS e desktop
- **Sem lojas**: Não precisa baixar da App Store ou Play Store

---

## Arquitetura do Código

### Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                      Interface (HTML)                       │
│  ├── Header (navegação entre abas)                         │
│  ├── Tarefas (lista de tarefas)                            │
│  ├── Notas (grid de notas)                                  │
│  └── Agenda (calendário + eventos)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   JavaScript (app.js)                        │
│  ├── renderTarefas()      → desenha tarefas na tela        │
│  ├── renderNotas()        → desenha notas na tela          │
│  ├── renderCalendar()     → desenha calendário             │
│  ├── openModal()          → abre formulário                │
│  └── saveData()           → salva no localStorage          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  localStorage (Navegador)                   │
│  ├── tarefas  → JSON array de tarefas                      │
│  ├── notas    → JSON array de notas                        │
│  └── eventos  → JSON array de eventos                      │
└─────────────────────────────────────────────────────────────┘
```

### Descrição dos Arquivos

#### index.html
O arquivo HTML principal que define a estrutura visual do app. Contém:
- Elementos de navegação (tabs)
- Containers para listas de tarefas, notas e calendário
- Modal para formulários
- Referências aos arquivos CSS e JavaScript

#### styles.css
Define toda a aparência visual:
- Sistema de cores (CSS Variables)
- Layout responsivo
- Animações e transições
- Estilos para cada componente

#### app.js
Contém toda a lógica de programação:
- Gerenciamento de dados (CRUD)
- Renderização de elementos
- Tratamento de eventos (cliques, envios de formulário)
- Comunicação com localStorage

#### manifest.json
Arquivo de configuração PWA:
- Nome e descrição do app
- Ícones
- Cor do tema
- Modo de exibição

#### sw.js
Service Worker:
- Cache de arquivos para funcionamento offline
- Gerenciamento de版本

---

## Detalhes de Implementação

### Sistema de Tarefas

#### Estrutura de Dados
```javascript
{
  titulo: "Comprar pão",      // Texto da tarefa
  data: "2026-04-25",        // Data para completar
  prioridade: "alta",        // "baixa" | "média" | "alta" | ""
  completed: false           // Status de conclusão
}
```

#### Funcionalidades
- **Criar**: Botão "+ Nova Tarefa" abre modal
- **Ler**: Lista ordenada por data
- **Atualizar**: Clique no círculo para marcar como concluída
- **Excluir**: Botão de lixeira

#### Filtros
- `all`: Todas as tarefas
- `pending`: Apenas pendentes
- `completed`: Apenas concluídas

### Sistema de Notas

#### Estrutura de Dados
```javascript
{
  titulo: "Ideias para projeto",     // Título
  conteudo: "1. Feature X\n2....",   // Conteúdo
  data: "2026-04-21T10:30:00.000Z"   // Timestamp
}
```

#### Funcionalidades
- **Criar**: Botão "+ Nova Nota"
- **Visualizar**: Grid de cards com preview
- **Editar**: Clique no card abre modal de edição
- **Excluir**: Botão no modal de edição

### Sistema de Agenda

#### Estrutura de Dados
```javascript
{
  titulo: "Reunião equipe",   // Nome do evento
  data: "2026-04-25",         // Data do evento
  hora: "14:30"              // Horário
}
```

#### Funcionalidades
- **Calendário Mensal**: Navegação entre meses
- **Indicador de Eventos**: Pontinho verde nos dias com eventos
- **Eventos do Dia**: Lista de eventos ao selecionar um dia
- **Adicionar Evento**: Modal pré-preenchido com data selecionada

---

## localStorage

### O que é?

localStorage é uma API do navegador que permite salvar dados de forma persistente no dispositivo do usuário. Os dados ficam salvos mesmo após fechar o navegador.

### Limitações
- Tamanho máximo: ~5-10 MB (varia por navegador)
- Apenas strings (usamos JSON.stringify/parse)
-同一域名 (domínio) específico

### Segurança
- Dados ficam apenas no dispositivo local
- Não são enviados a nenhum servidor
- Não há backup automático

---

## Service Worker

### O que faz?

O service worker é um script que roda em segundo plano e permite:
1. **Cache**: Salvar arquivos para uso offline
2. **Intercepts**: Controlar requisições de rede
3. **Push**: Notificações push (não implementado)

### Fluxo de Cache

```
1. Usuário acessa app pela primeira vez
      │
      ▼
2. Service Worker "install" dispara
      │
      ▼
3. Arquivos são baixados e salvos no cache
      │
      ▼
4. Usuário acessa novamente (online ou offline)
      │
      ▼
5. Service Worker "fetch" intercepta requisição
      │
      ▼
6. Se arquivo está no cache → retorna do cache
   Se não → tenta buscar na rede
```

### Atualizações

Para forçar atualização do cache:
```javascript
// No arquivo sw.js
const CACHE_NAME = 'produtive-v2';  // Mudar versão
```

---

## CSS Variables

O app usa variáveis CSS para fácil customização:

```css
:root {
    --primary: #6366f1;        /* Roxo principal */
    --primary-dark: #4f46e5;  /* Roxo escuro */
    --secondary: #10b981;      /* Verde */
    --danger: #ef4444;        /* Vermelho */
    --warning: #f59e0b;       /* Amarelo */
    --bg: #f8fafc;            /* Fundo */
    --card: #ffffff;          /* Cards */
    --text: #1e293b;          /* Texto */
    --text-light: #64748b;    /* Texto claro */
    --border: #e2e8f0;        /* Bordas */
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1;
}
```

Para mudar o tema, basta alterar esses valores!

---

## Responsividade

### Breakpoints

O app usa design mobile-first com breakpoints:

```css
/* Mobile (padrão) */
max-width: 480px → estilo mobile

/* Desktop (a partir de 481px) */
@media (min-width: 481px) → estilo desktop
```

### Ajustes Mobile

- Grid de notas: 2 colunas
- Padding reduzido
- Fontes menores
- Botões maiores para touch

---

## Extensões Futuras

Possíveis melhorias para o app:

1. **Sincronização na nuvem**: Usar Firebase ou similar
2. **Categorias e tags**: Organizar tarefas e notas
3. **Notificações**: Lembretes de tarefas
4. **Exportar/Importar**: Backup em JSON
5. **Tema escuro**: Modo noturno
6. **Compartilhar**: Enviar tarefas por apps
7. **Atalhos**: Shortcuts do Android/iOS

---

## Troubleshooting

### Problema: App não instala
- Verifique se está usando HTTPS ou localhost
- Certifique-se de que o manifest.json está correto

### Problema: Dados não salvam
- Verifique se localStorage não está cheio
- Desative navegação privada

### Problema: Offline não funciona
- Verifique se service worker está registrado
- Acesse pelo menos uma vez online primeiro

### Problema: Mudanças não aparecem
- Limpe o cache do navegador
- Force atualização (Ctrl+Shift+R)

---

## Glossário

| Termo | Significado |
|-------|------------|
| API | Interface de programação |
| Cache | Armazenamento temporário |
| CRUD | Criar, Ler, Atualizar, Deletar |
| DOM | Modelo de objetos do documento |
| JSON | Formato de dados texto |
| PWA | App web progressivo |
| localStorage | Armazenamento local do navegador |
| Service Worker | Script em segundo plano |

---

## Referências

- [MDN Web Docs - localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)
- [MDN - Service Worker API](https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [CSS Variables](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Using_CSS_custom_properties)
