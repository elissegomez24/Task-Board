// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
const card = $(`
            <div class="card task-card mb-3" data-id="${task.id}">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><small class="text-muted">Due: ${task.deadline}</small></p>
                <button class="btn btn-danger btn-sm delete-task">Delete</button>
            </div>
            </div>
        `);

  // Color coding based on deadline

if (task.deadline && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.deadline, 'DD/MM/YYYY');

    console.log("Current Time:", now.format());
    console.log("Task Due Date:", taskDueDate.format('DD/MM/YYYY'));

    // If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
        card.addClass('bg-warning text-white');
        console.log("Status: due today (yellow)");
    } else if (now.isAfter(taskDueDate)) {
        card.addClass('bg-danger text-white');
        card.find('.delete-task').addClass('border-light');
        console.log("Status: overdue (red)");
    } else if (now.add(3, 'day').isAfter(taskDueDate)) {
        card.addClass('bg-warning text-white');
        console.log("Status: nearing deadline (yellow)");
    }
}

return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
$("#todo-cards, #in-progress-cards, #done-cards").empty();

taskList.forEach((task) => {
    const card = createTaskCard(task);
    if (task.status === "to-do") {
    $("#todo-cards").append(card);
    } else if (task.status === "in-progress") {
    $("#in-progress-cards").append(card);
    } else if (task.status === "done") {
    $("#done-cards").append(card);
    }
});

$(".task-card").draggable({
    revert: "invalid",
    stack: ".task-card",
});

$(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop,
});

$(".delete-task").on("click", handleDeleteTask);
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
event.preventDefault();
    const title = $("#taskTitle").val();
    const description = $("#taskDescription").val();
    const deadline = $("#taskDeadline").val();

const newTask = {
    id: generateTaskId(),
    title,
    description,
    deadline,
    status: "to-do",
};

taskList.push(newTask);
saveTasks();
renderTaskList();
$("#formModal").modal("hide");

$("#taskTitle").val('');
$("#taskDescription").val('');
$("#taskDeadline").val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const card = $(event.target).closest(".task-card");
    const taskId = card.data("id");
    taskList = taskList.filter((task) => task.id !== taskId);
saveTasks();
renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const card = $(ui.draggable);
    const taskId = card.data("id");
    const newStatus = $(this).attr("id").replace("-cards", "");

taskList = taskList.map((task) =>
    task.id === taskId ? { ...task, status: newStatus } : task
);
saveTasks();
renderTaskList();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#taskForm").on("submit", handleAddTask);
    // $("#taskDeadline").datepicker(); 
}); 
