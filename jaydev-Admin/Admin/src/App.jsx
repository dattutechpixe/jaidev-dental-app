import React from 'react'
import MainRoute from './mainroutes/MainRoute'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
    <ToastContainer
  position="top-right"
  autoClose={2000}
  style={{ zIndex: 999999, top: '20px', right: '20px' }}
/>

      
      <MainRoute/>
    </>
  )
}

export default App