import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  IndianRupee
} from 'lucide-react';
import Button from '../../components/common/Button';

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions } = useSelector((state) => state.transactions);
  const { customers } = useSelector((state) => state.customers);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, debit, credit
  const [filterDate, setFilterDate] = useState('all'); // all, today, week, month

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customerId === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const customerName = getCustomerName(transaction.customerId);
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = 
      filterType === 'all' ? true :
      transaction.type === filterType;

    let matchesDate = true;
    if (filterDate !== 'all') {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      
      if (filterDate === 'today') {
        matchesDate = transactionDate.toDateString() === today.toDateString();
      } else if (filterDate === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = transactionDate >= weekAgo;
      } else if (filterDate === 'month') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = transactionDate >= monthAgo;
      }
    }

    return matchesSearch && matchesType && matchesDate;
  });

  // Calculate totals
  const totalDebit = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredit = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const TransactionCard = ({ transaction }) => {
    const isDebit = transaction.type === 'debit';
    const customerName = getCustomerName(transaction.customerId);

    return (
      <div 
        onClick={() => navigate(`/customers/${transaction.customerId}`)}
        className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer border-l-4"
        style={{ borderLeftColor: isDebit ? '#DC2626' : '#16A34A' }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-full ${isDebit ? 'bg-red-100' : 'bg-green-100'}`}>
              {isDebit ? (
                <TrendingUp className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                {transaction.description}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <User className="w-4 h-4" />
                <span>{customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(transaction.date).toLocaleDateString('hi-IN')}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${isDebit ? 'text-red-600' : 'text-green-600'}`}>
              {isDebit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-gray-500">
              {isDebit ? 'Purchase / खरीद' : 'Payment / भुगतान'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Transactions / लेन-देन</h1>
            <p className="text-sm opacity-90">{user?.shopName}</p>
          </div>
          <Button onClick={() => navigate('/transactions/add')} variant="primary">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-3xl font-bold text-blue-600">{filteredTransactions.length}</p>
              </div>
              <IndianRupee className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Purchases / खरीद</p>
                <p className="text-3xl font-bold text-red-600">
                  ₹{totalDebit.toLocaleString('en-IN')}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payments / भुगतान</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{totalCredit.toLocaleString('en-IN')}
                </p>
              </div>
              <TrendingDown className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer or description / ग्राहक या विवरण से खोजें"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <span className="flex items-center text-sm text-gray-600 font-medium">
                  <Filter className="w-4 h-4 mr-1" />
                  Type:
                </span>
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('debit')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    filterType === 'debit'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Purchases
                </button>
                <button
                  onClick={() => setFilterType('credit')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    filterType === 'credit'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Payments
                </button>
              </div>

              <div className="flex gap-2 ml-auto">
                <span className="flex items-center text-sm text-gray-600 font-medium">
                  <Calendar className="w-4 h-4 mr-1" />
                  Date:
                </span>
                <button
                  onClick={() => setFilterDate('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    filterDate === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setFilterDate('today')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    filterDate === 'today'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilterDate('week')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    filterDate === 'week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setFilterDate('month')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    filterDate === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <IndianRupee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Transactions Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' || filterDate !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by recording a transaction'}
            </p>
            {!searchTerm && filterType === 'all' && filterDate === 'all' && (
              <Button onClick={() => navigate('/transactions/add')}>
                <Plus className="w-5 h-5 inline mr-2" />
                Add Transaction
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(transaction => (
                <TransactionCard key={transaction.transactionId} transaction={transaction} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;