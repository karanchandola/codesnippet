'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', // Added for signup
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        console.log('pass : ', formData.email, formData.password);
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        console.log(result);
        if (result?.error) {
          setError('Invalid credentials');
        } else {
          router.push('/'); // Redirect to home page on successful login
        }
      } else {
        // Handle signup
       const response = await axios.post('/api/auth/register', {
        username: formData.name, email: formData.email, password: formData.password,
      })
          console.log(response);
          console.log(response.data.status);

       if(response.data.status === '201') {
          console.log('User registered successfully');
          // Automatically sign in after successful registration
          console.log('Pass : ', formData.email, formData.password);
          const loginResult = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false,
          });
          console.log(loginResult);

          if (loginResult?.error) {
            setError('Failed to sign in after registration');
          } else {
            router.push('/'); // Redirect to home page on successful login
          }
        } else {
          setError('Registration failed');
        }
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-black">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white text-black p-6 rounded-md shadow-md">
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
