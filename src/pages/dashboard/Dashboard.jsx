import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Users, IndianRupee, TrendingUp, Calendar, Plus } from "lucide-react";
import Button from "../../components/common/Button";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { customers = [] } = useSelector((state) => state.customers);
  const { transactions = [] } = useSelector((state) => state.transactions);

  const totalDue = customers.reduce(
    (sum, customer) => sum + (Number(customer.totalDue) || 0),
    0
  );

  // Get today's transactions
  const todayStr = new Date().toDateString();
  const todayTransactions = transactions.filter(
    (t) => new Date(t.date).toDateString() === todayStr
  );

  const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-6 ${
        onClick ? "cursor-pointer hover:shadow-lg transition" : ""
      }`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-12 h-12 ${color}`} />
      </div>
    </div>
  );

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">{user?.shopName || "Dashboard"}</h1>
          <p className="text-sm opacity-90">
            Welcome{user?.ownerName ? `, ${user.ownerName}` : ""}
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={Users}
            title="Total Customers / कुल ग्राहक"
            value={customers.length}
            color="text-blue-600"
            onClick={() => navigate("/customers")}
          />

          <StatCard
            icon={IndianRupee}
            title="Total Due / कुल बकाया"
            value={`₹${totalDue.toLocaleString("en-IN")}`}
            color="text-red-600"
          />

          <StatCard
            icon={TrendingUp}
            title="Total Transactions / कुल लेन-देन"
            value={transactions.length}
            color="text-green-600"
            onClick={() => navigate("/transactions")}
          />

          <StatCard
            icon={Calendar}
            title="Today's Transactions / आज के लेन-देन"
            value={todayTransactions.length}
            color="text-purple-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions / त्वरित क्रियाएं</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate("/customers/add")} variant="primary" fullWidth>
              <Plus className="w-5 h-5 inline mr-2" />
              Add Customer
            </Button>

            <Button onClick={() => navigate("/transactions/add")} variant="primary" fullWidth>
              <Plus className="w-5 h-5 inline mr-2" />
              Add Transaction
            </Button>

            <Button onClick={() => navigate("/transactions")} variant="outline" fullWidth>
              View All Transactions
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions / हाल के लेन-देन</h2>

          {transactions.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const customer = customers.find(
                  (c) => c.customerId === transaction.customerId
                );

                const isDebit = transaction.type === "debit"; // adjust if your meaning differs
                const sign = isDebit ? "-" : "+"; // usually debit = money out
                const amountClass = isDebit ? "text-red-600" : "text-green-600";

                return (
                  <div
                    key={transaction.transactionId}
                    onClick={() => navigate(`/customers/${transaction.customerId}`)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {customer?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                    </div>

                    <div className="text-right">
                      <p className={`font-bold ${amountClass}`}>
                        {sign}₹{Number(transaction.amount || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString("hi-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
