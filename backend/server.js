const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];
let nextId = 1;

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// GET task by id
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST create task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const task = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, completed } = req.body;
  if (title !== undefined) {
    if (title.trim() === '') return res.status(400).json({ error: 'Title cannot be empty' });
    task.title = title.trim();
  }
  if (completed !== undefined) {
    task.completed = completed;
    // Salva o horário de conclusão ao marcar como concluída; limpa ao desmarcar
    task.completedAt = completed ? new Date().toISOString() : null;
  }
  res.json(task);
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).send();
});

// DELETE all completed tasks
app.delete('/api/tasks', (req, res) => {
  tasks = tasks.filter(t => !t.completed);
  res.status(204).send();
});

// Reset (for tests)
app.post('/api/reset', (req, res) => {
  tasks = [];
  nextId = 1;
  res.status(200).json({ message: 'Reset OK' });
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

module.exports = app; 
