import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const ToDoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [importance, setImportance] = useState("Not Important");
  const [filter, setFilter] = useState("pending");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const importanceLevels = [
    "Not Important",
    "Slightly Important",
    "Important",
    "Very Important",
    "Extremely Important",
  ];

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    const savedTheme = JSON.parse(localStorage.getItem("darkMode"));
    if (savedTasks) setTasks(savedTasks);
    if (savedTheme !== null) setIsDarkMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        completed: false,
        importance,
        importanceLevel: importanceLevels.indexOf(importance),
      },
    ]);
    setTask("");
    setImportance("Not Important");
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const confirmClearAll = () => {
    setShowConfirmModal(true);
  };

  const clearAllTasks = () => {
    setTasks([]);
    setShowConfirmModal(false);
  };

  const cancelClearAll = () => {
    setShowConfirmModal(false);
  };

  const getFilteredTasks = () => {
    let filteredTasks =
      filter === "completed"
        ? tasks.filter((t) => t.completed)
        : tasks.filter((t) => !t.completed);

    if (sortOrder === "asc") {
      filteredTasks = filteredTasks.sort(
        (a, b) => a.importanceLevel - b.importanceLevel
      );
    } else {
      filteredTasks = filteredTasks.sort(
        (a, b) => b.importanceLevel - a.importanceLevel
      );
    }

    return filteredTasks;
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const toggleFilter = () => {
    setFilter(filter === "completed" ? "pending" : "completed");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  return (
    <div className={`container ${isDarkMode ? "dark" : ""}`}>
      <h1>To-Do List</h1>
      <button onClick={toggleDarkMode} className="toggle-dark-mode-btn">
        {isDarkMode ? "🌙" : "☀️"}
      </button>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <select
          value={importance}
          onChange={(e) => setImportance(e.target.value)}
        >
          {importanceLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <button onClick={addTask}>Add</button>
        <button onClick={confirmClearAll}>Clear All</button>
      </div>
      <div className="filter-container">
        <button onClick={toggleFilter}>
          {filter === "completed" ? "Show Pending" : "Show Completed"}
        </button>
        <button onClick={toggleSortOrder}>
          Sort by Importance {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>
      <ul className="task-list">
        {getFilteredTasks().map((task) => (
          <li
            key={task.id}
            className={`task ${task.completed ? "completed" : ""} ${
              isDarkMode ? "dark" : ""
            } ${task.importance.toLowerCase().replace(" ", "-")}`}
          >
            <div className="task-checkbox-container">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
            </div>
            <div className="task-text">{task.text}</div>
            <div className="importance-label">{task.importance}</div>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to clear all tasks?</p>
            <div className="modal-buttons">
              <button onClick={clearAllTasks}>Yes</button>
              <button onClick={cancelClearAll}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ToDoApp />);
