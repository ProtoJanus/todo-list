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
    console.log(TodoController.getTodos());
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

  const currentCategory =
    document.querySelector(".todo-table-header").textContent;
  if (currentCategory === todoCategory) {
    todoUIController.renderTodo(newTodo);
  }

  const sidebarUl = document.querySelector(".sidebar ul");

  const existingCategory = Array.from(sidebarUl.children).find(
    (li) => li.textContent === todoCategory
  );

  if (!existingCategory) {
    const newCategoryItem = document.createElement("li");
    newCategoryItem.textContent = todoCategory;
    newCategoryItem.classList.add("category");
    sidebarUl.appendChild(newCategoryItem);
  }

  dialog.close();
  document.querySelector("form").reset();
});

const cancelNewTodoButton = document.querySelector(".cancel-button");
cancelNewTodoButton.addEventListener("click", (e) => {
  dialog.close();
});

window.addEventListener("DOMContentLoaded", () => {
  const todos = TodoController.getTodos();
  const personalTodos = todos.filter(
    (todo) => todo.todoCategory === "Personal"
  );
  personalTodos.forEach((todo) => todoUIController.renderTodo(todo));
});

const hamburgerButton = document.querySelector(".hamburger-button");
const sidebar = document.querySelector(".sidebar");

const sidebarUl = document.createElement("ul");

sidebarUl.addEventListener("click", (event) => {
  const todoTable = document.querySelector(".todo-table");

  if (event.target && event.target.tagName === "LI") {
    console.log(event.target.textContent);
    todoTable.innerHTML = "";
    const todoTableHeader = document.createElement("div");
    todoTableHeader.classList.add("todo-table-header");
    todoTableHeader.textContent = event.target.textContent;

    todoTable.appendChild(todoTableHeader);
    const todos = TodoController.getTodos();
    const currentCategoryTodos = todos.filter(
      (todo) => todo.todoCategory === event.target.textContent
    );
    currentCategoryTodos.forEach((todo) => todoUIController.renderTodo(todo));
  }
});

const categoryPersonal = document.createElement("li");
categoryPersonal.textContent = "Personal";
categoryPersonal.classList.add("category");
sidebarUl.appendChild(categoryPersonal);

const categories = getCategoriesFromTodos();
categories.forEach((category) => {
  const categoryUI = document.createElement("li");
  categoryUI.textContent = category;
  categoryUI.classList.add("category");
  if (category !== "Personal") {
    sidebarUl.appendChild(categoryUI);
  }
});

sidebar.appendChild(sidebarUl);

hamburgerButton.addEventListener("click", () => {
  hamburgerButton.classList.toggle("active");
  sidebar.classList.toggle("active");
});
const input = document.getElementById("list");
const suggestions = document.getElementById("suggestions");
const suggestionItems = suggestions.querySelectorAll(".suggestion-item");

function getCategoriesFromTodos() {
  const todoItems = TodoController.getTodos() || [];
  const categories = new Set();

  todoItems.forEach((item) => {
    if (item.todoCategory) {
      categories.add(item.todoCategory);
    }
  });

  categories.add("Personal");

  return Array.from(categories);
}

input.addEventListener("focus", () => {
  suggestions.style.display = "flex";

  const categories = getCategoriesFromTodos();
  suggestions.innerHTML = "";

  categories.forEach((category) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("suggestion-item");
    suggestionItem.addEventListener("click", () => {
      const categoryListInput = document.getElementById("list");
      categoryListInput.value = suggestionItem.textContent;
    });
    suggestionItem.textContent = category;
    suggestions.appendChild(suggestionItem);
  });
});

input.addEventListener("input", () => {
  const value = input.value.toLowerCase();

  const suggestionItems = suggestions.querySelectorAll(".suggestion-item");

  const visibleItems = Array.from(suggestionItems).filter((item) =>
    item.textContent.toLowerCase().includes(value)
  );

  suggestionItems.forEach((item) => (item.style.display = "none"));

  visibleItems.forEach((item) => (item.style.display = "block"));

  suggestions.style.display = value ? "block" : "none";
});

suggestionItems.forEach((item) => {
  item.addEventListener("click", () => {
    input.value = item.textContent;
    suggestions.style.display = "none";
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-dropdown")) {
    suggestions.style.display = "none";
  }
});
