//Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const checkAllBtn = document.querySelector('#ckeckAllBtn');
const clearCmplBtn = document.querySelector('#clearCmplBtn');
const showActiveBtn = document.querySelector('#showActiveBtn');
const showAllBtn = document.querySelector('#showAllBtn');
const showCmplBtn = document.querySelector('#showCmplBtn');

let tasks = [];
let flag = 1;

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
checkAllBtn.addEventListener('click', checkAllTasks);
clearCmplBtn.addEventListener('click', delAllDoneTasks);
showAllBtn.addEventListener('click', showAllTasks);
showActiveBtn.addEventListener('click', showActiveTasks);
showCmplBtn.addEventListener('click', showDoneTasks);


// Функции
function addTask(event) {
  // отменяем отправку формы
  event.preventDefault();

  // достаем текст из поля ввода
  const taskText = taskInput.value;

  // Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем задачу в массив задач
  tasks.push(newTask);

  // Сохраняем список задач в localStorage
  saveToLocalStorage();

  // рендерим задачу на страницу
  renderTask(newTask);

  // очищаем поле ввода и возвращаем на него фокус
  taskInput.value = '';
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // Проверяем если клик был не по кнопке удаления
  if (event.target.dataset.action !== 'delete') return;

  // Действие при клике на кнопку удаления
  const parentNode = event.target.closest('.list-group-item');

  // Определяем id задачи
  const id = Number(parentNode.id);

  // Удаление с фильтром
  tasks = tasks.filter((task) => task.id !== id);

  // Сохраняем список задач в localStorage
  saveToLocalStorage();

  // Удаляем задачу из разметки
  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  // Проверяем если клик был не по кнопке done
  if (event.target.dataset.action !== 'done') return;

  // Действие при клике на кнопку done для массива
  const parentNode = event.target.closest('.list-group-item');
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  // Сохраняем список задач в localStorage
  saveToLocalStorage();

  // Действие при клике на кнопку done для разметки
  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <div class="empty-list__title">Список дел пуст</div>
          </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function renderTask(task) {
  // формируем CSS класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  // формируем разметку для новой задачи
  const taskHtml = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
						    <span class="${cssClass}">${task.text}</span>
						    <div class="task-item__buttons">
							    <button type="button" data-action="done" class="btn-action">
								    <img src="./img/tick.svg" alt="Done" width="18" height="18">
							    </button>
							    <button type="button" data-action="delete" class="btn-action">
								    <img src="./img/cross.svg" alt="Done" width="18" height="18">
							    </button>
						    </div>
					    </li>`;

  // добавляем задачу на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHtml);
}

function checkAllTasks() {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  const allTasks = document.querySelectorAll('.task-title');

  // Удаление с фильтром
  if (flag === 1) {
    // tasks = tasks.filter((task) => (task.done = true));
    tasks.forEach((task) => (task.done = true));

    // Делаем отметку о выполнении в разметке
    
    allTasks.forEach((task) => task.classList.add('task-title--done'));

    flag = 2;

  } else if (flag === 2) {
    tasks.forEach((task) => (task.done = false));

    // Делаем отметку о выполнении в разметке
    allTasks.forEach((task) => task.classList.remove('task-title--done'));

    flag = 1;
  }
  // Сохраняем список задач в localStorage
  saveToLocalStorage();
}

function delAllDoneTasks() {
tasks = JSON.parse(localStorage.getItem('tasks'));
const allTasks = document.querySelectorAll('.task-title');

//получаю массив выполненных задач
doneTasks = tasks.filter((el) => el.done === true);

//актуализирую верстку
doneTasks.forEach(function (a) {
  allTasks.forEach( function(b) {
    if (a.id == b.closest('.list-group-item').id) {
      b.closest('.list-group-item').remove()
    }
    return;
  })
})

//фильтруем актуальные таски
tasks = tasks.filter((el) => el.done === false);

//сохраняем список задач в localStorage
saveToLocalStorage();
}

function showAllTasks() {
  console.log("showAllTasks is active");
}

function showActiveTasks() {
  console.log("showActiveTasks is active");
}

function showDoneTasks() {
  console.log("showDoneTasks is active");
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
