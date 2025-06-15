import { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (taskName && description) {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskName, description }),
      });
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setTaskName('');
      setDescription('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleEdit = (task) => {
    setTaskName(task.title);
    setDescription(task.description);
    setEditingId(task.id);
  };

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:5000/tasks/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskName, description }),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === editingId ? updated : t)));
    setEditingId(null);
    setTaskName('');
    setDescription('');
  };

  return (
    <div className='min-h-screen bg-gray-100 p-10'>
      <h1 className='text-4xl font-bold mb-6'>Add New Task</h1>
      <div className='space-y-4'>
        <input
          className='w-full p-2 border border-gray-300 rounded'
          placeholder='Task Name'
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          className='w-full p-2 border border-gray-300 rounded'
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={editingId ? handleUpdate : handleAdd}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          {editingId ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      <h2 className='text-2xl font-semibold mt-10 mb-4'>Task List</h2>
      <div className='space-y-4'>
        {tasks.map((task) => (
          <div
            key={task.id}
            className='bg-white p-4 rounded shadow flex justify-between items-center'
          >
            <div>
              <h3 className='text-lg font-bold'>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <div className='space-x-2'>
              <button
                onClick={() => handleEdit(task)}
                className='bg-gray-200 px-4 py-1 rounded'
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className='bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
