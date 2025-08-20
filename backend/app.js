// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const activitiesRoutes = require('./routes/activities');
const picsRoutes = require('./routes/pics');
const tasksRoutes = require('./routes/tasks');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Routes
app.use('/api/activities', activitiesRoutes);
app.use('/api/pics', picsRoutes);
app.use('/api/tasks', tasksRoutes);

app.get('/', (req, res) => {
  res.send('Kanban Backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
