import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { userNotExists } from '../redux/reducers/user.reducer';
import { RootState } from '../redux/store';
import { notify } from '../utils/util';
import { supabase } from '../supabaseConfig';
import { usePageSEO } from '../hooks/usePageSEO';

const ProfilePage: React.FC = () => {
  usePageSEO({
    title: 'My Profile | URVA',
    description: 'Manage your URVA account settings and profile.',
    noIndex: true,
  });

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await supabase.auth.signOut();
    dispatch(userNotExists());
    notify('Logged out successfully', 'info');
  };

  const getInitial = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-10 px-4 flex flex-col items-center font-sans">
      <div className="w-full max-w-md mb-4">
        <BackButton />
      </div>

      <div className="bg-[#FAF8F4] p-8 rounded-3xl shadow-xl border border-[#E2D9CC] max-w-md w-full text-center">
        {user ? (
          <div>
            {/* Avatar Circle with Initial or Photo */}
            <div className="flex justify-center mb-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || 'User Profile'}
                  className="h-20 w-20 rounded-full object-cover shadow-xs border border-[#E2D9CC]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-[#5A3825] text-[#FAF8F4] text-2xl font-bold flex items-center justify-center shadow-xs">
                  {getInitial(user.name)}
                </div>
              )}
            </div>

            {/* User Info */}
            <h1 className="text-xl font-sans font-semibold text-[#5A3825] mb-1">
              {user.name || 'URVA Customer'}
            </h1>
            <p className="text-[#5A3825]/70 text-xs mb-6 font-normal">{user.email}</p>

            {/* Quick Action Buttons */}
            <div className="space-y-2.5 pt-2 border-t border-[#E2D9CC]">
              <Link
                to="/my-orders"
                className="w-full bg-[#8B5A2B] hover:bg-[#5A3825] text-[#FAF8F4] font-medium py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                📦 View My Orders
              </Link>

              <button
                onClick={handleLogout}
                className="w-full bg-[#F4F1EA] hover:bg-[#E2D9CC] text-[#5A3825] border border-[#E2D9CC] font-medium py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <p className="text-[#5A3825]/70 text-xs mb-4">You are not logged in.</p>
            <Link
              to="/auth"
              className="inline-block bg-[#8B5A2B] hover:bg-[#5A3825] text-[#FAF8F4] font-medium py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Sign In to Your Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
