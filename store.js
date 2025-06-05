import { v4 as uuidv4 } from 'uuid';

export class IngestionStore {
  constructor() {
    this.ingestions = new Map();
    this.batches = new Map();
    this.queues = {
      HIGH: [],
      MEDIUM: [],
      LOW: []
    };
  }

  addIngestion(id, ids, priority = 'LOW') {
    if (!['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
      priority = 'LOW'; // fallback default
    }

    const batches = [];
    for (let i = 0; i < ids.length; i += 3) {
      const batchIds = ids.slice(i, i + 3);
      const batchId = uuidv4();
      this.batches.set(batchId, { ids: batchIds, status: 'yet_to_start' });
      this.queues[priority].push({ batchId, ids: batchIds, ingestionId: id });
      batches.push(batchId);
    }
    this.ingestions.set(id, { batches });
  }

  getStatus(id) {
    const ingestion = this.ingestions.get(id);
    if (!ingestion) return null;

    const statuses = ingestion.batches.map(bid => this.batches.get(bid)?.status || 'unknown');

    const overall = statuses.every(s => s === 'yet_to_start')
      ? 'yet_to_start'
      : statuses.every(s => s === 'completed')
      ? 'completed'
      : 'triggered';

    return {
      ingestion_id: id,
      status: overall,
      batches: ingestion.batches.map(bid => ({
        batch_id: bid,
        ids: this.batches.get(bid).ids,
        status: this.batches.get(bid).status
      }))
    };
  }
}
