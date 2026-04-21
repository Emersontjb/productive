/* 
    =====================================================================
    PRODUTIVE - ARQUIVO JAVASCRIPT PRINCIPAL
    =====================================================================
    
    Este arquivo contém toda a lógica de funcionamento do aplicativo.
    É aqui que acontece toda a "mágica" - interactivity, salvar dados,
    renderizar elementos, etc.
    
    ÍNDICE DE SEÇÕES:
    1. Variáveis Globais e Dados
    2. Funções de Armazenamento (localStorage)
    3. Funções de Interface (toast, navegação)
    4. Sistema de Tarefas
    5. Sistema de Notas
    6. Sistema de Calendário/Agenda
    7. Modal (formulários)
    8. Inicialização do App
    
    O QUE É JAVASCRIPT?
    JavaScript é uma linguagem de programação que permite adicionar
    interactivity às páginas web. Com ele, você pode:
    - Manipular elementos da página
    - Salvar dados no navegador
    - Responder a cliques e outros eventos
    - Fazer cálculos e processar informações
    
    CONCEITOS IMPORTANTES USADOS:
    - localStorage: Armazenamento persistente no navegador
    - DOM: Modelo de objetos do documento (a página HTML)
    - Event Listeners: Funções que respondem a eventos
    - Arrow Functions: Sintaxe moderna de funções
    
    =====================================================================
*/


/* 
    =====================================================================
    SEÇÃO 1: VARIÁVEIS GLOBAIS E DADOS
    =====================================================================
    
    Aqui definimos as variáveis que armazenam os dados do app.
    Usamos localStorage para persistir os dados mesmo após
    fechar o navegador.
    
    O que é localStorage?
    É um recurso do navegador que permite salvar dados
    localmente no dispositivo do usuário. Os dados ficam
    salvos mesmo após fechar o navegador ou desligar o电脑.
    
    Estrutura dos dados:
    - tarefas: array de objetos com {titulo, data, prioridade, completed}
    - notas: array de objetos com {titulo, conteudo, data}
    - eventos: array de objetos com {titulo, data, hora}
*/
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let notas = JSON.parse(localStorage.getItem('notas')) || [];
let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

// Variáveis de estado da interface
let currentFilter = 'all';      // Filtro atual das tarefas
let currentMonth = new Date();  // Mês sendo visualizado no calendário
let selectedDate = new Date();  // Dia selecionado no calendário


/* 
    =====================================================================
    SEÇÃO 2: FUNÇÕES DE ARMAZENAMENTO
    =====================================================================
    
    Funções para salvar e carregar dados do localStorage.
    Sempre que modificamos tarefas, notas ou eventos,
    devemos chamar saveData() para persistir as mudanças.
*/

/**
 * Salva todos os dados no localStorage
 * Deve ser chamada após qualquer modificação nos dados
 */
function saveData() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    localStorage.setItem('notas', JSON.stringify(notas));
    localStorage.setItem('eventos', JSON.stringify(eventos));
}

/**
 * Exibe uma mensagem temporária (toast) na tela
 * @param {string} msg - A mensagem a ser exibida
 */
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}


/* 
    =====================================================================
    SEÇÃO 3: FUNÇÕES DE INTERFACE
    =====================================================================
    
    Funções que controlam a navegação entre abas e filtros.
*/

/**
 * Configura os listeners de clique para a navegação principal
 * Alterna entre as abas: Tarefas, Notas e Agenda
 */
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove classe 'active' de todos os botões
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        
        // Remove classe 'active' de todas as abas
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        // Adiciona classe 'active' ao botão clicado
        btn.classList.add('active');
        
        // Mostra a aba correspondente
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

/**
 * Configura os listeners para os botões de filtro de tarefas
 */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove classe 'active' de todos os filtros
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        
        // Adiciona classe 'active' ao filtro clicado
        btn.classList.add('active');
        
        // Atualiza o filtro atual
        currentFilter = btn.dataset.filter;
        
        // Re-renderiza a lista de tarefas
        renderTarefas();
    });
});


