import React, { useState } from 'react';
import { Student } from '../types/Student';
import { EVALUATION_GOALS, Grade } from '../types/Evaluation';
import { studentService } from '../services/StudentService';

interface EvaluationsProps {
  students: Student[];
  onStudentUpdated: () => void;
  onError: (errorMessage: string) => void;
}

const Evaluations: React.FC<EvaluationsProps> = ({ students, onStudentUpdated, onError }) => {
  const [updatingCells, setUpdatingCells] = useState<Set<string>>(new Set());

  // Function to get grade for a specific student and goal
  const getGradeForStudentGoal = (student: Student, goal: string): string | null => {
    const evaluation = student.evaluations?.find(evaluation => evaluation.goal === goal);
    return evaluation ? evaluation.grade : null;
  };

  // Function to update evaluation for a student
  const updateEvaluation = async (student: Student, goal: string, grade: Grade | '') => {
    const cellKey = `${student.cpf}-${goal}`;
    setUpdatingCells(prev => new Set(prev).add(cellKey));

    try {
      // Use the specific evaluation update API endpoint
      await studentService.updateEvaluation(student.cpf, goal, grade);
      
      // Notify parent to reload student data
      onStudentUpdated();
    } catch (error) {
      onError((error as Error).message);
    } finally {
      setUpdatingCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }
  };

  if (students.length === 0) {
    return (
      <div className="evaluations-container">
        <h2>Student Evaluations</h2>
        <div className="no-students">
          No students available for evaluation. Add students first in the Students tab.
        </div>
      </div>
    );
  }

  return (
    <div className="evaluations-container">
      <h2>Student Evaluations</h2>
      <p>Evaluation grades: MANA (Must Not Approve), MPA (May Pass), MA (Must Approve)</p>
      
      <div className="table-container">
        <table className="evaluations-table">
          <thead>
            <tr>
              <th>Student Name</th>
              {EVALUATION_GOALS.map(goal => (
                <th key={goal}>{goal}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.cpf}>
                <td><strong>{student.name}</strong></td>
                {EVALUATION_GOALS.map(goal => {
                  const grade = getGradeForStudentGoal(student, goal);
                  const cellKey = `${student.cpf}-${goal}`;
                  const isUpdating = updatingCells.has(cellKey);
                  
                  return (
                    <td key={goal} className="grade-cell">
                      <select
                        value={grade || ''}
                        onChange={(e) => updateEvaluation(student, goal, e.target.value as Grade | '')}
                        disabled={isUpdating}
                        className={`grade-select ${grade ? `grade-${grade}` : 'no-grade'} ${isUpdating ? 'updating' : ''}`}
                      >
                        <option value="">—</option>
                        <option value="MANA">MANA</option>
                        <option value="MPA">MPA</option>
                        <option value="MA">MA</option>
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Evaluations;