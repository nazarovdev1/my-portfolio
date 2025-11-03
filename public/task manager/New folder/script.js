// =====================================================================
// TASKFLOW - JAVASCRIPT LOGIC
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
  // === STATE ===
  let tasks = []
  let currentUser = null
  const currentFilters = {
    status: "all", // 'all', 'In Progress', 'Completed'
    priority: "all", // 'all', 'Low', 'Medium', 'High'
    search: "",
    tab: "all", // 'all', 'In Progress', 'Completed'
  }
  let taskIdToDelete = null
  let editingTaskId = null

  // === LOCAL STORAGE KEYS ===
  const USER_KEY_PREFIX = "taskflow_user_"
  const CURRENT_USER_KEY = "taskflow_current_user"
  const THEME_KEY = "taskflow_theme"

  // === DOM ELEMENTS ===
  // Views
  const loginView = document.getElementById("login-view")
  const appView = document.getElementById("app-view")

  // Login
  const loginForm = document.getElementById("login-form")
  const usernameInput = document.getElementById("username")

  // App Header
  const userDisplay = document.getElementById("user-display")
  const addTaskBtn = document.getElementById("add-task-btn")
  const darkModeToggle = document.getElementById("dark-mode-toggle")
  const themeIconLight = document.getElementById("theme-icon-light")
  const themeIconDark = document.getElementById("theme-icon-dark")
  const logoutBtn = document.getElementById("logout-btn")

  // Filters & Tabs
  const searchInput = document.getElementById("search-input")
  const filterStatus = document.getElementById("filter-status")
  const filterPriority = document.getElementById("filter-priority")
  const taskTabs = document.getElementById("task-tabs")

  // Task List
  const taskList = document.getElementById("task-list")
  const emptyState = document.getElementById("empty-state")

  // Task Form Modal
  const taskFormModal = document.getElementById("task-form-modal")
  const taskForm = document.getElementById("task-form")
  const modalTitle = document.getElementById("modal-title")
  const taskIdInput = document.getElementById("task-id")
  const taskTitleInput = document.getElementById("task-title")
  const taskDescriptionInput = document.getElementById("task-description")
  const taskDueDateInput = document.getElementById("task-due-date")
  const taskPriorityInput = document.getElementById("task-priority")
  const statusFieldGroup = document.getElementById("status-field-group")
  const taskStatusInput = document.getElementById("task-status")
  const cancelTaskFormBtn = document.getElementById("cancel-task-form")

  // Delete Modal
  const deleteModal = document.getElementById("delete-modal")
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn")
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn")

  // === INITIALIZATION ===
  function init() {
    // 1. Check for saved theme
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      themeIconLight.classList.add("hidden")
      themeIconDark.classList.remove("hidden")
    } else {
      document.documentElement.classList.remove("dark")
      themeIconLight.classList.remove("hidden")
      themeIconDark.classList.add("hidden")
    }

    // 2. Check for logged-in user
    currentUser = localStorage.getItem(CURRENT_USER_KEY)
    if (currentUser) {
      showAppView()
    } else {
      showLoginView()
    }

    // 3. Add all event listeners
    addEventListeners()
  }

  function showAppView() {
    loginView.classList.add("hidden")
    appView.classList.remove("hidden")
    userDisplay.textContent = currentUser
    loadTasks()
    renderTasks()
  }

  function showLoginView() {
    appView.classList.add("hidden")
    loginView.classList.remove("hidden")
  }

  // === DATA PERSISTENCE (LOCAL STORAGE) ===
  function loadTasks() {
    const userTaskKey = `${USER_KEY_PREFIX}${currentUser}`
    const savedTasks = localStorage.getItem(userTaskKey)
    tasks = savedTasks ? JSON.parse(savedTasks) : getSampleTasks()
  }

  function saveTasks() {
    const userTaskKey = `${USER_KEY_PREFIX}${currentUser}`
    localStorage.setItem(userTaskKey, JSON.stringify(tasks))
  }

  function getSampleTasks() {
    // Return a few sample tasks if the user is new
    return [
      {
        id: "task-1",
        title: "Design homepage mockup",
        description: "Create a high-fidelity mockup in Figma for the new homepage.",
        dueDate: "2025-10-28",
        priority: "High",
        status: "In Progress",
      },
      {
        id: "task-2",
        title: "Develop API endpoints",
        description: "Build REST endpoints for tasks (GET, POST, PUT, DELETE).",
        dueDate: "2025-10-30",
        priority: "Medium",
        status: "In Progress",
      },
      {
        id: "task-3",
        title: "Write project documentation",
        description: "Document the API and frontend components.",
        dueDate: "2025-11-01",
        priority: "Low",
        status: "In Progress",
      },
      {
        id: "task-4",
        title: "Review pull request",
        description: "Review the new authentication feature branch.",
        dueDate: "2025-10-24",
        priority: "Medium",
        status: "Completed",
      },
    ]
  }

  // === RENDERING ===
  function renderTasks() {
    taskList.innerHTML = "" // Clear existing list

    // 1. Filter tasks based on current filters
    const filteredTasks = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(currentFilters.search.toLowerCase())
      const matchesStatus = currentFilters.status === "all" || task.status === currentFilters.status
      const matchesPriority = currentFilters.priority === "all" || task.priority === currentFilters.priority
      const matchesTab = currentFilters.tab === "all" || task.status === currentFilters.tab

      return matchesSearch && matchesStatus && matchesPriority && matchesTab
    })

    // 2. Show empty state if no tasks
    if (filteredTasks.length === 0) {
      emptyState.classList.remove("hidden")
    } else {
      emptyState.classList.add("hidden")
    }

    // 3. Create and append task cards
    filteredTasks.forEach((task) => {
      const taskCard = createTaskCard(task)
      taskList.appendChild(taskCard)
    })
  }

  function createTaskCard(task) {
    const card = document.createElement("div")
    card.className = `bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-all hover:shadow-lg border-l-4 ${task.status === "Completed" ? "border-green-500" : "border-blue-500"}`
    card.dataset.taskId = task.id

    const priorityClass = `priority-${task.priority.toLowerCase()}`

    const formattedDate = task.dueDate
      ? new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No due date"

    card.innerHTML = `
            <div class="flex justify-between items-start">
                <!-- Left side: Checkbox and Content -->
                <div class="flex items-start space-x-4 min-w-0">
                    <!-- Custom Checkbox -->
                    <button class="toggle-complete-btn flex-shrink-0 mt-1 w-5 h-5 rounded-full border-2 ${task.status === "Completed" ? "border-green-500 bg-green-500" : "border-gray-400 dark:border-gray-500"} flex items-center justify-center transition-colors" data-task-id="${task.id}">
                        ${task.status === "Completed" ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-white"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" /></svg>' : ""}
                    </button>
                    
                    <!-- Text Content -->
                    <div class="min-w-0">
                        <p class="font-semibold text-lg truncate ${task.status === "Completed" ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}">${task.title}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">${task.description || "No description."}</p>
                        
                        <!-- Meta Info -->
                        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mt-3 items-start sm:items-center text-sm text-gray-500 dark:text-gray-400">
                            <!-- Due Date -->
                            <div class="flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 flex-shrink-0"><path fill-rule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5h10.5a.75.75 0 0 0 0-1.5H4.75a.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>
                                <span>${formattedDate}</span>
                            </div>
                            <!-- Priority Badge -->
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClass}">
                                ${task.priority}
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- Right side: Actions -->
                <div class="flex-shrink-0 flex items-center space-x-0 sm:space-x-1 pl-2">
                    <button class="edit-btn p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700" data-task-id="${task.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.502a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" /></svg>
                    </button>
                    <button class="delete-btn p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700" data-task-id="${task.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.34.425a.75.75 0 0 0-.5.872l.823 2.47a.75.75 0 0 0 .872.5l2.34-.424a.75.75 0 0 0 .5-.872l-.823-2.47a.75.75 0 0 0-.872-.5l-2.34.424A8.98 8.98 0 0 1 6 3.75a1.25 1.25 0 0 1 1.25-1.25h5A1.25 1.25 0 0 1 13.5 3.75v.443c.795.077 1.58.22 2.34.425a.75.75 0 0 0 .5.872l-.823 2.47a.75.75 0 0 0-.872.5l-2.34-.424a.75.75 0 0 0-.5.872l.823 2.47a.75.75 0 0 0 .872.5l2.34-.424c.76-.135 1.545-.248 2.34-.322V16.25A2.75 2.75 0 0 1 13.75 19h-7.5A2.75 2.75 0 0 1 3.5 16.25V7.918c.795.074 1.58.187 2.34.322a.75.75 0 0 0 .872-.5l.823-2.47a.75.75 0 0 0-.5-.872l-2.34.424a.75.75 0 0 0-.872.5l-.823 2.47a.75.75 0 0 0 .5.872l2.34-.425A8.98 8.98 0 0 1 3.5 7.918V3.75A2.75 2.75 0 0 1 6.25 1h7.5Z" clip-rule="evenodd" /></svg>
                    </button>
                </div>
            </div>
        `

    // Add event listeners to buttons on the card
    card.querySelector(".toggle-complete-btn").addEventListener("click", handleToggleComplete)
    card.querySelector(".edit-btn").addEventListener("click", handleEditTask)
    card.querySelector(".delete-btn").addEventListener("click", handleDeleteTask)

    return card
  }

  // === MODAL HANDLING ===
  function showTaskForm(task = null) {
    taskForm.reset()
    if (task) {
      // Edit mode
      editingTaskId = task.id
      modalTitle.textContent = "Edit Task"
      taskIdInput.value = task.id
      taskTitleInput.value = task.title
      taskDescriptionInput.value = task.description
      taskDueDateInput.value = task.dueDate
      taskPriorityInput.value = task.priority
      taskStatusInput.value = task.status
      statusFieldGroup.classList.remove("hidden")
    } else {
      // Add mode
      editingTaskId = null
      modalTitle.textContent = "Add New Task"
      taskIdInput.value = ""
      taskPriorityInput.value = "Medium" // Default
      statusFieldGroup.classList.add("hidden")
    }
    taskFormModal.classList.remove("hidden")
  }

  function hideTaskForm() {
    taskFormModal.classList.add("hidden")
  }

  function showDeleteModal(taskId) {
    taskIdToDelete = taskId
    deleteModal.classList.remove("hidden")
  }

  function hideDeleteModal() {
    taskIdToDelete = null
    deleteModal.classList.add("hidden")
  }

  // === EVENT HANDLERS ===
  function addEventListeners() {
    // Login
    loginForm.addEventListener("submit", handleLogin)
    logoutBtn.addEventListener("click", handleLogout)

    // Theme
    darkModeToggle.addEventListener("click", handleToggleDarkMode)

    // Filters & Tabs
    searchInput.addEventListener("input", handleFilterChange)
    filterStatus.addEventListener("change", handleFilterChange)
    filterPriority.addEventListener("change", handleFilterChange)
    taskTabs.addEventListener("click", handleTabClick)

    // Task Actions
    addTaskBtn.addEventListener("click", () => showTaskForm())

    // Task Form Modal
    taskForm.addEventListener("submit", handleTaskFormSubmit)
    cancelTaskFormBtn.addEventListener("click", hideTaskForm)

    // Delete Modal
    confirmDeleteBtn.addEventListener("click", handleConfirmDelete)
    cancelDeleteBtn.addEventListener("click", hideDeleteModal)
  }

  // --- Authentication Handlers ---
  function handleLogin(e) {
    e.preventDefault()
    const user = usernameInput.value.trim()
    if (user) {
      currentUser = user
      localStorage.setItem(CURRENT_USER_KEY, currentUser)
      showAppView()
    }
  }

  function handleLogout() {
    currentUser = null
    localStorage.removeItem(CURRENT_USER_KEY)
    showLoginView()
  }

  // --- Theme Handler ---
  function handleToggleDarkMode() {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem(THEME_KEY, "light")
      themeIconLight.classList.remove("hidden")
      themeIconDark.classList.add("hidden")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem(THEME_KEY, "dark")
      themeIconLight.classList.add("hidden")
      themeIconDark.classList.remove("hidden")
    }
  }

  // --- Filter & Tab Handlers ---
  function handleFilterChange() {
    currentFilters.search = searchInput.value
    currentFilters.status = filterStatus.value
    currentFilters.priority = filterPriority.value
    renderTasks()
  }

  function handleTabClick(e) {
    const clickedTab = e.target.closest(".tab-btn")
    if (!clickedTab) return

    const tabValue = clickedTab.dataset.tab
    currentFilters.tab = tabValue

    // Update active tab styles
    document.querySelectorAll("#task-tabs .tab-btn").forEach((btn) => {
      btn.classList.remove("border-blue-500", "text-blue-600", "dark:border-blue-400", "dark:text-blue-400")
      btn.classList.add(
        "border-transparent",
        "text-gray-500",
        "hover:text-gray-700",
        "hover:border-gray-300",
        "dark:text-gray-400",
        "dark:hover:text-gray-200",
        "dark:hover:border-gray-600",
      )
    })

    clickedTab.classList.add("border-blue-500", "text-blue-600", "dark:border-blue-400", "dark:text-blue-400")
    clickedTab.classList.remove(
      "border-transparent",
      "text-gray-500",
      "hover:text-gray-700",
      "hover:border-gray-300",
      "dark:text-gray-400",
      "dark:hover:text-gray-200",
      "dark:hover:border-gray-600",
    )

    // When a tab is clicked, it overrides the status dropdown
    filterStatus.value = "all"
    currentFilters.status = "all"

    renderTasks()
  }

  // --- Task CRUD Handlers ---
  function handleTaskFormSubmit(e) {
    e.preventDefault()

    const taskData = {
      id: editingTaskId || `task-${new Date().getTime()}`,
      title: taskTitleInput.value.trim(),
      description: taskDescriptionInput.value.trim(),
      dueDate: taskDueDateInput.value,
      priority: taskPriorityInput.value,
      status: editingTaskId ? taskStatusInput.value : "In Progress", // Default to 'In Progress' for new tasks
    }

    if (!taskData.title) {
      // We'll use a custom modal for alerts later, but for now, this is fine.
      console.warn("Task title is required.")
      // Simple validation feedback
      taskTitleInput.classList.add("border-red-500", "focus:border-red-500", "focus:ring-red-500")
      taskTitleInput.addEventListener(
        "input",
        () => {
          taskTitleInput.classList.remove("border-red-500", "focus:border-red-500", "focus:ring-red-500")
        },
        { once: true },
      )
      return
    }

    if (editingTaskId) {
      // Update existing task
      tasks = tasks.map((task) => (task.id === editingTaskId ? taskData : task))
    } else {
      // Add new task
      tasks.unshift(taskData) // Add to the beginning of the list
    }

    editingTaskId = null
    saveTasks()
    renderTasks()
    hideTaskForm()
  }

  function handleToggleComplete(e) {
    const taskId = e.currentTarget.dataset.taskId
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      task.status = task.status === "Completed" ? "In Progress" : "Completed"
      saveTasks()
      renderTasks()
    }
  }

  function handleEditTask(e) {
    const taskId = e.currentTarget.dataset.taskId
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      showTaskForm(task)
    }
  }

  function handleDeleteTask(e) {
    const taskId = e.currentTarget.dataset.taskId
    showDeleteModal(taskId)
  }

  function handleConfirmDelete() {
    if (taskIdToDelete) {
      tasks = tasks.filter((task) => task.id !== taskIdToDelete)
      saveTasks()
      renderTasks()
      hideDeleteModal()
    }
  }

  // === START THE APP ===
  init()
})
