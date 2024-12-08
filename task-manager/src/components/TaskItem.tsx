// src/components/TaskItem.tsx
import React from "react";

interface TaskItemProps {
  task: { id: number; title: string; description?: string; completed: boolean };
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  return (
    <div className="task-item">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={onToggleComplete}>
        {task.completed ? "Mark as Incomplete" : "Mark as Completed"}
      </button>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default TaskItem;
