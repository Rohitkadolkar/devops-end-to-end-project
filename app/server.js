const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// ================= Prometheus Metrics =================
client.collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: 'app_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'code']
});

// ================= In-Memory Store =================
let todos = [];
let id = 1;

// ================= Health Check =================
app.get('/health', (req, res) => res.status(200).send('OK'));

// ================= Metrics =================
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// ================= Static UI =================
app.use(express.static(path.join(__dirname, 'public')));

// ================= API FIXES for AngularJS =================

// AngularJS expects: { _id: "1", text: "Buy milk" }
app.get('/api/todos', (req, res) => {
  requestCounter.inc({ method: 'GET', route: '/api/todos', code: 200 });
  
  const mapped = todos.map(t => ({
    _id: t.id.toString(),
    text: t.text
  }));

  res.json(mapped);
});

app.post('/api/todos', (req, res) => {
  const todo = {
    id: id++,
    text: req.body.text || "Untitled Task"   // Angular sends { text: "something" }
  };

  todos.push(todo);

  requestCounter.inc({ method: 'POST', route: '/api/todos', code: 201 });

  // Return updated list in Angular format
  const mapped = todos.map(t => ({
    _id: t.id.toString(),
    text: t.text
  }));

  res.status(201).json(mapped);
});

app.delete('/api/todos/:id', (req, res) => {
  const todoId = Number(req.params.id);
  todos = todos.filter(t => t.id !== todoId);

  requestCounter.inc({ method: 'DELETE', route: '/api/todos/:id', code: 200 });

  const mapped = todos.map(t => ({
    _id: t.id.toString(),
    text: t.text
  }));

  res.json(mapped);
});

// ================= Start Server =================
app.listen(PORT, () => console.log(Todo app running on port ${PORT}));
