import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

//render() - displays the react elements/components into the root.
//App component is our mother component, this is the component we use as entry point and where we can render all other components or pages.
//<React.StrictMode> - component from React that manages future or possible conflicts. It allows us extend or expand certain error messages.
root.render(
  <React.StrictMode>
  <UserProvider>
    <App />
  </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
