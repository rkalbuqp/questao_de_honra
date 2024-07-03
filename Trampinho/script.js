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
        const backgroundColor = dot.style.backgroundColor;
        dot.style.backgroundColor = getContrastColor(backgroundColor);
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

    if (noteEditor) {
        dayCell.removeChild(noteEditor);
    } else {
        const newNoteEditor = document.createElement('div');
        newNoteEditor.className = 'note-editor';
        newNoteEditor.innerHTML = `
            <input type="text" placeholder="Digite sua nota...">
            <div class="color-options" id="color-options-${day}">
                ${getDotColorOptions(day)}
            </div>
            <button onclick="saveNote(${day})">Salvar</button>
        `;
        dayCell.appendChild(newNoteEditor);
    }
}

// Opções de cor para os pontos de evento
function getDotColorOptions(day) {
    let colorOptions = '';
    const colors = ['#ff5722', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b', '#9e9e9e', '#607d8b', '#333333', '#ff5722', '#4caf50', '#ffeb3b', '#e91e63', '#673ab7', '#f44336', '#009688', '#607d8b', '#ff5722'];

    colors.forEach(color => {
        colorOptions += `<div class="color-dot" style="background-color: ${color}" onclick="selectColor('${color}', ${day})"></div>`;
    });

    return colorOptions;
}

// Selecionar cor para o ponto de evento
function selectColor(color, day) {
    selectedColor = color;
    const colorOptions = document.getElementById(`color-options-${day}`).getElementsByClassName('color-dot');
    
    Array.from(colorOptions).forEach(dot => {
        dot.style.border = dot.style.backgroundColor === color ? '2px solid #000' : 'none';
    });
}

// Salvar nota
function saveNote(day) {
    const inputElement = document.querySelector(`.day-cell[data-day="${day}"] .note-editor input[type="text"]`);
    const noteText = inputElement.value.trim();

    if (noteText !== '') {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <span class="close-note" onclick="removeNoteEditor(${day})">&times;</span>
            <p>${noteText}</p>
        `;
        noteElement.style.borderColor = selectedColor;
        const dayCell = document.querySelector(`.day-cell[data-day="${day}"]`);
        dayCell.appendChild(noteElement);
        inputElement.value = '';
    }
    
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
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';

    document.querySelectorAll('.day-cell').forEach(dayCell => {
        const notes = dayCell.querySelectorAll('.note');

        notes.forEach(note => {
            const eventDot = document.createElement('div');
            eventDot.className = 'event-dot';
            eventDot.style.backgroundColor = selectedColor;
            eventDot.setAttribute('onclick', 'showNoteDetails(this)');
            eventList.appendChild(eventDot);
        });
    });
}

// Mostrar detalhes da nota
function showNoteDetails(eventDot) {
    const note = eventDot.nextElementSibling;
    const noteDetails = document.createElement('div');
    noteDetails.className = 'note-details';
    noteDetails.innerHTML = `
        <span class="close-note" onclick="closeNoteDetails()">&times;</span>
        ${note.innerHTML}
        <textarea placeholder="Adicionar nova nota..."></textarea>
    `;
    eventDot.parentElement.appendChild(noteDetails);
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
