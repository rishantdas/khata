import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;