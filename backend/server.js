require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { getDb } = require('./config/db');
const { error } = require('./utils/response');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running.', timestamp: new Date().toISOString() });
});

// Init DB then mount routes
getDb().then(() => {
  const authRoutes      = require('./routes/authRoutes');
  const projectRoutes   = require('./routes/projectRoutes');
  const taskRoutes      = require('./routes/taskRoutes');
  const dashboardRoutes = require('./routes/dashboardRoutes');

  app.use('/api/auth',      authRoutes);
  app.use('/api/projects',  projectRoutes);
  app.use('/api/tasks',     taskRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.use((req, res) => error(res, `Route ${req.originalUrl} not found.`, 404));
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    return error(res, 'An unexpected error occurred.', 500);
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
