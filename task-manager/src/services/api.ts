// Base URLs for tasks and categories
const BASE_URL = 'https://paz-tech19-assignment.onrender.com/tasks';
const CATEGORY_BASE_URL = 'https://paz-tech19-assignment.onrender.com/categories';

// Tasks API
export const getTasks = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const createTask = async (newTask: { title: string; description?: string }) => {
  try {
    const response = await fetch(`${BASE_URL}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (task: {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category?: any;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/update/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  const response = await fetch(`${BASE_URL}/delete/${id}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    return; // No content returned, deletion successful
  }

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  return response.json();
};

// Categories API
export const getCategories = async () => {
  const response = await fetch(CATEGORY_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const createCategory = async (category: { name: string }) => {
  try {
    const response = await fetch(`${CATEGORY_BASE_URL}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  const response = await fetch(`${CATEGORY_BASE_URL}/delete/${id}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    return; // No content returned, deletion successful
  }

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }

  return response.json();
};
