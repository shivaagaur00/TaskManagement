import './App.css';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import Loginpage from './Loginpage';
import TodoList from './Todolist';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
      <Route path='/' element={<Loginpage></Loginpage>}></Route>
      <Route path='/todolist' element={<TodoList></TodoList>}></Route>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
