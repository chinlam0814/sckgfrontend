import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import './App.css';
import MainPage from './MainPage'
import LoginPage from './LoginPage'
import AddUserPage from './AddUserPage'
import ProfilePage from './ProfilePage'
import ChatBoxPage from './ChatBoxPage';
import ChatPage from './ChatPage';
import '@antv/graphin/dist/index.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path = '/' element = {<MainPage/>} />
          <Route path = '/login' element = {<LoginPage/>} />
          <Route path = '/adduser' element = {<AddUserPage/>} />
          <Route path = '/profile' element = {<ProfilePage/>} />
          <Route path = '/chat' element = {<ChatBoxPage/>} />
          <Route path = '/chatbox/:type/:id' element = {<ChatPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
