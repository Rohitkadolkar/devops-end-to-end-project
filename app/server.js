const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Prometheus Metrics
client.collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: 'app_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method','route','code']
});

// In-memory DB
let todos = [];
let id = 1;

// Health
app.get('/health', (req, res) => res.status(200).send('OK'));

// Metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Static Angular UI
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- API FIXED FOR ANGULAR --------------------

// Return format Angular expects
function convertToAngular(todo) {
  return {
    _id: todo.id,         // Angular expects _id
    text: todo.title,     // Angular expects text
    completed: todo.completed
  };
}

// GET all todos
app.get('/api/todos', (req, res) => {
  requestCounter.inc({method:'GET',route:'/api/todos',code:200});
  res.json(todos.map(convertToAngular));
});

// CREATE todo
app.post('/api/todos', (req, res) => {

  const todo = {
    id: id++,
    title: req.body.text || "Untitled Task",   // Angular sends "text"
    completed: false
  };

  todos.push(todo);

  requestCounter.inc({method:'POST',route:'/api/todos',code:201});
  res.status(201).json(todos.map(convertToAngular));
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const todoId = Number(req.params.id);
  const index = todos.findIndex(t => t.id === todoId);

  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  todos.splice(index, 1);

  requestCounter.inc({method:'DELETE',route:'/api/todos/:id',code:200});
  res.json(todos.map(convertToAngular));
});

// Start server
app.listen(PORT, () => console.log(Todo app running on port ${PORT}));
