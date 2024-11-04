// находим елементи на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();
// добавления задачи
form.addEventListener("submit", addTask);
// удаления задачи
tasksList.addEventListener("click", deleteTask);
//отмечаем задачу завершонной
tasksList.addEventListener("click", doneTask);

// функции
function addTask(event) {
  //  отменяем отпраку форми
  event.preventDefault();
  //   достаем текст с инпута
  const taskText = taskInput.value;
  // Описываем задачу ввиде обэкта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем задачу в масив с задачами
  tasks.push(newTask);

  saveToLocalStorage();
  renderTask(newTask);

  //   очишаем полле ввода и возвращаем фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // проверям если клик бил НЕ по кнопке "удалить задачу"
  if (event.target.dataset.action !== "delete") {
    return;
  }

  const parenNode = event.target.closest(".list-group-item");

  //   определяем ID задачі
  const id = Number(parenNode.id);

  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  // удаляем задачу из разметки
  parenNode.remove();
  checkEmptyList();
}

function doneTask(event) {
  // Перевірка, що клік був по кнопці "виконати завдання"
  if (event.target.dataset.action !== "done") {
    return;
  }

  // Знаходимо батьківський елемент задачі
  const parentNode = event.target.closest(".list-group-item");

  // Знаходимо завдання в масиві `tasks`
  const taskId = Number(parentNode.id);
  const task = tasks.find((task) => task.id === taskId);

  // Міняємо статус виконання задачі
  task.done = !task.done;

  // Оновлюємо клас елемента для відображення статусу
  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");

  // Зберігаємо оновлений масив задач в `localStorage`
  saveToLocalStorage();
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <div class="empty-list__title">Список дел пуст</div>
          </li>`;

    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  // формируем css класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  //   формируем разметку для новой задачи
  const taskHTML = `<li id= "${task.id}" class="list-group-item d-flex justify-content-between task-item">
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
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
