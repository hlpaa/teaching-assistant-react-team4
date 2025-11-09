import { Evaluation } from './Evaluation';

export class Student {
  public evaluations: Evaluation[];

  constructor(
    public name: string,
    public cpf: string,
    public email: string,
    evaluations?: Evaluation[]
  ) {
    this.cpf = this.cleanCPF(cpf); // Store only clean CPF internally
    this.validateCPF(this.cpf);
    this.validateEmail(email);
    this.evaluations = evaluations || [];
  }

  private cleanCPF(cpf: string): string {
    return cpf.replace(/[.-]/g, '');
  }

  private validateCPF(cleanCPF: string): void {
    if (cleanCPF.length !== 11 || !/^\d+$/.test(cleanCPF)) {
      throw new Error('Invalid CPF format');
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  // Format CPF for display (000.000.000-00)
  getFormattedCPF(): string {
    return this.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  // Get CPF (stored clean internally)
  getCPF(): string {
    return this.cpf;
  }

  // Add or update an evaluation
  addOrUpdateEvaluation(goal: string, grade: 'MANA' | 'MPA' | 'MA'): void {
    const existingIndex = this.evaluations.findIndex(evaluation => evaluation.getGoal() === goal);
    if (existingIndex >= 0) {
      this.evaluations[existingIndex].setGrade(grade);
    } else {
      this.evaluations.push(new Evaluation(goal, grade));
    }
  }

  // Remove an evaluation
  removeEvaluation(goal: string): boolean {
    const existingIndex = this.evaluations.findIndex(evaluation => evaluation.getGoal() === goal);
    if (existingIndex >= 0) {
      this.evaluations.splice(existingIndex, 1);
      return true;
    }
    return false;
  }

  // Get evaluation for a specific goal
  getEvaluationForGoal(goal: string): Evaluation | undefined {
    return this.evaluations.find(evaluation => evaluation.getGoal() === goal);
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      name: this.name,
      cpf: this.getFormattedCPF(),
      email: this.email,
      evaluations: this.evaluations.map(evaluation => evaluation.toJSON())
    };
  }
}