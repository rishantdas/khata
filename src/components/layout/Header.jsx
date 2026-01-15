import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  LogOut,
  Store
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const NavButton = ({ icon: Icon, label, onClick, active }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        active
          ? 'bg-blue-700 text-white'
          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">{user?.shopName}</h1>
              <p className="text-xs text-blue-100">{user?.ownerName}</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <NavButton
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => navigate('/dashboard')}
            />
            <NavButton
              icon={Users}
              label="Customers"
              onClick={() => navigate('/customers')}
            />
            <NavButton
              icon={Receipt}
              label="Transactions"
              onClick={() => navigate('/transactions')}
            />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-100 hover:bg-red-600 hover:text-white transition ml-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;