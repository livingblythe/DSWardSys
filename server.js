const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});


let servers = [];

app.post('/addserver', (req, res) => {
  servers.push(req.body);
  res.send({ status: 'added' });
});

app.post('/updateserver', (req, res) => {
  const index = servers.findIndex(s => s.JobId === req.body.JobId);
  if (index !== -1) servers[index] = req.body;
  res.send({ status: 'updated' });
});

app.get('/getlist', (req, res) => {
  res.send({ servers });
});

app.post('/removeserver', (req, res) => {
  servers = servers.filter(s => s.JobId !== req.body.id);
  res.send({ status: 'removed' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
