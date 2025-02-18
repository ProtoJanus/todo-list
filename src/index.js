import "./styles.css";

class Todo {
  constructor(todoName, todoDescription, todoDueDate, todoCategory) {
    this.id = Date.now() + Math.random();
    this.completed = false;
    this.todoName = todoName;
    this.todoDescription = todoDescription;
    this.todoDueDate = todoDueDate;
    this.todoCategory = todoCategory;
  }
}

class TodoController {
  static getTodos() {
    // retrieves a string representation of an array of todo objects, using the key of "todos"
    // and converts the string into an array with JSON.parse. if it exists, get the array otherwise get an empty array
    return JSON.parse(localStorage.getItem("todos") || "[]");
  }

  static addTodo(todoName, todoDescription, todoDueDate, todoCategory) {
    const newTodo = new Todo(
      todoName,
      todoDescription,
      todoDueDate,
      todoCategory
    );
    const todos = TodoController.getTodos();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));

    return newTodo;
  }
}

class TodoUIController {
  constructor() {
    this.todoTable = document.querySelector(".todo-table");
  }

  renderTodo(todo) {
    const todoRow = document.createElement("div");
    todoRow.classList.add("todo-row");

    const nameCheckBoxGroup = document.createElement("div");
    const todoCheckbox = document.createElement("input");
    todoCheckbox.type = "checkbox";

    const todoName = document.createElement("div");
    todoName.textContent = todo.todoName;

    nameCheckBoxGroup.appendChild(todoCheckbox);
    nameCheckBoxGroup.appendChild(todoName);
    nameCheckBoxGroup.classList.add("name-checkbox-group");

    const todoDueDate = document.createElement("div");
    todoDueDate.textContent = todo.todoDueDate;

    todoRow.appendChild(nameCheckBoxGroup);
    todoRow.appendChild(todoDueDate);

    this.todoTable.appendChild(todoRow);
  }
}
const todoUIController = new TodoUIController();
const dialog = document.querySelector(".new-todo-dialog");

const newTodoButton = document.querySelector(".new-todo-button");
newTodoButton.addEventListener("click", () => {
  dialog.showModal();
});

const closeDialog = document.querySelector(".close-dialog");
closeDialog.addEventListener("click", (e) => {
  e.preventDefault();
  const form = document.querySelector("form");
  const formData = new FormData(form);

  const todoName = formData.get("todo_name");
  const todoDescription = formData.get("todo_description");
  const todoDueDate = formData.get("due_date");
  const todoCategory = formData.get("list");

  const newTodo = TodoController.addTodo(
    todoName,
    todoDescription,
    todoDueDate,
    todoCategory
  );

  todoUIController.renderTodo(newTodo);

  dialog.close();

  document.querySelector("form").reset();
});

window.addEventListener("DOMContentLoaded", () => {
  const todos = TodoController.getTodos();
  todos.forEach((todo) => todoUIController.renderTodo(todo));
});

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
}

const hamburgerButton = document.querySelector(".hamburger-button");
const sidebar = document.querySelector(".sidebar");

hamburgerButton.addEventListener("click", () => {
  hamburgerButton.classList.toggle("active");
  sidebar.classList.toggle("active");
});
