const BASE_URL = 'http://127.0.0.1:5000/tasks';

export const getTasks = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const createTask = async (newTask: { title: string, description?: string }) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/tasks/new', {  // Use the correct URL for creating tasks
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }

    const data = await response.json();
    return data;  // Assuming the backend returns the created task
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;  // Propagate the error to be handled elsewhere
  }
};

export const updateTask = async (task: { id: number, title: string, description?: string, completed: boolean, category?: any }) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/tasks/update/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    const data = await response.json();
    return data; // Ensure this contains the updated task, including category
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  const response = await fetch(`http://127.0.0.1:5000/tasks/delete/${id}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    return;  // No need to parse the response; just indicate success.
  }

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  // If the response is not 204 and not OK, try parsing JSON as a fallback
  return response.json();
};

 
//// Catagories api

const CATEGORY_BASE_URL = 'http://127.0.0.1:5000/categories';

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
    return;  // No content returned, deletion successful
  }

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }

  return response.json();
};
