import React, { useState, createContext, useContext } from 'react';

// Create CategoryContext
const CategoryContext = createContext([]);

// AddTaskForm Component
function AddTaskForm({ onAdd }) {
  const categories = useContext(CategoryContext); // Use categories from context

  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium',
    dueDate: '',
    category: categories[0] || '', // Default to the first category or empty
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    onAdd(formData);
    setFormData({
      title: '',
      priority: 'Medium',
      dueDate: '',
      category: categories[0] || '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="form-group">
        <label htmlFor="title">
          Task Title: <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
        />
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority Level:</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dueDate">Due Date:</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

// TaskItem Component
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''}`}
      onClick={onToggle}
    >
      <h3>{task.title}</h3>
      <p>Priority: {task.priority}</p>
      {task.dueDate && <p>Due Date: {task.dueDate}</p>}
      <p>Category: {task.category}</p>
      <button onClick={(e) => e.stopPropagation() || onDelete()}>
        Delete
      </button>
    </div>
  );
}

// App Component
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [categories] = useState(['Work', 'Personal', 'Shopping']); // Predefined categories

  const addTask = (task) => {
    const newTask = { ...task, id: tasks.length + 1, completed: false };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <CategoryContext.Provider value={categories}>
      <div className="app">
        <h1>Task Tracker</h1>
        <AddTaskForm onAdd={addTask} />
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      </div>
    </CategoryContext.Provider>
  );
}
