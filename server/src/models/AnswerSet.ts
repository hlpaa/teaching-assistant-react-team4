import { Answer } from './Answer';

export class AnswerSet {
  private items: Answer[] = [];

  addAnswer(data: any): Answer {
    const id = data.id ?? Date.now().toString();
    const answer = new Answer(id, data.title, data.content);
    this.items.push(answer);
    return answer;
  }
 

  getAllAnswerSet(): Answer[] {
    return this.items;
  }

  findById(id: string): Answer | undefined {
    return this.items.find(s => s.getId() === id);
  }

  updateAnswer(id: string, data: any): Answer | undefined {
    const Answer = this.findById(id);
    if (!Answer) return undefined;
    Answer.update(data);
    return Answer;
  }
  
}