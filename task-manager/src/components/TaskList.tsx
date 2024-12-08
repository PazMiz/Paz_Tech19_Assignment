import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TaskForm from "./TaskForm"; // Import the TaskForm component
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Tooltip } from "@mui/material";
import { updateTask } from '../services/api';

interface Category {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  category?: string; // Category as string
}

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Added this line for type
  categories: Category[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  setTasks,
  categories,
  onDelete,
  onToggleComplete,
}) => {
  const [open, setOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, ] = useState<'asc' | 'desc'>('asc');

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTaskToEdit(null);
  };

  const handleEditSubmit = async (editedTask: Task) => {
    try {
      // Call the API and get the updated task
      const updatedTask = await updateTask(editedTask);

      // Update the state with the updated task returned from the API
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.id === updatedTask.id) {
            return { ...task, ...updatedTask }; // Make sure category and other fields are updated
          }
          return task;
        });
      });

      console.log('Task updated successfully in the database and UI');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete !== null) {
      onDelete(taskToDelete);
      setTaskToDelete(null);
      setDialogOpen(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTaskToDelete(null);
  };

  const filteredTasks = selectedCategory
    ? tasks.filter((task) => task.category === selectedCategory)
    : tasks;

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const comparison = a.created_at.localeCompare(b.created_at);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h6">Filter by Category:</Typography>
        <Button onClick={() => setSelectedCategory(null)}>All Tasks</Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </Box>

      <Box sx={{ marginBottom: "20px" }}>
        {/* <Typography variant="h6">Sort by Date:</Typography>
        <Button onClick={() => setSortOrder('asc')}>Ascending</Button>
        <Button onClick={() => setSortOrder('desc')}>Descending</Button> */}
      </Box>

      {sortedTasks.map((task) => (
        <Paper
          key={task.id}
          elevation={3}
          className={`task-item ${task.completed ? "completed" : ""}`}
          sx={{
            marginBottom: "20px",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            className="task-title"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#333',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '1.5rem', // Adjust size as needed
            }}
          >
            Title: {task.title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: 1,
              backgroundColor: '#f4f4f4',
              borderRadius: 4,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Tooltip title={task.description || "No description available"} arrow>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1rem',
                  color: '#333',
                  fontWeight: '400',
                  whiteSpace: 'normal', // Allow text to break naturally
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3, // Limits to 3 lines and adds ellipsis
                }}
              >
                Desc: {task.description || "No description available"}
              </Typography>
            </Tooltip>
          </Box>


          {/* Category Box with Tooltip for Full View */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 1,
              borderRadius: 4,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: '500',
                color: '#444',
                marginRight: 1,
              }}
            >
              Category:
            </Typography>
            <Tooltip title={task.category || "No category assigned"} arrow>
              <Typography
                variant="body2"
                sx={{
                  color: task.category ? '#333' : '#888',
                  backgroundColor: task.category ? '#e6f7e6' : '#f8d7da',
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: task.category ? '1px solid #28a745' : '1px solid #dc3545',
                  fontSize: '1rem',
                  fontWeight: '400',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {task.category || "No category assigned"}
              </Typography>
            </Tooltip>
          </Box>

          <Box className="task-actions" sx={{ display: "flex", gap: "12px" }}>
            <Button
              onClick={() => onToggleComplete(task.id)}
              variant="contained"
              color={task.completed ? "success" : "primary"}
            >
              {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </Button>
            <Button onClick={() => handleEdit(task)} variant="outlined" color="secondary">
              Edit
            </Button>
            <Button onClick={() => handleDeleteClick(task.id)} variant="outlined" color="error">
              Delete
            </Button>
          </Box>
        </Paper>
      ))}

      <TaskForm
        onEdit={handleEditSubmit}
        taskToEdit={taskToEdit}
        onCancel={handleClose}
        categories={categories}
        open={open}
        setOpen={setOpen}
        onAdd={function (task: Task): void {
          throw new Error("Function not implemented.");
        }}
      />

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;
