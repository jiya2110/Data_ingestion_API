import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

async function ingest(ids, priority = 'MEDIUM') {
  const res = await fetch(`${API_URL}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, priority }),
  });
  if (!res.ok) throw new Error('Ingestion failed');
  const data = await res.json();
  console.log(`Ingested batch with ingestion_id: ${data.ingestion_id}`);
  return data.ingestion_id;
}

async function checkStatus(ingestionId) {
  const res = await fetch(`${API_URL}/status/${ingestionId}`);
  if (res.status === 404) {
    console.log(`Ingestion ID ${ingestionId} not found`);
    return null;
  }
  if (!res.ok) throw new Error('Failed to fetch status');
  const data = await res.json();
  return data;
}

async function waitForCompletion(ingestionId) {
  let statusData;
  do {
    statusData = await checkStatus(ingestionId);
    if (!statusData) break;
    console.log(`Status for ${ingestionId}: ${statusData.status}`);
    if (statusData.status === 'completed') break;
    await new Promise(res => setTimeout(res, 3000)); // wait 3 sec before retry
  } while (true);
  return statusData;
}

async function runTests() {
  try {
    const ingestionId1 = await ingest([1, 2, 3, 4, 5], 'HIGH');
    const ingestionId2 = await ingest([6, 7, 8, 9], 'LOW');

    const result1 = await waitForCompletion(ingestionId1);
    console.log('Final Status:', result1);

    const result2 = await waitForCompletion(ingestionId2);
    console.log('Final Status:', result2);

  } catch (err) {
    console.error('Test error:', err);
  }
}

runTests();
