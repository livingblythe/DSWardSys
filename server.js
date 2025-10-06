const express = require('express');
const app = express();
app.use(express.json());

// 🔍 Log every incoming request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});

// 🧠 In-memory server list
let servers = [];

// ✅ Add new server
app.post('/addserver', (req, res) => {
  servers.push(req.body);
  console.log("Server added:", req.body.JobId);
  res.send({ status: 'added' });
});

// ✅ Update existing server or add if missing
app.post('/updateserver', (req, res) => {
  const index = servers.findIndex(s => s.JobId === req.body.JobId);
  if (index !== -1) {
    servers[index] = req.body;
    console.log("Server updated:", req.body.JobId);
  } else {
    servers.push(req.body);
    console.log("Server added via update:", req.body.JobId);
  }

  // 🧪 Log current server list
  console.log("Current servers:", JSON.stringify(servers, null, 2));
  res.send({ status: 'updated' });
});

// ✅ Return full server list
app.get('/getlist', (req, res) => {
  const now = Date.now() / 1000;
  const activeServers = servers.filter(s => now - s.LastUpdated < 60);
  res.json({ servers: activeServers });
});


// ✅ Remove server by JobId
app.post('/removeserver', (req, res) => {
  servers = servers.filter(s => s.JobId !== req.body.id);
  console.log("Server removed:", req.body.id);
  res.send({ status: 'removed' });
});

// 🚀 Start server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
