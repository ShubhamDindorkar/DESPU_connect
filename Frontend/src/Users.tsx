import { useEffect, useState } from 'react';
import { createUser, fetchUsers } from './api';
import type { User } from './api';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const created = await createUser({ username, email, password, role: 'USER' });
      setUsers((prev) => [...prev, created]);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (e: any) {
      setError(e.message ?? 'Failed to create user');
    }
  };

  return (
    <>
      {/* Create User Form */}
      <div className="user-form">
        <h2 className="form-title">Create New User</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="form-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              placeholder="Enter email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn">
            Create User
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && <div className="error">{error}</div>}

      {/* User List */}
      <div className="user-list-container">
        <h2 className="user-list-title">Registered Users</h2>
        
        {loading && <div className="loading">Loading users...</div>}
        
        {!loading && users.length === 0 && (
          <div className="empty-state">
            No users found. Create your first user above!
          </div>
        )}
        
        {!loading && users.length > 0 && (
          <ul className="user-list">
            {users.map((u) => (
              <li key={u.id ?? `${u.username}-${u.email}`} className="user-item">
                <div className="user-info">
                  <div className="user-username">{u.username}</div>
                  <div className="user-email">{u.email}</div>
                  <div className="user-role">{u.role}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}


