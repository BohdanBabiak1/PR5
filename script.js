let addTaskInput = document.getElementById('addTask')
let toDoList = document.getElementById('toDoList')
let i = 1

function deleteTask(item) {
    let confirmation = confirm(`Ви впевнені, що хочете видалити "${item.querySelector('.taskText').textContent}"?`)
    if (confirmation) {
        item.remove()
        saveTasks()
    }
}

function editTask(item) {
    let textTask = item.querySelector('.taskText')
    let oldText = textTask.textContent
    textTask.innerHTML = `<input type="text" class="editTask" value="${oldText}">`
    textTask.querySelector('input').focus()

    let inputField = item.querySelector('.editTask')

    inputField.addEventListener('keyup', function(event) {
        if (event.key == 'Enter') {
            updateText()
        }
    })

    inputField.addEventListener('blur', function() {
        updateText()
    })

    function updateText() {
        let newText = inputField.value.trim()
        if (newText != ''){
            textTask.innerHTML = newText
        } else {
            textTask.innerHTML = oldText
        }
        saveTasks()
    }
}

function addZero(number) {
    if (number < 10) {
        return "0" + number
    } else {
        return number
    }
}

function addTime() {
    let time = new Date()
    let day = addZero(time.getUTCDate())
    let month = addZero(time.getUTCMonth() + 1)
    let year = time.getUTCFullYear()
    let hours = addZero(time.getHours())
    let minutes = addZero(time.getMinutes())
    return `${day}.${month}.${year.toString().substr(-2)},&nbsp${hours}:${minutes}`
}

function saveTasks() {
    let tasks = []
    toDoList.querySelectorAll('.taskItem').forEach(function(task) {
        let taskText = task.querySelector('.taskText').textContent
        let isChecked = task.querySelector('.cbox').checked
        let createDate = task.querySelector('.createDate').textContent
        tasks.push({text: taskText, checked: isChecked, createDate: createDate})
    })
    localStorage.setItem('tasks', JSON.stringify(tasks))
}


function loadTasks() {
    let tasks = localStorage.getItem('tasks')
    if (tasks) {
        tasks = JSON.parse(tasks)
        tasks.forEach(function(task) {
            let newTask = document.createElement('tr')
            newTask.innerHTML = `
            <td class="taskItem">
                <input type="checkbox" class="cbox" ${task.checked ? 'checked' : ''}>
                <span class="taskText">${task.text}</span>
                <span class="createDate">${task.createDate}</span>
                <input type="button" class="delBtn">
            </td>
            `
            if(task.checked){
                let checkbox = newTask.querySelector('.cbox')
                checkbox.disabled = true
                checkbox.style.opacity = '0'
                newTask.querySelector('.taskText').style.textDecoration = 'line-through'
                newTask.classList.add('completedTask')
            }

            toDoList.appendChild(newTask)
            setupTaskEvents(newTask, task.checked)
        })
    }
}

function setupTaskEvents(task, cboxClicked) {
    task.querySelector('.delBtn').addEventListener('click', function() {deleteTask(task)})
        
    let checkboxClicked = cboxClicked
    task.querySelector('.cbox').addEventListener('click', function() {       
        this.disabled = true
        this.style.opacity = '0'
        task.querySelector('.taskText').style.textDecoration = 'line-through'
        task.classList.add('completedTask')
        checkboxClicked = true
        saveTasks()
    })

    task.querySelector('.taskText').addEventListener('dblclick', function() {
        if (!checkboxClicked) {
            editTask(task)
        }
    })
}

window.addEventListener('DOMContentLoaded', function() {
    loadTasks()
    addTaskInput.addEventListener('keyup', function(event) {
        if (event.key == 'Enter') {
            let taskInputText = addTaskInput.value.trim()
            if (taskInputText == ''){
                taskInputText = `Task ${i}`
                i++
            }

            let newTask = document.createElement('tr')
            newTask.innerHTML = `
            <td class="taskItem">
                <input type="checkbox" class="cbox">
                <span class="taskText">${taskInputText}</span>
                <span class="createDate">${addTime()}</span>
                <input type="button" class="delBtn">
            </td>
            `
            toDoList.appendChild(newTask)

            addTaskInput.value = ''
            addTaskInput.focus()

            setupTaskEvents(newTask, false)
            saveTasks()
        }
    })
})
