import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2, 
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react';
import Button from '../../components/common/Button';
import { deleteCustomer } from '../../redux/slices/customerSlice';
import { setTransactions } from '../../redux/slices/transactionSlice';

const CustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { customers } = useSelector((state) => state.customers);
  const { transactions } = useSelector((state) => state.transactions);
  
  const customer = customers.find(c => c.customerId === customerId);

  // Mock transactions - Remove when connecting to backend
  useEffect(() => {
    const mockTransactions = [
      {
        transactionId: 'TXN001',
        customerId: customerId,
        amount: 5000,
        type: 'debit',
        description: 'किराना सामान',
        date: '2024-01-15',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        transactionId: 'TXN002',
        customerId: customerId,
        amount: 2000,
        type: 'credit',
        description: 'भुगतान',
        date: '2024-01-16',
        createdAt: '2024-01-16T11:00:00Z'
      },
      {
        transactionId: 'TXN003',
        customerId: customerId,
        amount: 3000,
        type: 'debit',
        description: 'स्टेशनरी आइटम',
        date: '2024-01-17',
        createdAt: '2024-01-17T09:00:00Z'
      }
    ];
    dispatch(setTransactions(mockTransactions));
  }, [customerId, dispatch]);

  const customerTransactions = transactions.filter(t => t.customerId === customerId);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this customer? / क्या आप इस ग्राहक को हटाना चाहते हैं?')) {
      dispatch(deleteCustomer(customerId));
      navigate('/customers');
    }
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Not Found</h2>
          <Button onClick={() => navigate('/customers')}>
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  const TransactionCard = ({ transaction }) => {
    const isDebit = transaction.type === 'debit';
    return (
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-l-blue-500">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDebit ? 'bg-red-100' : 'bg-green-100'}`}>
              {isDebit ? (
                <TrendingUp className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                {transaction.description}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4" />
                {new Date(transaction.date).toLocaleDateString('hi-IN')}
              </div>
            </div>
          </div>
          <div className={`text-xl font-bold ${isDebit ? 'text-red-600' : 'text-green-600'}`}>
            {isDebit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {isDebit ? 'Purchase / खरीद' : 'Payment / भुगतान'}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 text-white hover:text-blue-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Customers
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm opacity-90">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {customer.phone}
                </span>
                {customer.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {customer.address}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(`/customers/edit/${customerId}`)}
                variant="outline"
              >
                <Edit className="w-4 h-4 inline mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Due Amount Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Total Due / कुल बकाया</h3>
              <div className={`text-4xl font-bold ${customer.totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{customer.totalDue.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {customer.totalDue > 0 ? 'Outstanding / बकाया' : 'All Clear / सब क्लियर'}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate(`/transactions/add?customerId=${customerId}&type=debit`)}
                  fullWidth
                  variant="primary"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Record Purchase / खरीद दर्ज करें
                </Button>
                <Button 
                  onClick={() => navigate(`/transactions/add?customerId=${customerId}&type=credit`)}
                  fullWidth
                  variant="secondary"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Record Payment / भुगतान दर्ज करें
                </Button>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Statistics / आंकड़े</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Transactions</span>
                  <span className="font-semibold">{customerTransactions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Purchases</span>
                  <span className="font-semibold text-red-600">
                    ₹{customerTransactions
                      .filter(t => t.type === 'debit')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Payments</span>
                  <span className="font-semibold text-green-600">
                    ₹{customerTransactions
                      .filter(t => t.type === 'credit')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">Customer Since</span>
                  <span className="font-semibold">
                    {new Date(customer.createdAt).toLocaleDateString('hi-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Transaction History / लेन-देन इतिहास
                </h3>
                <Button 
                  onClick={() => navigate(`/transactions/add?customerId=${customerId}`)}
                  variant="primary"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Transaction
                </Button>
              </div>

              {customerTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    No Transactions Yet
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Start by recording a purchase or payment
                  </p>
                  <Button onClick={() => navigate(`/transactions/add?customerId=${customerId}`)}>
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add First Transaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerTransactions
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(transaction => (
                      <TransactionCard key={transaction.transactionId} transaction={transaction} />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;