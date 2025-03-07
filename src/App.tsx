import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

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
        .post("http://localhost:3000/tasks", { text: newTask })
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
        .put(`http://localhost:3000/tasks/${id}`, {
          completed: !task.completed,
        })
        .then((response) => {
          setTasks(tasks.map((t) => (t._id === id ? response.data : t)));
        });
    }
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    axios.delete(`http://localhost:3000/tasks/${id}`).then(() => {
      setTasks(tasks.filter((t) => t._id !== id));
    });
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-fuchsia-50 to-violet-200 w-screen h-screen p-4">
      <div className="flex flex-col items-center bg-gradient-to-r from-cyan-700 to-emerald-300  h-screen p-4 border-2 border-black rounded-md">
        <h1 className="text-4xl font-bold text-white mb-6">Todo List</h1>
        <div className="flex flex-row gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="flex bg-white text-black rounded-md border-2 p-2 border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleAddTask}
            className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition duration-300"
          >
            Add Task
          </button>
        </div>

        <ul className="flex flex-col gap-2 items-start w-full max-w-sm">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex flex-row gap-2 items-center justify-between w-full bg-white p-3 rounded-md shadow-md"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span
                  className={`text-lg ${
                    task.completed ? "line-through text-gray-500" : "text-black"
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-600 transition duration-300"
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
