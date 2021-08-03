import React from 'react'

const LoginContext = React.createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {}
  });
  
export const LoginProvider = LoginContext.Provider
export default LoginContext

//<div style={{display: 'flex', justifyContent: 'center'}}><button onClick={()=>setLoggedIn(true)}>LoggedIn: {loggedIn}</button></div>