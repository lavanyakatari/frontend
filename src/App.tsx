import { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  _id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    axios.get("http://localhost:3000/tasks").then((response) => {
      setTasks(response.data);
    });
  }, []);

  // Add new task
  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      axios
        .post("http://localhost:5000/tasks", { text: newTask })
        .then((response) => {
          setTasks([...tasks, response.data]);
          setNewTask("");
        });
    }
  };

  // Toggle task completion
  const handleToggleTask = (id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      axios
        .put(`http://localhost:5000/tasks/${id}`, {
          completed: !task.completed,
        })
        .then((response) => {
          setTasks(tasks.map((t) => (t._id === id ? response.data : t)));
        });
    }
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
      setTasks(tasks.filter((t) => t._id !== id));
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-red-500">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Task
        </button>
        <ul className="list-none">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center p-2 border-b border-gray-200"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task._id)}
                className="mr-2"
              />
              <span
                className={task.completed ? "text-green-500" : "text-gray-500"}
              >
                {task.text}
              </span>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
