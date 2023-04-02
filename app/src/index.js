import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login'
import Register from './pages/Register';
import PatientProfile from './pages/PatientProfile';


const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Dashboard/>,
      errorElement: <ErrorPage/>
    },
    {
      path:"/login",
      element:<Login/>
    },
    {
      path:"/register",
      element:<Register/>
    },
    {
      path:"/patient-profile",
      element: <PatientProfile/>
    }
  ]
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
