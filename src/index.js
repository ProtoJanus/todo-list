import "./styles.css";

class Todo {
  constructor(
    todoName,
    todoDescription,
    todoDueDate,
    todoCategory,
    todoColor = "color-1"
  ) {
    this.id = Date.now() + Math.random();
    this.completed = false;
    this.todoName = todoName;
    this.todoDescription = todoDescription;
    this.todoDueDate = todoDueDate;
    this.todoCategory = todoCategory;
    this.todoColor = todoColor;
  }
}

class TodoController {
  static getTodos() {
    return JSON.parse(localStorage.getItem("todos") || "[]");
  }

  static addTodo(
    todoName,
    todoDescription,
    todoDueDate,
    todoCategory,
    todoColor = "color-1"
  ) {
    const newTodo = new Todo(
      todoName,
      todoDescription,
      todoDueDate,
      todoCategory,
      todoColor
    );
    const todos = TodoController.getTodos();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));

    return newTodo;
  }

  static updateTodoColor(todoId, newColor) {
    const todos = TodoController.getTodos();
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.todoColor = newColor;
      }
      return todo;
    });
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }
}

class TodoUIController {
  constructor() {
    this.todoTable = document.querySelector(".todo-table");
  }

  renderTodo(todo) {
    const todoDialog = document.querySelector(".todo-dialog");
    const todoRow = document.createElement("div");
    todoRow.classList.add("todo-row", todo.todoColor);

    const nameCheckBoxGroup = document.createElement("div");
    const todoCheckbox = document.createElement("input");
    todoCheckbox.type = "checkbox";
    todoCheckbox.addEventListener("click", (e) => e.stopPropagation());

    const todoName = document.createElement("div");
    todoName.textContent = todo.todoName;

    nameCheckBoxGroup.appendChild(todoCheckbox);
    nameCheckBoxGroup.appendChild(todoName);
    nameCheckBoxGroup.classList.add("name-checkbox-group");

    const todoDueDate = document.createElement("div");
    todoDueDate.textContent = todo.todoDueDate;

    todoRow.appendChild(nameCheckBoxGroup);
    todoRow.appendChild(todoDueDate);
    todoRow.addEventListener("click", () => {
      const todos = TodoController.getTodos();
      const currentTodo = todos.find((todoItem) => todoItem.id === todo.id);

      todoDialog.innerHTML = "";

      const todoDialogMainContent = document.createElement("div");
      todoDialogMainContent.classList.add("todo-dialog-main-content");

      const todoDialogHeader = document.createElement("div");
      todoDialogHeader.classList.add(
        "todo-dialog-header",
        currentTodo.todoColor
      );

      const todoDialogHeaderText = document.createElement("div");
      todoDialogHeaderText.textContent = "Todo";

      todoDialogHeader.appendChild(todoDialogHeaderText);

      const customRadios = document.createElement("div");
      customRadios.classList.add("custom-radios");

      for (let i = 1; i <= 4; i++) {
        const radioWrapper = document.createElement("div");

        const radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.id = `color-${i}`;
        radioInput.name = "color";
        radioInput.value = `color-${i}`;
        if (todoRow.classList.contains(`color-${i}`)) radioInput.checked = true;

        radioInput.addEventListener("change", () => {
          todoDialogHeader.className = "todo-dialog-header";
          todoDialogHeader.classList.add(radioInput.value);
          todoRow.className = "todo-row";
          todoRow.classList.add(radioInput.value);
          TodoController.updateTodoColor(currentTodo.id, radioInput.value);
        });

        const radioLabel = document.createElement("label");
        radioLabel.setAttribute("for", `color-${i}`);

        const radioSpan = document.createElement("span");

        const checkImg = document.createElement("img");
        checkImg.src =
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg";
        checkImg.alt = "Checked Icon";

        radioSpan.appendChild(checkImg);
        radioLabel.appendChild(radioSpan);
        radioWrapper.appendChild(radioInput);
        radioWrapper.appendChild(radioLabel);
        customRadios.appendChild(radioWrapper);
      }

      const todoDialogElement = document.createElement("div");
      todoDialogElement.classList.add("todo-dialog-element");

      const todoDialogNameInput = document.createElement("input");
      todoDialogNameInput.type = "text";
      todoDialogNameInput.placeholder = currentTodo.todoName;
      todoDialogNameInput.classList.add("todo-dialog-name");

      const todoDialogDescriptionTextArea = document.createElement("textarea");
      todoDialogDescriptionTextArea.placeholder = currentTodo.todoDescription;
      todoDialogDescriptionTextArea.classList.add("todo-dialog-description");

      todoDialogElement.appendChild(todoDialogNameInput);
      todoDialogElement.appendChild(todoDialogDescriptionTextArea);

      const todoDialogClose = document.createElement("button");
      todoDialogClose.textContent = "Close";
      todoDialogClose.addEventListener("click", () => {
        const updatedName = todoDialogNameInput.value.trim();
        const updatedDescription = todoDialogDescriptionTextArea.value.trim();

        let todos = TodoController.getTodos();
        todos = todos.map((todoItem) => {
          if (todoItem.id === currentTodo.id) {
            todoItem.todoName = updatedName || todoItem.todoName;
            todoItem.todoDescription =
              updatedDescription || todoItem.todoDescription;
          }
          return todoItem;
        });

        localStorage.setItem("todos", JSON.stringify(todos));

        todoName.textContent = updatedName || currentTodo.todoName;
        todoDialog.close();
      });

      const todoDialogDelete = document.createElement("button");
      todoDialogDelete.textContent = "delete";
      todoDialogDelete.addEventListener("click", () => {
        let todos = TodoController.getTodos();
        todos = todos.filter((todoItem) => todoItem.id !== currentTodo.id);
        localStorage.setItem("todos", JSON.stringify(todos));

        todoRow.remove();

        todoDialog.close();
      });

      const todoDialogButtonsGroup = document.createElement("div");
      todoDialogButtonsGroup.appendChild(todoDialogClose);
      todoDialogButtonsGroup.appendChild(todoDialogDelete);
      todoDialogButtonsGroup.classList.add("todo-dialog-button-group");

      todoDialogHeader.appendChild(customRadios);

      todoDialogMainContent.appendChild(todoDialogHeader);
      todoDialogMainContent.appendChild(todoDialogElement);
      todoDialogMainContent.appendChild(todoDialogButtonsGroup);

      todoDialog.appendChild(todoDialogMainContent);
      todoDialog.showModal();
    });

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
    todoCategory,
    "color-1"
  );

  todoUIController.renderTodo(newTodo);

  dialog.close();

  document.querySelector("form").reset();
});

window.addEventListener("DOMContentLoaded", () => {
  const todos = TodoController.getTodos();
  todos.forEach((todo) => todoUIController.renderTodo(todo));
});

const hamburgerButton = document.querySelector(".hamburger-button");
const sidebar = document.querySelector(".sidebar");

hamburgerButton.addEventListener("click", () => {
  hamburgerButton.classList.toggle("active");
  sidebar.classList.toggle("active");
});
