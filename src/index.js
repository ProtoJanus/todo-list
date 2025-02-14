import "./styles.css";

const dialog = document.querySelector(".new-task-dialog");

const newTaskButton = document.querySelector(".new-task-button");
newTaskButton.addEventListener("click", () => {
  dialog.showModal();
});

const closeDialog = document.querySelector(".close-dialog");
closeDialog.addEventListener("click", () => {
  dialog.close();
});
