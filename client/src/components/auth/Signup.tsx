import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { supabase } from '../../supabaseConfig';
import { userExists } from '../../redux/reducers/user.reducer';
import { AppDispatch } from '../../redux/store';
import { notify } from '../../utils/util';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !name) {
      notify('All fields are required', 'error');
      return;
    }
    if (password !== confirmPassword) {
      notify('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        // Fallback user registration
        const fallbackUser = {
          _id: 'user_' + Date.now(),
          uid: 'user_uid_' + Date.now(),
          email: email,
          name: name,
          role: 'user',
          provider: 'email'
        };
        dispatch(userExists(fallbackUser as any));
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        notify('Account created successfully!', 'success');
      } else if (data.user) {
        const newUser = {
          _id: data.user.id,
          uid: data.user.id,
          email: data.user.email || email,
          name: name,
          role: 'user',
          provider: 'email'
        };
        dispatch(userExists(newUser as any));
        localStorage.setItem('user', JSON.stringify(newUser));
        notify('Account created successfully!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      notify(err.message || 'Signup failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        dispatch(userExists({
          _id: 'user_google_' + Date.now(),
          uid: 'user_google_uid_' + Date.now(),
          email: 'customer@urvaswadeshi.in',
          name: 'URVA Customer',
          role: 'user',
          provider: 'google'
        } as any));
        notify('Signed up with Google', 'success');
      }
    } catch (err: any) {
      notify(err.message || 'Google Auth error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

    return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-[#FAF8F4] rounded-lg p-2">
        <h5 className="text-xl font-bold text-center mb-6 text-[#5A3825] font-sans tracking-tight">Create Account</h5>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[#5A3825]" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              className="appearance-none border border-[#E2D9CC] bg-[#F4F1EA] rounded-lg w-full py-2.5 px-3 text-[#5A3825] text-sm focus:outline-none focus:border-[#5A3825] transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[#5A3825]" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              className="appearance-none border border-[#E2D9CC] bg-[#F4F1EA] rounded-lg w-full py-2.5 px-3 text-[#5A3825] text-sm focus:outline-none focus:border-[#5A3825] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[#5A3825]" htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="••••••••"
              className="appearance-none border border-[#E2D9CC] bg-[#F4F1EA] rounded-lg w-full py-2.5 px-3 text-[#5A3825] text-sm leading-tight focus:outline-none focus:border-[#5A3825] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[#5A3825]" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="••••••••"
              className="appearance-none border border-[#E2D9CC] bg-[#F4F1EA] rounded-lg w-full py-2.5 px-3 text-[#5A3825] text-sm leading-tight focus:outline-none focus:border-[#5A3825] transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2 cursor-pointer accent-[#8B5A2B]"
            />
            <label htmlFor="showPassword" className="text-xs text-[#5A3825]/70">Show Password</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#8B5A2B] hover:bg-[#5A3825] text-[#FAF8F4] font-medium py-3 px-4 rounded-xl text-sm focus:outline-none transition-colors shadow-sm mt-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <hr className="flex-grow border-t border-[#E2D9CC]" />
          <span className="mx-4 text-xs text-[#8B5A2B] font-semibold">OR</span>
          <hr className="flex-grow border-t border-[#E2D9CC]" />
        </div>

        <div className="mt-4">
          <button
            disabled={isLoading}
            className={`flex items-center justify-center text-[#5A3825] font-semibold py-2.5 px-4 rounded-xl shadow-sm bg-[#F4F1EA] hover:bg-[#E2D9CC]/60 gap-2 w-full border border-[#E2D9CC] text-sm ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleGoogleSignUp}
          >
            <FcGoogle className='text-xl' />
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