/* 
    =====================================================================
    SEÇÃO 4: SISTEMA DE TAREFAS
    =====================================================================
    
    Este sistema gerencia uma lista de tarefas (to-do list).
    Cada tarefa tem:
    - titulo: nome da tarefa
    - data: data para conclusão
    - prioridade: baixa, média ou alta
    - completed: true se concluída, false se pendente
    
    Principais funções:
    - renderTarefas(): mostra todas as tarefas na tela
    - toggleTarefa(): marca/desmarca tarefa como concluída
    - deleteTarefa(): remove tarefa da lista
    - addTarefa(): adiciona nova tarefa
*/

/**
 * Renderiza a lista de tarefas na tela
 * Filtra as tarefas baseado no filtro atual
 */
function renderTarefas() {
    const list = document.getElementById('task-list');
    
    // Aplica o filtro selecionado
    let filtered = tarefas;
    if (currentFilter === 'pending') {
        filtered = tarefas.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = tarefas.filter(t => t.completed);
    }

    // Se não houver tarefas, mostra mensagem vazia
    if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state"><span>📝</span>Nenhuma tarefa encontrada</div>';
        return;
    }

    // Ordena tarefas: pendentes primeiro, depois por data
    filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.data) - new Date(b.data);
    });

    // Gera HTML para cada tarefa
    list.innerHTML = filtered.map((t, i) => {
        const taskIndex = tarefas.indexOf(t);
        return `
        <div class="task-item ${t.completed ? 'completed' : ''}">
            <div class="checkbox ${t.completed ? 'checked' : ''}" onclick="toggleTarefa(${taskIndex})"></div>
            <div class="task-content">
                <div class="task-title" onclick="editTarefa(${taskIndex})">${t.titulo}</div>
                <div class="task-date">${formatDate(t.data)}${t.prioridade ? ' • ' + t.prioridade : ''}</div>
            </div>
            <button class="delete-btn" onclick="deleteTarefa(${taskIndex})">🗑</button>
        </div>
    `}).join('');
}

/**
 * Alterna o estado de conclusão de uma tarefa
 * @param {number} index - Índice da tarefa no array filtrado
 */
function toggleTarefa(index) {
    const task = tarefas[index];
    if (task) {
        // Alterna o estado
        task.completed = !task.completed;
        
        // Salva e atualiza a tela
        saveData();
        renderTarefas();
        
        // Mostra mensagem
        showToast(task.completed ? 'Tarefa concluída!' : 'Tarefa reaberta');
    }
}

/**
 * Exclui uma tarefa
 * @param {number} index - Índice da tarefa no array filtrado
 */
function deleteTarefa(index) {
    // Remove a tarefa pelo índice
    tarefas.splice(index, 1);
    
    // Salva e atualiza
    saveData();
    renderTarefas();
    showToast('Tarefa excluída');
}

/**
 * Adiciona uma nova tarefa
 * @param {string} titulo - Nome da tarefa
 * @param {string} data - Data para conclusão
 * @param {string} prioridade - Nível de prioridade
 */
function addTarefa(titulo, data, prioridade) {
    // Adiciona ao array de tarefas
    tarefas.push({ titulo, data, prioridade, completed: false });
    
    // Salva e atualiza
    saveData();
    renderTarefas();
    showToast('Tarefa adicionada!');
}

/**
 * Abre o modal para editar uma tarefa existente
 * @param {number} index - Índice da tarefa no array principal
 */
function editTarefa(index) {
    const task = tarefas[index];
    if (!task) return;
    
    // Define o título do modal
    document.getElementById('modal-title').textContent = 'Editar Tarefa';
    
    // Gera o formulário com os dados atuais
    document.getElementById('modal-form').innerHTML = `
        <div class="form-group">
            <label>Tarefa</label>
            <input type="text" name="titulo" value="${task.titulo}" required>
        </div>
        <div class="form-group">
            <label>Data</label>
            <input type="date" name="data" value="${task.data}" required>
        </div>
        <div class="form-group">
            <label>Prioridade</label>
            <select name="prioridade">
                <option value="">Nenhuma</option>
                <option value="baixa" ${task.prioridade === 'baixa' ? 'selected' : ''}>Baixa</option>
                <option value="média" ${task.prioridade === 'média' ? 'selected' : ''}>Média</option>
                <option value="alta" ${task.prioridade === 'alta' ? 'selected' : ''}>Alta</option>
            </select>
        </div>
        <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="deleteTarefa(${index})">Excluir</button>
            <button type="submit" class="btn-primary">Salvar</button>
        </div>
    `;
    
    // Configura o submit do formulário
    document.getElementById('modal-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        tarefas[index] = {
            titulo: form.titulo.value,
            data: form.data.value,
            prioridade: form.prioridade.value,
            completed: task.completed
        };
        saveData();
        renderTarefas();
        closeModal();
        showToast('Tarefa atualizada!');
    };
    
    // Abre o modal
    document.getElementById('modal').classList.add('show');
}


