// Variáveis globais
let currentDate = new Date();
let selectedColor = '#007bff'; // Cor padrão para os pontos de evento

// Elementos do DOM
const calendarGrid = document.getElementById('calendar-grid');
const eventListElement = document.getElementById('event-list');
const toggleSidebarButton = document.querySelector('.toggle-sidebar-button');

// Renderizar calendário
function renderCalendar() {
    calendarGrid.innerHTML = '';
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    document.getElementById('current-month-year').textContent = `${getMonthName(currentMonth)} ${currentYear}`;

    // Adicionar dias do mês ao calendário
    for (let i = 0; i < firstDayIndex + daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        if (i >= firstDayIndex) {
            const dayNumber = i - firstDayIndex + 1;
            dayCell.textContent = dayNumber;
            dayCell.setAttribute('data-day', dayNumber);
            dayCell.setAttribute('onclick', `toggleNoteEditor(${dayNumber})`);
        }
        calendarGrid.appendChild(dayCell);
    }

    renderEventList();
}

// Obter nome do mês pelo índice
function getMonthName(monthIndex) {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[monthIndex];
}

// Alternar tema claro/escuro
function toggleTheme() {
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const eventDots = document.querySelectorAll('.event-dot');
    const closeSidebarButton = document.querySelector('.close-sidebar');

    body.classList.toggle('dark-theme');
    sidebar.classList.toggle('dark-theme');
    eventDots.forEach(dot => {
        dot.classList.toggle('dark-theme');
    });
    closeSidebarButton.style.color = getContrastColor(window.getComputedStyle(closeSidebarButton).color);
}

// Alternar barra lateral
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.right = sidebar.style.right === '0px' ? '-250px' : '0px';
}

// Adicionar e remover notas
function toggleNoteEditor(day) {
    const dayCell = document.querySelector(`.day-cell[data-day="${day}"]`);
    const noteEditor = dayCell.querySelector('.note-editor');

    if (!noteEditor) {
        const newNoteEditor = document.createElement('div');
        newNoteEditor.className = 'note-editor';
        newNoteEditor.innerHTML = `
            <input type="text" placeholder="Digite sua nota...">
            <div class="color-options" id="color-options-${day}">
                ${getDotColorOptions(day)}
            </div>
            <button onclick="saveNote(${day})">Salvar</button>
            <button onclick="removeNoteEditor(${day})">Fechar</button>
        `;
        dayCell.appendChild(newNoteEditor);
        newNoteEditor.querySelector('input').focus(); // Coloca o foco no input ao abrir
    }
}

// Opções de cor para os pontos de evento
function getDotColorOptions(day) {
    let colorOptions = '';
    const colors = ['#ff5722', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b', '#9e9e9e', '#9c27b0'];

    colors.forEach((color, index) => {
        colorOptions += `<span class="dot-option" style="background-color: ${color}" onclick="selectDotColor(${day}, '${color}')"></span>`;
    });

    return colorOptions;
}

// Selecionar cor para a nota
function selectDotColor(day, color) {
    selectedColor = color;
    const colorOptions = document.getElementById(`color-options-${day}`);
    colorOptions.querySelectorAll('.dot-option').forEach(option => {
        option.classList.remove('selected');
    });
    eventDot.style.backgroundColor = selectedColor;
    eventDot.classList.add('selected');
}

// Salvar nota
function saveNote(day) {
    const dayCell = document.querySelector(`.day-cell[data-day="${day}"]`);
    const inputElement = dayCell.querySelector('input');
    const noteText = inputElement.value.trim();

    if (noteText !== '') {
        // Remover notas existentes antes de adicionar uma nova
        const existingNotes = dayCell.querySelectorAll('.event-dot');
        existingNotes.forEach(note => {
            dayCell.removeChild(note);
        });

        // Adicionar novo ponto de evento
        const eventDot = document.createElement('div');
        eventDot.className = 'event-dot';
        eventDot.style.backgroundColor = selectedColor;
        eventDot.setAttribute('onclick', `showNoteDetails(${day})`);
        dayCell.appendChild(eventDot);
    }

    removeNoteEditor(day);
    renderEventList();
}

// Remover editor de nota
function removeNoteEditor(day) {
    const dayCell = document.querySelector(`.day-cell[data-day="${day}"]`);
    const noteEditor = dayCell.querySelector('.note-editor');
    if (noteEditor) {
        dayCell.removeChild(noteEditor);
    }
}

// Renderizar lista de eventos na barra lateral
function renderEventList() {
    eventListElement.innerHTML = '';

    document.querySelectorAll('.day-cell').forEach(dayCell => {
        const notes = dayCell.querySelectorAll('.event-dot');

        notes.forEach(note => {
            const eventDot = document.createElement('div');
            eventDot.className = 'event-dot';
            eventDot.style.backgroundColor = selectedColor;
            eventDot.setAttribute('onclick', `showNoteDetails(${dayCell.getAttribute('data-day')})`);
            eventListElement.appendChild(eventDot);
        });
    });
}

// Mostrar detalhes da nota
function showNoteDetails(day) {
    const dayCell = document.querySelector(`.day-cell[data-day="${day}"]`);
    const noteDetails = document.createElement('div');
    noteDetails.className = 'note-details';
    const notes = dayCell.querySelectorAll('.note-editor .event-dot');

    notes.forEach(note => {
        noteDetails.innerHTML = `
            <span class="close-note" onclick="closeNoteDetails()">&times;</span>
            ${note.innerHTML}
            <textarea placeholder="Adicionar nova nota..."></textarea>
        `;
    });
    dayCell.parentElement.appendChild(noteDetails);
}

// Fechar detalhes da nota
function closeNoteDetails() {
    const noteDetails = document.querySelector('.note-details');
    if (noteDetails) {
        noteDetails.parentElement.removeChild(noteDetails);
    }
}

// Obter cor de contraste
function getContrastColor(hexColor) {
    // Conversão de cor hexadecimal para RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Fórmula para determinar luminosidade percebida (Luma)
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Retornar cor branca ou preta dependendo da luminosidade percebida
    return luma < 128 ? '#fff' : '#000';
}

// Inicialização do calendário
renderCalendar();
