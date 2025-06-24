import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import './styles/global.scss'
import {TaskProvider} from "./features/tasks/context/TaskContext.tsx";
function App() {
    return (
        <BrowserRouter>
          <TaskProvider>
            <AppRoutes />
          </TaskProvider>
        </BrowserRouter>
    );
}

export default App;
