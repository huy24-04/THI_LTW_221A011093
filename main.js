document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('bai01.html')) {
        initBookingSystem();
    } else if (path.includes('bai02.html')) {
        initTodoMatrix();
    }
});

function initBookingSystem() {
    const grid = document.getElementById('seat-grid');
    const selectedCount = document.getElementById('selected-count');
    const totalPrice = document.getElementById('total-price');
    const payBtn = document.getElementById('pay-btn');
    const modal = document.getElementById('modal');
    const summary = document.getElementById('summary');

    const rows = 5;
    const cols = 8;
    const prices = { standard: 50000, vip: 80000, sweetbox: 150000 };
    let selectedSeats = [];
    let soldSeats = [];

    // Generate random sold seats
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        const row = Math.floor(Math.random() * rows) + 1;
        const col = Math.floor(Math.random() * cols) + 1;
        soldSeats.push(`${row}-${col}`);
    }

    // Render grid
    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.dataset.row = row;
            seat.dataset.col = col;
            seat.textContent = `${row}-${col}`;

            if (row <= 2) seat.classList.add('standard');
            else if (row <= 4) seat.classList.add('vip');
            else seat.classList.add('sweetbox');

            if (soldSeats.includes(`${row}-${col}`)) {
                seat.classList.add('sold');
            } else {
                seat.addEventListener('click', () => toggleSeat(seat));
            }

            grid.appendChild(seat);
        }
    }

    function toggleSeat(seat) {
        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            selectedSeats = selectedSeats.filter(s => s !== seat);
        } else {
            if (selectedSeats.length >= 5) {
                alert('Không được chọn quá 5 ghế!');
                return;
            }
            seat.classList.add('selected');
            selectedSeats.push(seat);
        }
        updateSummary();
    }

    function updateSummary() {
        selectedCount.textContent = selectedSeats.length;
        let total = 0;
        selectedSeats.forEach(seat => {
            const row = parseInt(seat.dataset.row);
            if (row <= 2) total += prices.standard;
            else if (row <= 4) total += prices.vip;
            else total += prices.sweetbox;
        });
        totalPrice.textContent = total.toLocaleString();
    }

    payBtn.addEventListener('click', () => {
        if (selectedSeats.length === 0) {
            alert('Chưa chọn ghế!');
            return;
        }
        let sumText = 'Ghế chọn: ' + selectedSeats.map(s => `${s.dataset.row}-${s.dataset.col}`).join(', ') + '<br>';
        sumText += 'Tổng tiền: ' + totalPrice.textContent + ' VND';
        summary.innerHTML = sumText;
        modal.style.display = 'block';
    });
}

function initTodoMatrix() {
    const mssv = '123456'; // Thay bằng MSSV thực
    const lastDigit = parseInt(mssv.slice(-1));
    const specialColor = (lastDigit % 2 === 0) ? 'red' : 'blue';

    const taskNameInput = document.getElementById('task-name');
    const prioritySelect = document.getElementById('priority');
    const addBtn = document.getElementById('add-task');
    const boxes = {
        1: document.getElementById('box1'),
        2: document.getElementById('box2'),
        3: document.getElementById('box3'),
        4: document.getElementById('box4')
    };

    let tasks = JSON.parse(localStorage.getItem(`tasks_${mssv}`)) || [];

    // Render tasks
    function renderTasks() {
        Object.keys(boxes).forEach(key => boxes[key].innerHTML = `<h3>${boxes[key].querySelector('h3').textContent}</h3>`);
        tasks.forEach(task => {
            const p = document.createElement('p');
            p.textContent = task.name;
            if (task.name.length > 10) p.style.color = specialColor;
            boxes[task.priority].appendChild(p);
        });
    }

    renderTasks();

    addBtn.addEventListener('click', () => {
        const name = taskNameInput.value.trim();
        const priority = prioritySelect.value;
        if (!name) return;

        tasks.push({ name, priority });
        localStorage.setItem(`tasks_${mssv}`, JSON.stringify(tasks));
        renderTasks();
        taskNameInput.value = '';
    });
}