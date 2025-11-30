import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import { app } from '../src/server';

const feature = loadFeature('./tests/features/cadastro-roteiros.feature');

defineFeature(feature, test => {

  let response: request.Response;

  test('Cadastrar um roteiro com dados válidos', ({ given, when, then, and }) => {

    given(/^que não existe um roteiro com title "(.*)"$/, async (title: string) => {
      // Verify that no script with the given title exists by checking the API
      const getResponse = await request(app).get('/api/scripts');
      expect(getResponse.status).toBe(200);
      expect(Array.isArray(getResponse.body)).toBe(true);
      
      const scriptExists = getResponse.body.some((script: any) => 
        script.title === title
      );
      expect(scriptExists).toBe(false);
    });

    when(/^eu envio um POST para "(.*)" com title "(.*)"$/, async (endpoint: string, title: string) => {
      // Create the data object directly
      const data = { title: title };

      // Send POST request
      response = await request(app)
        .post(endpoint)
        .send(data);
    });

    then(/^o status da resposta é (\d+)$/, (statusCode: string) => {
      expect(response.status).toBe(parseInt(statusCode));
    });

    and(/^ao consultar GET "(.*)" eu vejo um roteiro com title "(.*)"$/, async (endpoint: string, title: string) => {
      const getResponse = await request(app).get(endpoint);
      
      expect(getResponse.status).toBe(200);
      expect(Array.isArray(getResponse.body)).toBe(true);
      
      const scriptExists = getResponse.body.some((script: any) => 
        script.title === title
      );
      expect(scriptExists).toBe(true);
    });
  });
});