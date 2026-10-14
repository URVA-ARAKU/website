import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#FAFAFA] py-10 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-xs border border-neutral-200 overflow-hidden">
        {/* URVA brand introduction */}
        <div className="hidden md:flex flex-col md:w-1/2 items-center justify-center p-8 bg-neutral-50 border-r border-neutral-200">
          <img src="https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png" alt="URVA — Delivering the Authentic Rural Aura" className="h-28 w-28 mb-4 object-contain" />
          <h1 className="text-2xl font-sans font-semibold text-center mb-1 text-[#111111]">
            URVA
          </h1>
          <p className="text-neutral-500 text-center text-xs mb-6 max-w-xs leading-relaxed font-normal">
            Delivering the Authentic Rural Aura. Discover regional products and the stories behind them.
          </p>
          <div className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs">
            One Village – One Product
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          {isSignUp ? <Signup /> : <Login />}
          <div className="mt-6 text-center">
            <button
              className="text-xs font-semibold text-neutral-800 hover:text-black transition duration-300 underline underline-offset-4"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
