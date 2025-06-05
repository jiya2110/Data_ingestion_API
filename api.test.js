import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { IngestionStore } from '../store.js';
import { processBatches } from '../worker.js';
import app from '../app.js'; // You can refactor index.js to export app for testing

describe('Ingestion API', () => {
  let ingestionStore;

  beforeAll(() => {
    ingestionStore = new IngestionStore();
    processBatches(ingestionStore);
    app.locals.ingestionStore = ingestionStore; // set for app to use
  });

  test('POST /ingest - success', async () => {
    const res = await request(app)
      .post('/ingest')
      .send({ ids: [1, 2, 3, 4, 5], priority: 'HIGH' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ingestion_id');
  });

  test('POST /ingest - invalid ids', async () => {
    const res = await request(app)
      .post('/ingest')
      .send({ ids: ['a', 'b'] })
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid ids array');
  });

  test('GET /status/:id - not found', async () => {
    const res = await request(app).get('/status/nonexistentid');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not found');
  });
});
