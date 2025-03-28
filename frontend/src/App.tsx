import { useContext } from 'react'
import './App.css'
import { LandingPage } from './components/landing/LandingPage'
import { AuthContext } from './context/auth'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import { HomePage } from './components/home/HomePage'
import { Loader } from './components/ui/loaders/welcomeLoader'

function App() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("check is authprovider provided");
  }

  const {loading, user} = auth;

  if(loading){
    return <Loader/>
  }

  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home"/> : <LandingPage/>}/>
        <Route path="/home/*" element={user ? <HomePage/>:<Navigate to="/"/>}/>
      </Routes>
    </BrowserRouter>
  </>
}

export default App
