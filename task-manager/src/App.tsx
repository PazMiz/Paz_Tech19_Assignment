import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { getTasks, createTask, updateTask, deleteTask, getCategories } from "./services/api";
import './App.css';
import { Container, AppBar, Toolbar, Typography, Button, Paper } from "@mui/material";

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

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log("Fetching tasks and categories...");
    getTasks().then(setTasks).catch(console.error);
    getCategories().then(setCategories).catch(console.error);
  }, []);
  


  const addTask = async (newTask: { title: string; description?: string; category_id?: number }) => {
    try {
      const taskToAdd = {
        ...newTask,
        created_at: new Date().toISOString(),
        completed: false,
        id: Date.now(),
      };
      const createdTask = await createTask(taskToAdd);
      setTasks([...tasks, createdTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const editTask = async (updatedTask: Task) => {
    try {
      const task = await updateTask(updatedTask);
      if (task) {
        setTasks((prevTasks) => {
          return prevTasks.map((t) => (t.id === task.id ? task : t));
        });
        setEditingTask(null);
        setOpen(false);
      } else {
        console.error("No task returned from updateTask");
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const removeTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };

  const toggleComplete = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      try {
        const updated = await updateTask(updatedTask);
        setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      } catch (error) {
        console.error("Error toggling task completion:", error);
      }
    }
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Task Manager</Typography>
        </Toolbar>
      </AppBar>
      <main style={{ marginTop: 20 }}>
        <Paper style={{ padding: 20, marginBottom: 20 }}>
          <Typography variant="h5" gutterBottom>Task Management</Typography>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            color="primary"
            aria-label="Add new task"
            style={{ marginBottom: 20 }}
          >
            Add Task
          </Button>
          <TaskForm
            onAdd={addTask}
            onEdit={editTask}
            taskToEdit={editingTask}
            onCancel={() => {
              setEditingTask(null);
              setOpen(false);
            }}
            categories={categories}
            open={open}
            setOpen={setOpen}
          />
        </Paper>
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          categories={categories}
          onEdit={(task) => {
            setEditingTask(task);
            setOpen(true);
          }}
          onDelete={removeTask}
          onToggleComplete={toggleComplete}
        />
      </main>
      <footer style={{ marginTop: 20, padding: 10, textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          © 2024 Paz Task Manager. All rights reserved.
        </Typography>
      </footer>
    </Container>
  );
};

export default App;
