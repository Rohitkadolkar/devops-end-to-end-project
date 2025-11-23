const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// -----------------------------------
// Prometheus Metrics
// -----------------------------------
client.collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: 'app_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'code']
});

// -----------------------------------
// In-memory data
// -----------------------------------
let todos = [];
let id = 1;

// -----------------------------------
// Health Check
// -----------------------------------
app.get('/health', (req, res) => res.status(200).send('OK'));

// -----------------------------------
// Prometheus Metrics
// -----------------------------------
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// -----------------------------------
// Static UI
// -----------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// -----------------------------------
// CRUD API
// -----------------------------------

// Get todos
app.get('/api/todos', (req, res) => {
  requestCounter.inc({ method: 'GET', route: '/api/todos', code: 200 });
  res.json(todos);
});

// Create todo
app.post('/api/todos', (req, res) => {
  const todo = {
    _id: id++,               // <-- FIXED here
    text: req.body.text || req.body.title || 'Untitled Task',
    completed: false
  };

  todos.push(todo);

  requestCounter.inc({ method: 'POST', route: '/api/todos', code: 201 });
  res.status(201).json(todo);
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const todoId = Number(req.params.id);

  const index = todos.findIndex(t => t._id === todoId);
  if (index === -1) return res.status(404).send('Not found');

  const removed = todos.splice(index, 1)[0];

  requestCounter.inc({ method: 'DELETE', route: '/api/todos/:id', code: 200 });
  res.json(removed);
});

// -----------------------------------
// Start server
// -----------------------------------
app.listen(PORT, () => {
  console.log(Todo app running on port ${PORT});
});
