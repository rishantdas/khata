import { useSelector } from 'react-redux';
import { Users, IndianRupee, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { customers } = useSelector((state) => state.customers);

  const totalDue = customers.reduce((sum, customer) => sum + customer.totalDue, 0);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-12 h-12 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">{user?.shopName}</h1>
          <p className="text-sm opacity-90">Welcome, {user?.ownerName}</p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={Users}
            title="Total Customers / कुल ग्राहक"
            value={customers.length}
            color="text-blue-600"
          />
          <StatCard
            icon={IndianRupee}
            title="Total Due / कुल बकाया"
            value={`₹${totalDue.toLocaleString('en-IN')}`}
            color="text-red-600"
          />
          <StatCard
            icon={Calendar}
            title="Today's Date / आज की तारीख"
            value={new Date().toLocaleDateString('hi-IN')}
            color="text-green-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent transactions</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;