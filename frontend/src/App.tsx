import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import './styles/global.scss'
import {AuthProvider} from "./contexts/AuthContext.tsx";
function App() {
    return (
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
