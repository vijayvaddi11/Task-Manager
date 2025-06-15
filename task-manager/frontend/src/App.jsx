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
    <div className='min-h-screen bg-white-50 py-10 px-4'>
      <div className='max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8'>
        <h1 className='text-4xl font-bold text-gray-800 mb-6'>Add New Task</h1>

        <div className='space-y-4 mb-8'>
          <input
            className='w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
            placeholder='Task Name'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={editingId ? handleUpdate : handleAdd}
            className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition'
          >
            {editingId ? 'Update Task' : 'Add Task'}
          </button>
        </div>

        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Task List</h2>

        <div className='space-y-4'>
          {tasks.length === 0 && (
            <p className='text-gray-500 italic'>No tasks available.</p>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className='bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm'
            >
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>
                  {task.title}
                </h3>
                <p className='text-gray-600 text-sm'>{task.description}</p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleEdit(task)}
                  className='px-4 py-1 border border-gray-400 text-gray-700 rounded hover:bg-gray-100'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className='px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
