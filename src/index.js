import "./styles.css";

class Todo {
  constructor(taskName, taskDescription, dueDate, category) {
    this.id = Date.now() + Math.random();
    this.completed = false;
    this.taskName = taskName;
    this.taskDescription = taskDescription;
    this.dueDate = dueDate;
    this.category = category;
  }
}

class TodoController {
  static getTodos() {
    // retrieves a string representation of an array of todo objects, using the key of "todos"
    // and converts the string into an array with JSON.parse. if it exists, get the array otherwise get an empty array
    return JSON.parse(localStorage.getItem("todos") || "[]");
  }

  static addTodo(taskName, taskDescription, dueDate, category) {
    const newTodo = new Todo(taskName, taskDescription, dueDate, category);
    const todos = TodoController.getTodos;
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
    const todoTaskName = document.createElement("div");
    todoTaskName.textContent = todo.taskName;
    const todoDueDate = document.createElement("div");
    todoDueDate.textContent = todo.dueDate;

    todoRow.appendChild(todoTaskName);
    todoRow.appendChild(todoDueDate);

    this.taskTable.appendChild(todoRow);
  }
}

const dialog = document.querySelector(".new-task-dialog");

const newTaskButton = document.querySelector(".new-task-button");
newTaskButton.addEventListener("click", () => {
  dialog.showModal();
});

const closeDialog = document.querySelector(".close-dialog");
closeDialog.addEventListener("click", () => {
  dialog.close();
});
