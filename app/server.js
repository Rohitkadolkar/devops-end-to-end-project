const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ---------------- Prometheus Metrics ----------------
client.collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: 'app_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method','route','code']
});

// ---------------- In-Memory Store ----------------
let todos = [];
let id = 1;

// ---------------- Routes ----------------

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// GET all todos (Angular requires { text: "" })
app.get('/api/todos', (req, res) => {
  requestCounter.inc({method:'GET',route:'/api/todos',code:200});
  res.json(todos);  
});

// CREATE todo (Angular expects .text not .title)
app.post('/api/todos', (req, res) => {
  const todo = {
    _id: id++,             // Angular expects _id, not id
    text: req.body.text,   // Angular expects text
    done: false
  };
  todos.push(todo);
  requestCounter.inc({method:'POST',route:'/api/todos',code:201});
  res.status(201).json(todos);   // Angular expects full updated list
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const todoId = Number(req.params.id);
  todos = todos.filter(t => t._id !== todoId);
  requestCounter.inc({method:'DELETE',route:'/api/todos/:id',code:200});
  res.json(todos);
});

// ---------------- Start Server ----------------
app.listen(PORT, () => console.log(Todo app running on port ${PORT}));
