import { useState, useEffect } from 'react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  const addTask = () => {
    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([...tasks, task]);
        setNewTitle('');
      });
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' }).then(() =>
      setTasks(tasks.filter((task) => task.id !== id))
    );
  };

  return (
    <div>
      <input
        className='border p-2 mr-2'
        placeholder='New task'
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <button onClick={addTask} className='bg-blue-500 text-white p-2'>
        Add
      </button>

      <ul className='mt-4 space-y-2'>
        {tasks.map((task) => (
          <li
            key={task.id}
            className='bg-white p-3 rounded shadow flex justify-between'
          >
            <span>{task.title}</span>
            <button
              onClick={() => deleteTask(task.id)}
              className='text-red-500'
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
