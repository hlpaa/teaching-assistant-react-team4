export class AnswerGrading {
  private id: string;
  public answerId?: string;
  public comments?: string; 
  public grade?: any;

  constructor(id: string, answerId?: string, comments?: string, grade?: any) {
    this.id = id;
    this.answerId = answerId;
    this.comments = comments;
    this.grade = grade;
  }

  getId(): string {
    return this.id;
  }

  toJSON() {
    return {
      id: this.id,
      answerId: this.answerId,
      comments: this.comments,
      grade: this.grade
    };
  }

  update(data: Partial<{ answerId: any; comments: any; grade: any }>) {
    if (data.answerId !== undefined) this.answerId = data.answerId;
    if (data.comments !== undefined) this.comments = data.comments;
    if (data.grade !== undefined) this.grade = data.grade;
  }

  static fromJSON(obj: any): AnswerGrading {
    return new AnswerGrading(obj.id, obj.title, obj.content);
  }
}