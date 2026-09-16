import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Scholarship admin</h1>
        <p style={styles.subtitle}>Sign in to manage applications</p>

        <label style={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="admin@mota.gov.in"
        />

        <label style={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          placeholder="Enter your password"
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '340px',
    background: '#fff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 24px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '6px',
    marginTop: '16px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  error: {
    color: '#c0392b',
    fontSize: '13px',
    marginTop: '12px',
  },
  button: {
    width: '100%',
    marginTop: '24px',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#1d1d1b',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
};

export default Login;
