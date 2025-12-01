import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ScriptsPage from '../components/scripts/ScriptsPage';
import ScriptService from '../services/ScriptService';
import { Script } from '../types/Script';

// Mock do ScriptService
jest.mock('../services/ScriptService');
const mockScriptService = ScriptService as jest.Mocked<typeof ScriptService>;

describe('Scripts Components Integration', () => {
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
        id: `script-${Date.now()}-${Math.random()}`,
        title: data.title,
        tasks: data.tasks || []
      };
      mockScripts.push(newScript);
      return newScript;
    });
    
    mockScriptService.updateScript.mockImplementation(async (id, data) => {
      const index = mockScripts.findIndex(s => s.id === id);
      if (index >= 0) {
        mockScripts[index] = { ...mockScripts[index], ...data };
        return mockScripts[index];
      }
      throw new Error('Script not found');
    });
  });

  test('deve criar um script simples e verificar integração entre componentes', async () => {
    // Renderizar a página principal
    render(React.createElement(ScriptsPage, { onError: mockOnError }));
    
    // Verificar que a página carregou
    await waitFor(() => {
      expect(screen.getByText('Scripts')).toBeInTheDocument();
    });

    // Encontrar o input de título (primeiro input)
    const titleInput = screen.getAllByRole('textbox')[0];
    await user.type(titleInput, 'Roteiro Teste');
    
    // Salvar o script
    await user.click(screen.getByRole('button', { name: 'Save' }));
    
    // Verificar que o ScriptService foi chamado
    await waitFor(() => {
      expect(mockScriptService.createScript).toHaveBeenCalledWith({
        title: 'Roteiro Teste',
        tasks: []
      });
    });
  });

  test('deve criar um script com tarefas usando TaskListEditor', async () => {
    render(React.createElement(ScriptsPage, { onError: mockOnError }));
    
    await waitFor(() => {
      expect(screen.getByText('Scripts')).toBeInTheDocument();
    });

    // Preencher título
    const titleInput = screen.getAllByRole('textbox')[0];
    await user.type(titleInput, 'Roteiro com Tarefas');
    
    // Adicionar uma tarefa usando o TaskListEditor
    const taskInput = screen.getByPlaceholderText('New task...');
    await user.type(taskInput, 'Primeira tarefa');
    await user.click(screen.getByText('Add'));
    
    // Verificar que a tarefa apareceu na lista
    expect(screen.getByText('Primeira tarefa')).toBeInTheDocument();
    
    // Salvar o script
    await user.click(screen.getByRole('button', { name: 'Save' }));
    
    // Verificar que foi criado com a tarefa
    await waitFor(() => {
      expect(mockScriptService.createScript).toHaveBeenCalledWith({
        title: 'Roteiro com Tarefas',
        tasks: [
          { id: expect.any(String), statement: 'Primeira tarefa' }
        ]
      });
    });
  });

  test('deve editar um script existente através da integração ScriptList -> ScriptEditor', async () => {
    // Criar um script inicial
    const existingScript: Script = {
      id: 'test-script-1',
      title: 'Script Original',
      tasks: [{ id: 'task-1', statement: 'Tarefa original' }]
    };
    mockScripts.push(existingScript);
    mockScriptService.getAllScripts.mockResolvedValue(mockScripts);
    
    render(React.createElement(ScriptsPage, { onError: mockOnError }));
    
    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getByText('Script Original')).toBeInTheDocument();
    });
    
    // Clicar no botão Edit (integração ScriptList -> ScriptsPage)
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    
    // Verificar que mudou para modo de edição (integração ScriptsPage -> ScriptEditor)
    await waitFor(() => {
      expect(screen.getByText('Edit Script')).toBeInTheDocument();
    });
    
    // Verificar que os dados foram carregados no editor
    expect(screen.getByDisplayValue('Script Original')).toBeInTheDocument();
    expect(screen.getByText('Tarefa original')).toBeInTheDocument();
    
    // Modificar o título
    const titleInput = screen.getByDisplayValue('Script Original');
    await user.clear(titleInput);
    await user.type(titleInput, 'Script Modificado');
    
    // Salvar
    await user.click(screen.getByRole('button', { name: 'Save' }));
    
    // Verificar que o updateScript foi chamado
    await waitFor(() => {
      expect(mockScriptService.updateScript).toHaveBeenCalledWith(
        'test-script-1',
        {
          title: 'Script Modificado',
          tasks: [{ id: 'task-1', statement: 'Tarefa original' }]
        }
      );
    });
  });
});