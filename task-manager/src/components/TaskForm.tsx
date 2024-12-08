import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
  category_id?: number;
}

interface TaskFormProps {
  onAdd: (task: Task) => void;
  onEdit: (task: Task) => void;
  taskToEdit: Task | null;
  onCancel: () => void;
  categories: Category[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onAdd,
  onEdit,
  taskToEdit,
  onCancel,
  categories,
  open,
  setOpen,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // Use null to represent "no selection"
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setSelectedCategory(taskToEdit.category_id ?? null); // Set to null if undefined
    }
  }, [taskToEdit]);

  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value;
    // Ensure value is a number or null
    setSelectedCategory(value === -1 ? null : Number(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      setSnackbarOpen(true);
      return;
    }

    const taskToSave: Task = {
      id: taskToEdit ? taskToEdit.id : Date.now(),
      title,
      description,
      completed: false,
      created_at: taskToEdit ? taskToEdit.created_at : new Date().toISOString(),
      category_id: selectedCategory ?? undefined, // Set to undefined if null
    };

    if (taskToEdit) {
      onEdit(taskToSave);
      setUpdateSnackbarOpen(true);
    } else {
      onAdd(taskToSave);
      setSuccessSnackbarOpen(true);
    }

    // Reset form state
    setTitle("");
    setDescription("");
    setSelectedCategory(null);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{taskToEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="task-form">
            <TextField
              label="Title*"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              InputLabelProps={{ style: { fontSize: '0.75rem' } }}
            />
            <TextField
              label="Description*"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              InputLabelProps={{ style: { fontSize: '0.75rem' } }}
            />
            <TextField
              label="Category"
              fullWidth
              margin="normal"
              select
              value={selectedCategory !== null ? selectedCategory : -1} // Display -1 for "no selection"
              onChange={handleCategoryChange}
            >
              <MenuItem value={-1} disabled>Select a category</MenuItem>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={-1} disabled>No categories available</MenuItem>
              )}
            </TextField>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                onClick={onCancel}
                color="error"
                variant="contained"
                sx={{ width: '200px' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{ width: '200px' }}
              >
                {taskToEdit ? "Update Task" : "Add Task"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          Title is required!
        </Alert>
      </Snackbar>
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessSnackbarOpen(false)} severity="success">
          Task added successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={updateSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setUpdateSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setUpdateSnackbarOpen(false)} severity="success">
          Task updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default TaskForm;