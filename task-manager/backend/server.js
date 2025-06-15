import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = [];

app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const newTask = { id: Date.now(), title, description };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter((task) => task.id !== id);
  res.status(200).json({ message: 'Deleted' });
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, description } = req.body;
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, title, description } : task
  );
  res.status(200).json({ message: 'Updated' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
