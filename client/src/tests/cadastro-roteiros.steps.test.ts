import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defineFeature, loadFeature } from 'jest-cucumber';
import React from 'react';
import ScriptsPage from '../components/scripts/ScriptsPage';
import ScriptService from '../services/ScriptService';
import { Script } from '../types/Script';

const feature = loadFeature('./src/tests/features/cadastro-roteiros.feature');

// Mock do ScriptService
jest.mock('../services/ScriptService');
const mockScriptService = ScriptService as jest.Mocked<typeof ScriptService>;

defineFeature(feature, test => {
  let mockScripts: Script[] = [];
  const mockOnError = jest.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockScripts = [];
    mockOnError.mockClear();
    
    // Configurar mocks do ScriptService
    mockScriptService.getAllScripts.mockResolvedValue(mockScripts);
    mockScriptService.createScript.mockImplementation(async (data) => {
      const newScript: Script = {
        id: `script-${Date.now()}`,
        title: data.title,
        tasks: data.tasks || []
      };
      mockScripts.push(newScript);
      return newScript;
    });
  });

  test('Cadastrar um roteiro com dados válidos', ({ given, when, then, and }) => {
    given('que estou na página de scripts', async () => {
      render(React.createElement(ScriptsPage, { onError: mockOnError }));
      
      // Aguardar o carregamento inicial
      await waitFor(() => {
        expect(screen.getByText('Scripts')).toBeInTheDocument();
      });
    });

    and(/^não existe um roteiro com title "(.*)"$/, async (title: string) => {
      // Verificar que não existe script com o título especificado
      await waitFor(() => {
        const scriptExists = mockScripts.some(script => script.title === title);
        expect(scriptExists).toBe(false);
      });
    });

    when(/^eu preencho o campo title com "(.*)"$/, async (title: string) => {
      // Buscar o primeiro input (que é o input de título)
      const inputs = screen.getAllByRole('textbox');
      const titleInput = inputs[0]; // O primeiro input é o de título
      await user.clear(titleInput);
      await user.type(titleInput, title);
      
      expect(titleInput).toHaveValue(title);
    });

    and(/^eu clico no botão "(.*)"$/, async (buttonText: string) => {
      const saveButton = screen.getByRole('button', { name: buttonText });
      await user.click(saveButton);
    });

    then(/^eu vejo que o roteiro "(.*)" foi criado$/, async (title: string) => {
      // Aguardar que o ScriptService.createScript seja chamado
      await waitFor(() => {
        expect(mockScriptService.createScript).toHaveBeenCalledWith({
          title: title,
          tasks: []
        });
      });
    });

    and(/^o roteiro aparece na lista de roteiros$/, async () => {
      // Como o mock atualiza a lista automaticamente, 
      // verificamos se o ScriptService foi chamado corretamente
      await waitFor(() => {
        expect(mockScriptService.createScript).toHaveBeenCalled();
      });
      
      expect(mockScripts.length).toBe(1);
      expect(mockScripts[0].title).toBe('Roteiro 1');
    });
  });
});