/* 
    =====================================================================
    SEÇÃO 5: SISTEMA DE NOTAS
    =====================================================================
    
    Sistema para criar e gerenciar notas rápidas.
    Cada nota tem:
    - titulo: título da nota
    - conteudo: texto principal da nota
    - data: data de criação/última edição
    
    Principais funções:
    - renderNotas(): exibe notas em formato de grid
    - addNota(): cria nova nota
    - editNota(): abre formulário para editar
    - deleteNota(): remove nota
*/

/**
 * Renderiza as notas em formato de grid (grade)
 */
function renderNotas() {
    const grid = document.getElementById('notes-grid');

    // Se não houver notas, mostra mensagem vazia
    if (notas.length === 0) {
        grid.innerHTML = '<div class="empty-state"><span>📝</span>Nenhuma nota encontrada</div>';
        return;
    }

    // Gera HTML para cada nota
    grid.innerHTML = notas.map((n, i) => `
        <div class="note-card" onclick="editNota(${i})">
            <h3>${n.titulo}</h3>
            <p>${n.conteudo}</p>
            <div class="note-date">${formatDate(n.data)}</div>
        </div>
    `).join('');
}

/**
 * Adiciona uma nova nota
 * @param {string} titulo - Título da nota
 * @param {string} conteudo - Conteúdo da nota
 */
function addNota(titulo, conteudo) {
    notas.push({ titulo, conteudo, data: new Date().toISOString() });
    saveData();
    renderNotas();
    showToast('Nota adicionada!');
}

/**
 * Abre o modal de edição de nota
 * @param {number} index - Índice da nota no array
 */
function editNota(index) {
    const nota = notas[index];
    
    // Define o título do modal
    document.getElementById('modal-title').textContent = 'Editar Nota';
    
    // Gera o formulário
    document.getElementById('modal-form').innerHTML = `
        <div class="form-group">
            <label>Título</label>
            <input type="text" name="titulo" value="${nota.titulo}" required>
        </div>
        <div class="form-group">
            <label>Conteúdo</label>
            <textarea name="conteudo" required>${nota.conteudo}</textarea>
        </div>
        <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="deleteNota(${index})">Excluir</button>
            <button type="submit" class="btn-primary">Salvar</button>
        </div>
    `;
    
    // Configura o submit do formulário
    document.getElementById('modal-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        nota.titulo = form.titulo.value;
        nota.conteudo = form.conteudo.value;
        saveData();
        renderNotas();
        closeModal();
    };
    
    // Abre o modal
    document.getElementById('modal').classList.add('show');
}

/**
 * Exclui uma nota
 * @param {number} index - Índice da nota no array
 */
function deleteNota(index) {
    notas.splice(index, 1);
    saveData();
    renderNotas();
    closeModal();
    showToast('Nota excluída');
}


/* 
    =====================================================================
    SEÇÃO 6: SISTEMA DE CALENDÁRIO/AGENDA
    =====================================================================
    
    Sistema de calendário mensal com eventos.
    Permite:
    - Visualizar calendário por mês
    - Navegar entre meses
    - Ver eventos de um dia específico
    - Adicionar e excluir eventos
    
    Conceitos importantes:
    - Date object: objeto JavaScript para trabalhar com datas
    - getMonth(), getDate(), getFullYear(): extrai partes da data
    - toISOString(): converte data para formato texto
*/

/**
 * Renderiza o calendário do mês atual
 */
