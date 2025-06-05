import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { IngestionStore } from './store.js';
import { processBatches } from './worker.js';

const app = express();
app.use(bodyParser.json());

const ingestionStore = new IngestionStore();
processBatches(ingestionStore);

app.post('/ingest', (req, res) => {
  const { ids, priority = 'MEDIUM' } = req.body;

  if (!Array.isArray(ids) || ids.some(id => typeof id !== 'number')) {
    return res.status(400).json({ error: 'Invalid ids array' });
  }

  const validPriorities = ['HIGH', 'MEDIUM', 'LOW'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  const ingestionId = uuidv4();
  ingestionStore.addIngestion(ingestionId, ids, priority);
  res.json({ ingestion_id: ingestionId });
});

app.get('/status/:id', (req, res) => {
  const ingestionId = req.params.id;
  const status = ingestionStore.getStatus(ingestionId);
  if (!status) return res.status(404).json({ error: 'Not found' });
  res.json(status);
});

// Export app for tests
export default app;

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => console.log('Server running on port 5000'));
}
