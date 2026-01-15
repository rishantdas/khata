import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  UserCheck,
  UserX,
  Activity,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import Button from '../../components/common/Button';
import Header from '../../components/layout/Header';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { customers } = useSelector((state) => state.customers);
  const { transactions } = useSelector((state) => state.transactions);

  // Calculate statistics
  const totalDue = customers.reduce((sum, customer) => sum + customer.totalDue, 0);
  const customersWithDue = customers.filter(c => c.totalDue > 0).length;
  const customersCleared = customers.filter(c => c.totalDue === 0).length;

  // Get date ranges
  const today = new Date();
  const todayStr = today.toDateString();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Today's transactions
  const todayTransactions = transactions.filter(
    t => new Date(t.date).toDateString() === todayStr
  );
  
  const todayPurchases = todayTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const todayPayments = todayTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  // This week's transactions
  const weekTransactions = transactions.filter(
    t => new Date(t.date) >= weekAgo
  );

  // Prepare data for charts
  // 1. Last 7 days transactions
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toDateString();
    const dayTransactions = transactions.filter(
      t => new Date(t.date).toDateString() === dateStr
    );
    
    const purchases = dayTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const payments = dayTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    last7Days.push({
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      purchases,
      payments
    });
  }

  // 2. Customer status pie chart
  const customerStatusData = [
    { name: 'With Due', value: customersWithDue, color: '#DC2626' },
    { name: 'Cleared', value: customersCleared, color: '#16A34A' }
  ];

  // 3. Top 5 customers by due
  const topCustomersByDue = [...customers]
    .filter(c => c.totalDue > 0)
    .sort((a, b) => b.totalDue - a.totalDue)
    .slice(0, 5)
    .map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      due: c.totalDue
    }));

  // Stat Card Component
  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-all' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Icon className="w-4 h-4" />
            <span>{title}</span>
          </div>
          <div className={`text-3xl font-bold ${color} mb-1`}>
            {value}
          </div>
          {subtitle && (
            <div className="text-sm text-gray-500">{subtitle}</div>
          )}
          {trend && (
            <div className={`flex items-center gap-1 text-sm mt-2 ${
              trend.type === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.type === 'up' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  // Recent Activity Card Component
  const RecentActivityCard = ({ transaction }) => {
    const customer = customers.find(c => c.customerId === transaction.customerId);
    const isDebit = transaction.type === 'debit';
    
    return (
      <div 
        onClick={() => navigate(`/customers/${transaction.customerId}`)}
        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition group"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded-full ${isDebit ? 'bg-red-100' : 'bg-green-100'}`}>
            {isDebit ? (
              <TrendingUp className="w-5 h-5 text-red-600" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
              {customer?.name || 'Unknown Customer'}
            </p>
            <p className="text-sm text-gray-600">{transaction.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(transaction.date).toLocaleDateString('hi-IN', { 
                day: 'numeric', 
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${isDebit ? 'text-red-600' : 'text-green-600'}`}>
            {isDebit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-500">
            {isDebit ? 'Purchase' : 'Payment'}
          </p>
        </div>
      </div>
    );
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header />
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">{user?.shopName}</h1>
              <p className="text-blue-100">Welcome back, {user?.ownerName} 👋</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Today's Date</p>
              <p className="text-xl font-semibold">
                {today.toLocaleDateString('hi-IN', { 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Total Customers"
            value={customers.length}
            subtitle="कुल ग्राहक"
            color="text-blue-600"
            onClick={() => navigate('/customers')}
          />
          
          <StatCard
            icon={IndianRupee}
            title="Total Outstanding"
            value={`₹${totalDue.toLocaleString('en-IN')}`}
            subtitle="कुल बकाया"
            color="text-red-600"
          />
          
          <StatCard
            icon={UserCheck}
            title="Customers with Due"
            value={customersWithDue}
            subtitle={`${customersCleared} cleared`}
            color="text-orange-600"
          />
          
          <StatCard
            icon={Activity}
            title="Total Transactions"
            value={transactions.length}
            subtitle="All time"
            color="text-green-600"
            onClick={() => navigate('/transactions')}
          />
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={Calendar}
            title="Today's Transactions"
            value={todayTransactions.length}
            subtitle="आज के लेन-देन"
            color="text-purple-600"
          />
          
          <StatCard
            icon={TrendingUp}
            title="Today's Purchases"
            value={`₹${todayPurchases.toLocaleString('en-IN')}`}
            subtitle="खरीद"
            color="text-red-600"
          />
          
          <StatCard
            icon={ArrowDownRight}
            title="Today's Payments"
            value={`₹${todayPayments.toLocaleString('en-IN')}`}
            subtitle="भुगतान"
            color="text-green-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            Quick Actions / त्वरित क्रियाएं
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/customers/add')}
              variant="primary"
              fullWidth
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add New Customer
            </Button>
            <Button 
              onClick={() => navigate('/transactions/add?type=debit')}
              variant="primary"
              fullWidth
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Record Purchase
            </Button>
            <Button 
              onClick={() => navigate('/transactions/add?type=credit')}
              variant="secondary"
              fullWidth
            >
              <ArrowDownRight className="w-5 h-5 inline mr-2" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Last 7 Days Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Last 7 Days Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Legend />
                <Bar 
                  dataKey="purchases" 
                  fill="#DC2626" 
                  name="Purchases"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="payments" 
                  fill="#16A34A" 
                  name="Payments"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Customer Status
            </h3>
            {customers.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} customers`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No customer data available
              </div>
            )}
          </div>
        </div>

        {/* Top Customers by Due */}
        {topCustomersByDue.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-red-600" />
              Top Customers by Outstanding Due
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCustomersByDue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Bar 
                  dataKey="due" 
                  fill="#DC2626"
                  radius={[0, 8, 8, 0]}
                  name="Outstanding Due"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Recent Activity / हाल की गतिविधि
            </h3>
            <Button 
              onClick={() => navigate('/transactions')}
              variant="outline"
            >
              View All
            </Button>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No transactions yet</p>
              <Button onClick={() => navigate('/transactions/add')}>
                <Plus className="w-4 h-4 inline mr-2" />
                Add First Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 8)
                .map(transaction => (
                  <RecentActivityCard 
                    key={transaction.transactionId} 
                    transaction={transaction} 
                  />
                ))}
            </div>
          )}
        </div>

        {/* Weekly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-8 h-8" />
              <h4 className="text-lg font-semibold">This Week</h4>
            </div>
            <p className="text-3xl font-bold mb-1">{weekTransactions.length}</p>
            <p className="text-purple-100 text-sm">Transactions</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8" />
              <h4 className="text-lg font-semibold">Week Purchases</h4>
            </div>
            <p className="text-3xl font-bold mb-1">
              ₹{weekTransactions
                .filter(t => t.type === 'debit')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString('en-IN')}
            </p>
            <p className="text-red-100 text-sm">Total purchases</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <ArrowDownRight className="w-8 h-8" />
              <h4 className="text-lg font-semibold">Week Payments</h4>
            </div>
            <p className="text-3xl font-bold mb-1">
              ₹{weekTransactions
                .filter(t => t.type === 'credit')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString('en-IN')}
            </p>
            <p className="text-green-100 text-sm">Total payments received</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;