import { CreateScriptRequest, Script, UpdateScriptRequest } from '../types/Script';

// Mock implementation do ScriptService
class MockScriptService {
  private scripts: Script[] = [];

  async createScript(data: CreateScriptRequest): Promise<Script> {
    const newScript: Script = {
      id: `script-${Date.now()}-${Math.random()}`,
      title: data.title,
      tasks: data.tasks || []
    };
    this.scripts.push(newScript);
    return newScript;
  }

  async getAllScripts(): Promise<Script[]> {
    return [...this.scripts];
  }

  async getScriptById(id: string): Promise<Script> {
    const script = this.scripts.find(s => s.id === id);
    if (!script) {
      throw new Error('Script not found');
    }
    return script;
  }

  async updateScript(id: string, data: UpdateScriptRequest): Promise<Script> {
    const index = this.scripts.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Script not found');
    }
    
    const updatedScript = {
      ...this.scripts[index],
      ...data
    };
    this.scripts[index] = updatedScript;
    return updatedScript;
  }

  // Método helper para testes
  reset() {
    this.scripts = [];
  }

  getScripts() {
    return this.scripts;
  }
}

export default new MockScriptService();