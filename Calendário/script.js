// Seleciona elementos do DOM
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("month-year");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const toggleThemeButton = document.getElementById("toggle-theme");
const sidebar = document.getElementById("sidebar");
const toggleSidebarButton = document.getElementById("toggle-sidebar");

// Renderiza o calendário
function renderCalendar(month, year) {
    calendar.innerHTML = "";
    monthYear.innerText = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();

    // Preenche os dias em branco antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        calendar.appendChild(emptyCell);
    }

    // Preenche os dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.innerText = i;
        dayCell.addEventListener("click", () => toggleMarkedDay(dayCell));
        calendar.appendChild(dayCell);
    }
}

// Marca ou desmarca um dia
function toggleMarkedDay(dayCell) {
    dayCell.classList.toggle("marked");
}

// Alterna entre meses anteriores e próximos
prevMonthButton.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextMonthButton.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

// Alterna entre temas claro e escuro
toggleThemeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Alterna a exibição da barra lateral
toggleSidebarButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// Inicializa o calendário na data atual
renderCalendar(currentMonth, currentYear);
