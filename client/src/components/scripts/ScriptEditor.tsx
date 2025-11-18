// src/components/Scripts/ScriptEditor.tsx
import React, { useState } from 'react';
import { Script, CreateScriptRequest, UpdateScriptRequest } from '../../types/Script';
import { Task } from '../../types/Task';

interface ScriptEditorProps {
  script: Script | null; 
  onSave: (data: CreateScriptRequest | UpdateScriptRequest) => void;
  onCancel?: () => void;
}

export default function ScriptEditor({
  script,
  onSave,
  onCancel
}: ScriptEditorProps) {
  const [title, setTitle] = useState(script?.title || "");
  const [tasks, setTasks] = useState<Task[]>(script?.tasks || []);
  const [taskText, setTaskText] = useState("");

  const addTask = () => {
    if (!taskText.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      statement: taskText
    };

    setTasks(prev => [...prev, newTask]);
    setTaskText("");
  };

  const handleSubmit = () => {
    onSave({ title, tasks });
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3>{script ? "Edit Script" : "Create Script"}</h3>

      <div>
        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>New Task:</label>
        <input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />
        <button onClick={addTask} style={{ marginLeft: "1rem" }}>Add Task</button>
      </div>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.statement}</li>
        ))}
      </ul>

      <button onClick={handleSubmit}>Save</button>
      {onCancel && (
        <button onClick={onCancel} style={{ marginLeft: "1rem" }}>
          Cancel
        </button>
      )}
    </div>
  );
}