function renderCalendar() {
    const monthYear = document.getElementById('month-year');
    const days = document.getElementById('calendar-days');

    // Nomes dos meses em português
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    // Exibe o mês e ano no cabeçalho
    monthYear.textContent = `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

    // Calcula os dias do mês
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDay = firstDay.getDay();  // Dia da semana do primeiro dia
    const totalDays = lastDay.getDate();  // Total de dias no mês

    let html = '';
    const today = new Date();

    // Dias do mês anterior (para preencher a primeira semana)
    for (let i = 0; i < startDay; i++) {
        const prevDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -startDay + i);
        html += `<div class="calendar-day other-month">${prevDay.getDate()}</div>`;
    }

    // Dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];
        const hasEvent = eventos.some(e => e.data === dateStr);  // Verifica se tem evento
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = date.toDateString() === selectedDate.toDateString();

        html += `<div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvent ? 'has-event' : ''}" 
                     onclick="selectDate(${date.getFullYear()}, ${date.getMonth()}, ${day})">${day}</div>`;
    }

    days.innerHTML = html;
    renderDayEvents();
}

/**
 * Seleciona uma data específica
 * @param {number} year - Ano
 * @param {number} month - Mês (0-11)
 * @param {number} day - Dia
 */
function selectDate(year, month, day) {
    selectedDate = new Date(year, month, day);
    renderCalendar();
}

/**
 * Navega para o mês anterior ou seguinte
 * @param {number} delta - -1 para anterior, +1 para próximo
 */
function changeMonth(delta) {
    currentMonth.setMonth(currentMonth.getMonth() + delta);
    renderCalendar();
}

/**
 * Renderiza os eventos do dia selecionado
 */
function renderDayEvents() {
    const container = document.getElementById('day-events');
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayEvents = eventos.filter(e => e.data === dateStr);

    // Formata a data para exibição em português
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const dateBr = `${dayNames[selectedDate.getDay()]}, ${selectedDate.getDate()} de ${months[selectedDate.getMonth()]}`;

    // Se não houver eventos
    if (dayEvents.length === 0) {
        container.innerHTML = `<h3>${dateBr}</h3><div class="empty-state"><span>📅</span>Nenhum evento</div>`;
        return;
    }

    // Gera HTML para cada evento
    const eventosDoDia = eventos.filter(e => e.data === dateStr);
    container.innerHTML = `<h3>${dateBr}</h3>` + eventosDoDia.map((e, i) => {
        const eventIndex = eventos.indexOf(e);
        return `
        <div class="event-item">
            <div class="event-content">
                <div class="event-title" onclick="editEvento(${eventIndex})">${e.titulo}</div>
                <div class="event-date">${e.hora}</div>
            </div>
            <button class="delete-btn" onclick="deleteEvento(${eventIndex})">🗑</button>
        </div>
    `}).join('');
}

/**
 * Adiciona um novo evento
 * @param {string} titulo - Nome do evento
 * @param {string} data - Data do evento
 * @param {string} hora - Horário do evento
 */
function addEvento(titulo, data, hora) {
    eventos.push({ titulo, data, hora });
    saveData();
    renderCalendar();
    showToast('Evento adicionado!');
}

/**
 * Exclui um evento
 * @param {number} index - Índice do evento no array
 */
function deleteEvento(index) {
    // Remove o evento pelo índice
    eventos.splice(index, 1);
    
    // Salva e atualiza
    saveData();
    renderCalendar();
    showToast('Evento excluído');
}

/**
 * Abre o modal para editar um evento existente
 * @param {number} index - Índice do evento no array
 */
function editEvento(index) {
    const event = eventos[index];
    if (!event) return;
    
    // Define o título do modal
    document.getElementById('modal-title').textContent = 'Editar Evento';
    
    // Gera o formulário com os dados atuais
    const form = document.getElementById('modal-form');
    form.innerHTML = `
        <div class="form-group">
            <label>Evento</label>
            <input type="text" name="titulo" value="${event.titulo}" required>
        </div>
        <div class="form-group">
            <label>Data</label>
            <input type="date" name="data" value="${event.data}" required>
        </div>
        <div class="form-group">
            <label>Horário</label>
            <input type="time" name="hora" value="${event.hora}" required>
        </div>
        <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="deleteEvento(${index})">Excluir</button>
            <button type="submit" class="btn-primary">Salvar</button>
        </div>
    `;
    
    // Configura o submit do formulário
    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        eventos[index] = {
            titulo: formData.get('titulo'),
            data: formData.get('data'),
            hora: formData.get('hora')
        };
        saveData();
        renderCalendar();
        closeModal();
        showToast('Evento atualizado!');
    };
    
    // Abre o modal
    document.getElementById('modal').classList.add('show');
}
}


/* 
    =====================================================================
    SEÇÃO 7: UTILITÁRIOS
    =====================================================================
    
    Funções auxiliares e de formatação.
*/

/**
 * Formata uma data para o formato brasileiro
 * @param {string} dateStr - Data em formato ISO
 * @returns {string} Data formatada (ex: 21/04/2026)
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}


/* 
    =====================================================================
    SEÇÃO 8: MODAL (FORMULÁRIOS)
    =====================================================================
    
    Sistema de modal genérico que muda seu conteúdo
    dependendo do tipo de ação que o usuário quer fazer.
    
    Tipos de modal:
    - 'tarefa': adicionar nova tarefa
    - 'nota': adicionar nova nota
    - 'evento': adicionar novo evento
*/

/**
 * Abre o modal para criar/adicionar algo
 * @param {string} type - Tipo de modal: 'tarefa', 'nota' ou 'evento'
 */
function openModal(type) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('modal-form');

    // Configura o modal baseado no tipo
    if (type === 'tarefa') {
        title.textContent = 'Nova Tarefa';
        form.innerHTML = `
            <div class="form-group">
                <label>Tarefa</label>
                <input type="text" name="titulo" placeholder="O que você precisa fazer?" required>
            </div>
            <div class="form-group">
                <label>Data</label>
                <input type="date" name="data" required>
            </div>
            <div class="form-group">
                <label>Prioridade</label>
                <select name="prioridade">
                    <option value="">Nenhuma</option>
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Adicionar</button>
            </div>
        `;
        
        // Configura o submit
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            addTarefa(formData.get('titulo'), formData.get('data'), formData.get('prioridade'));
            closeModal();
        };
        
    } else if (type === 'nota') {
        title.textContent = 'Nova Nota';
        form.innerHTML = `
            <div class="form-group">
                <label>Título</label>
                <input type="text" name="titulo" placeholder="Título da nota" required>
            </div>
            <div class="form-group">
                <label>Conteúdo</label>
                <textarea name="conteudo" placeholder="Escreva sua nota..." required></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Adicionar</button>
            </div>
        `;
        
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            addNota(formData.get('titulo'), formData.get('conteudo'));
            closeModal();
        };
        
    } else if (type === 'evento') {
        title.textContent = 'Novo Evento';
        const dateStr = selectedDate.toISOString().split('T')[0];
        form.innerHTML = `
            <div class="form-group">
                <label>Evento</label>
                <input type="text" name="titulo" placeholder="Nome do evento" required>
            </div>
            <div class="form-group">
                <label>Data</label>
                <input type="date" name="data" value="${dateStr}" required>
            </div>
            <div class="form-group">
                <label>Horário</label>
                <input type="time" name="hora" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Adicionar</button>
            </div>
        `;
        
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            addEvento(formData.get('titulo'), formData.get('data'), formData.get('hora'));
            closeModal();
        };
    }

    // Mostra o modal
    modal.classList.add('show');
}

/**
 * Fecha o modal
 */
function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

/**
 * Configura o fechamento do modal ao clicar fora dele
 */
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});


/* 
    =====================================================================
    SEÇÃO 9: PWA (PROGRESSIVE WEB APP)
    =====================================================================
    
    Configura o Service Worker para permitir que o app
    funcione offline e seja instalável como app nativo.
    
    O que é Service Worker?
    É um script que roda em segundo plano e permite:
    - Cache de arquivos para uso offline
    - Notificações push
    - Execução em background
*/

/**
 * Registra o Service Worker para funcionar offline
 * Esta linha faz o navegador baixar e ativar o sw.js
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}


/* 
    =====================================================================
    SEÇÃO 10: INICIALIZAÇÃO DO APP
    =====================================================================
    
    Quando a página carrega, chamamos estas funções
    para renderizar os dados na tela.
*/

// Renderiza todas as listas ao iniciar
renderTarefas();
renderNotas();
renderCalendar();
