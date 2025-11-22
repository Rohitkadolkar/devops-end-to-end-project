const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --------------- Prometheus Metrics ---------------
client.collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: 'app_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method','route','code']
});

// --------------- In-Memory Data Store ---------------
let todos = [];
let id = 1;

// --------------- Routes ---------------

// Health check for K8s probes
app.get('/health', (req, res) => res.status(200).send('OK'));

// Metrics for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Home (static UI optional)
app.use(express.static(path.join(__dirname, 'public')));

// CRUD API
app.get('/api/todos', (req, res) => {
  requestCounter.inc({method:'GET',route:'/api/todos',code:200});
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const todo = {
    id: id++,
    title: req.body.title || 'Untitled Task',
    completed: false
  };
  todos.push(todo);
  requestCounter.inc({method:'POST',route:'/api/todos',code:201});
  res.status(201).json(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const todoId = Number(req.params.id);
  const todo = todos.find(t => t.id === todoId);
  if (!todo) return res.status(404).send('Not found');

  todo.title = req.body.title ?? todo.title;
  todo.completed = req.body.completed ?? todo.completed;

  requestCounter.inc({method:'PUT',route:'/api/todos/:id',code:200});
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const todoId = Number(req.params.id);
  const index = todos.findIndex(t => t.id === todoId);
  if (index === -1) return res.status(404).send('Not found');

  const removed = todos.splice(index, 1)[0];
  requestCounter.inc({method:'DELETE',route:'/api/todos/:id',code:200});
  res.json(removed);
});

// --------------- Start Server ---------------
app.listen(PORT, () => console.log(`Todo app running on port ${PORT}`));
