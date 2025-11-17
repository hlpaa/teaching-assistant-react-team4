export class Answer {
  private id: string;
  public studentId: string;
  public scriptId: string;
  public content: any;

  constructor (id: string, studentId : string, scriptId: string, content?: any){
    this.id = id;
    this.studentId = studentId;
    this.scriptId = scriptId;
    this.content = content;

  } 

  getId(): string {
    return this.id;
  }

  toJSON() {
    return {
      id: this.id,
      studentId: this.studentId,
      scriptId: this.scriptId,
      content: this.content
    };
  }

  update(data: Partial<{ studentId: any, scriptId: any, content: any }>) {
    if (data.studentId !== undefined) this.studentId = data.studentId;
    if(data.scriptId !== undefined) this.scriptId = data.scriptId;
    if (data.content !== undefined) this.content = data.content;
  }

  static fromJSON(obj: any): Answer {
    return new Answer(obj.id, obj.title, obj.content);
  }
}