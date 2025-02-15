import "./styles.css";

class Todo {
  constructor(taskName, taskDescription, dueDate, list) {
    this.id = Date.now() + Math.random();
    this.completed = false;
    this.taskName = taskName;
    this.taskDescription = taskDescription;
    this.dueDate = dueDate;
    this.list = list;
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
