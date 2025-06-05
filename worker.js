// worker.js
export async function processBatches(store) {
  async function processNext() {
    let batch = null;
    let priority = null;

    // Check queues by priority order
    if (store.queues.HIGH.length > 0) {
      priority = 'HIGH';
    } else if (store.queues.MEDIUM.length > 0) {
      priority = 'MEDIUM';
    } else if (store.queues.LOW.length > 0) {
      priority = 'LOW';
    }

    if (priority) {
      batch = store.queues[priority].shift(); // dequeue
      if (batch) {
        // Mark batch as triggered
        store.batches.get(batch.batchId).status = 'triggered';

        // Simulate batch processing delay (e.g., 3 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mark batch as completed
        store.batches.get(batch.batchId).status = 'completed';

        console.log(`Processed batch ${batch.batchId} with IDs: ${batch.ids.join(', ')}`);
      }
    }

    // Schedule next processing after 5 seconds
    setTimeout(processNext, 5000);
  }

  processNext();
}
