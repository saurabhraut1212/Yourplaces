import React from "react";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import './App.css';
import { useAuth } from "./shared/hooks/auth-hook";


const App = () => {
const {token,login,logout,userId}=useAuth();


  let routes;

  if(token){
   routes=(
    <Routes>
       <Route path="/" element={<Users />} />
       <Route path="/:userId/places" element={<UserPlaces />} />
       <Route path="/places/new" element={<NewPlace />} />
       <Route path="/places/:placeId" element={<UpdatePlace />} />
  
    </Routes>
   )
  }else{
    routes=(
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        
      </Routes>
    )
  }

  return (
    <AuthContext.Provider 
    value={{
      isLoggedIn: !!token ,
      token:token,
      userId:userId,
      login:login, 
      logout:logout}}>
    <Router>
      <MainNavigation />
      <main>
       
          {routes}
     
   
      </main>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
