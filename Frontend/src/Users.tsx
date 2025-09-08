import { useEffect, useState } from 'react';
import { createUser, fetchUsers, User } from './api';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const created = await createUser({ name, email });
      setUsers((prev) => [...prev, created]);
      setName('');
      setEmail('');
    } catch (e: any) {
      setError(e.message ?? 'Failed to create user');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
      <h1>Users</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {users.map((u) => (
          <li key={u.id ?? `${u.name}-${u.email}`}>{u.name} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
}


