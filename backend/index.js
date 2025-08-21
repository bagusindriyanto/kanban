require('dotenv').config();
const express = require('express');
const cors = require('cors');

const activitiesRoutes = require('./routes/activities');
const picsRoutes = require('./routes/pics');
const tasksRoutes = require('./routes/tasks');
const middlewareLogRequest = require('./middleware/logs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(middlewareLogRequest);

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
