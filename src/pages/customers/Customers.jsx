import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UserCircle, IndianRupee, Phone } from 'lucide-react';
import Button from '../../components/common/Button';
import { setCustomers } from '../../redux/slices/customerSlice';

const Customers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers } = useSelector((state) => state.customers);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, due, noDue

  // Mock data - Remove this when connecting to backend
  useEffect(() => {
    const mockCustomers = [
      {
        customerId: 'CUST001',
        shopkeeperId: user?.shopkeeperId,
        name: 'अमित शर्मा',
        phone: '9876543210',
        address: 'मुख्य बाज़ार, दिल्ली',
        totalDue: 5000,
        createdAt: '2024-01-10T10:00:00Z'
      },
      {
        customerId: 'CUST002',
        shopkeeperId: user?.shopkeeperId,
        name: 'प्रिया वर्मा',
        phone: '9876543211',
        address: 'नेहरू नगर, मुंबई',
        totalDue: 0,
        createdAt: '2024-01-12T11:00:00Z'
      },
      {
        customerId: 'CUST003',
        shopkeeperId: user?.shopkeeperId,
        name: 'राजेश कुमार',
        phone: '9876543212',
        address: 'गांधी रोड, पटना',
        totalDue: 2500,
        createdAt: '2024-01-15T09:00:00Z'
      }
    ];
    dispatch(setCustomers(mockCustomers));
  }, [dispatch, user]);

  // Filter customers based on search and filter
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    const matchesFilter = 
      filterBy === 'all' ? true :
      filterBy === 'due' ? customer.totalDue > 0 :
      filterBy === 'noDue' ? customer.totalDue === 0 : true;

    return matchesSearch && matchesFilter;
  });

  const CustomerCard = ({ customer }) => (
    <div 
      onClick={() => navigate(`/customers/${customer.customerId}`)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer border border-gray-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <UserCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{customer.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{customer.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${customer.totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ₹{customer.totalDue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-gray-500">
            {customer.totalDue > 0 ? 'Due / बकाया' : 'Clear / क्लियर'}
          </div>
        </div>
      </div>

      {customer.address && (
        <div className="text-sm text-gray-600 border-t pt-2">
          📍 {customer.address}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Customers / ग्राहक</h1>
            <p className="text-sm opacity-90">{user?.shopName}</p>
          </div>
          <Button 
            onClick={() => navigate('/customers/add')}
            variant="primary"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone / नाम या फोन से खोजें"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterBy('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterBy === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All / सभी
              </button>
              <button
                onClick={() => setFilterBy('due')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterBy === 'due' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Due / बकाया
              </button>
              <button
                onClick={() => setFilterBy('noDue')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterBy === 'noDue' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Clear / क्लियर
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
              </div>
              <UserCircle className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Due / बकायेदार</p>
                <p className="text-3xl font-bold text-red-600">
                  {customers.filter(c => c.totalDue > 0).length}
                </p>
              </div>
              <IndianRupee className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Due Amount</p>
                <p className="text-3xl font-bold text-orange-600">
                  ₹{customers.reduce((sum, c) => sum + c.totalDue, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <IndianRupee className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Customer List */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <UserCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Customers Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try a different search term' : 'Add your first customer to get started'}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/customers/add')}>
                <Plus className="w-5 h-5 inline mr-2" />
                Add Customer
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map(customer => (
              <CustomerCard key={customer.customerId} customer={customer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;