// Import necessary React and MUI components
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

// Interface to represent the structure of a category
interface Category {
  id: number;
  name: string;
}

// Interface for the structure of a task
interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  category_id?: number;
}

// Props for the TaskForm component
interface TaskFormProps {
  onAdd: (task: Task) => void; // Callback function to add a new task
  onEdit: (task: Task) => void; // Callback function to edit an existing task
  taskToEdit: Task | null; // Task currently being edited (null if none)
  onCancel: () => void; // Callback function to cancel the form
  categories: Category[]; // List of available categories for tasks
  open: boolean; // Controls whether the dialog is open or not
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Function to set the open state of the dialog
}

// The TaskForm component
const TaskForm: React.FC<TaskFormProps> = ({
  onAdd,
  onEdit,
  taskToEdit,
  onCancel,
  categories,
  open,
  setOpen,
}) => {
  // State variables for form fields and UI state
  const [title, setTitle] = useState<string>(""); // State for task title
  const [description, setDescription] = useState<string>(""); // State for task description
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // State for selected category
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for displaying an error snackbar
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false); // State for success snackbar when a task is added
  const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState(false); // State for success snackbar when a task is updated

  // useEffect hook to populate form fields when editing an existing task
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title); // Set title if editing a task
      setDescription(taskToEdit.description || ""); // Set description, default to empty if undefined
      setSelectedCategory(taskToEdit.category_id ?? null); // Set category_id or null if undefined
    }
  }, [taskToEdit]);

  // Handler for category selection changes
  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value;
    // Convert value to a number or set to null if invalid
    setSelectedCategory(value === -1 ? null : Number(value));
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if title is empty and display an error if true
    if (!title) {
      setSnackbarOpen(true);
      return;
    }

    // Create a task object to save
    const taskToSave: Task = {
      id: taskToEdit ? taskToEdit.id : Date.now(), // Use existing ID or generate a new one if adding a new task
      title,
      description,
      completed: false, // Default to false as tasks start as incomplete
      created_at: taskToEdit ? taskToEdit.created_at : new Date().toISOString(), // Preserve original creation date if editing
      category_id: selectedCategory ?? undefined, // Use undefined if category is null
    };

    // Call appropriate callback based on if editing or adding a new task
    if (taskToEdit) {
      onEdit(taskToSave);
      setUpdateSnackbarOpen(true); // Show snackbar for successful update
    } else {
      onAdd(taskToSave);
      setSuccessSnackbarOpen(true); // Show snackbar for successful addition
    }

    // Reset form state and close the dialog
    setTitle("");
    setDescription("");
    setSelectedCategory(null);
    setOpen(false);
  };

  return (
    <>
      {/* Dialog component for the form */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{taskToEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="task-form">
            {/* Title input field */}
            <TextField
              label="Title*"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              InputLabelProps={{ style: { fontSize: '0.75rem' } }}
            />
            {/* Description input field */}
            <TextField
              label="Description*"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              InputLabelProps={{ style: { fontSize: '0.75rem' } }}
            />
            {/* Category selection dropdown */}
            <TextField
              label="Category"
              fullWidth
              margin="normal"
              select
              value={selectedCategory !== null ? selectedCategory : -1} // Display -1 if no category is selected
              onChange={handleCategoryChange}
            >
              <MenuItem value={-1} disabled>Select a category</MenuItem>
              {categories.length > 0 ? (
                // Populate categories if available
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                // Display a message if no categories are available
                <MenuItem value={-1} disabled>No categories available</MenuItem>
              )}
            </TextField>
            {/* Form action buttons */}
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
      {/* Snackbar for displaying error when title is empty */}
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
      {/* Snackbar for displaying success when a task is added */}
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
      {/* Snackbar for displaying success when a task is updated */}
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
