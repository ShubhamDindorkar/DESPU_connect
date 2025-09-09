export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role?: string;
}

function getAuthHeaders(): HeadersInit {
  // For dev: uses Spring Security in application.properties (admin/admin123)
  const username = import.meta.env.VITE_BASIC_USER ?? 'admin';
  const password = import.meta.env.VITE_BASIC_PASS ?? 'admin123';
  const token = btoa(`${username}:${password}`);
  return { Authorization: `Basic ${token}` };
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('http://localhost:8080/api/users', {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }
  return response.json();
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const response = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`);
  }
  return response.json();
}


