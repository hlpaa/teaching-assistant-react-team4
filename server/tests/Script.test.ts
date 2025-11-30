import { Script } from '../src/models/Script';
import { Task } from '../src/models/Task';

describe('Script.addTask', () => {
  let script: Script;
  let task1: Task;
  let task2: Task;

  beforeEach(() => {
    // Arrange - Configuração inicial antes de cada teste
    script = new Script('script-1', 'Roteiro de Exemplo');
    task1 = new Task('task-1', 'Primeira tarefa');
    task2 = new Task('task-2', 'Segunda tarefa');
  });

  test('should add a task successfully when task is not already in script', () => {
    // Act - Execução da função que estamos testando
    const result = script.addTask(task1);

    // Assert - Verificações do resultado
    expect(result).toBe(task1);
    expect(script.tasks).toHaveLength(1);
    expect(script.tasks[0]).toBe(task1);
    expect(script.findTaskById('task-1')).toBe(task1);
  });

  test('should throw error when trying to add a task that already exists', () => {
    // Arrange - Adiciona a task primeiro
    script.addTask(task1);

    // Act & Assert - Verifica se lança erro ao tentar adicionar novamente
    expect(() => {
      script.addTask(task1);
    }).toThrow('Task already in script');
    
    // Verifica que a lista continua com apenas 1 task
    expect(script.tasks).toHaveLength(1);
  });

  test('should add multiple different tasks successfully', () => {
    // Act
    script.addTask(task1);
    script.addTask(task2);

    // Assert
    expect(script.tasks).toHaveLength(2);
    expect(script.findTaskById('task-1')).toBe(task1);
    expect(script.findTaskById('task-2')).toBe(task2);
  });

  test('should return the same task instance that was added', () => {
    // Act
    const returnedTask = script.addTask(task1);

    // Assert
    expect(returnedTask).toBe(task1);
    expect(returnedTask).toBeInstanceOf(Task);
  });
});