import request from 'supertest';
import { app } from '../src/server';

describe('Scripts Integration Tests', () => {
  test('should create a script and then retrieve it', async () => {
    // 1. Criar um roteiro via API
    const newScript = {
      id: 'test-script-1',
      title: 'Roteiro de Teste'
    };

    const createResponse = await request(app)
      .post('/api/scripts')
      .send(newScript)
      .expect(201);

    // Verificar se foi criado corretamente
    expect(createResponse.body.id).toBe('test-script-1');
    expect(createResponse.body.title).toBe('Roteiro de Teste');
    expect(createResponse.body.tasks).toEqual([]);

    // 2. Buscar o mesmo roteiro via API
    const getResponse = await request(app)
      .get('/api/scripts/test-script-1')
      .expect(200);

    // Verificar se retorna os mesmos dados
    expect(getResponse.body.id).toBe('test-script-1');
    expect(getResponse.body.title).toBe('Roteiro de Teste');
    expect(getResponse.body.tasks).toEqual([]);
  });

  test('should return 404 when trying to get non-existent script', async () => {
    await request(app)
      .get('/api/scripts/non-existent-id')
      .expect(404);
  });
});