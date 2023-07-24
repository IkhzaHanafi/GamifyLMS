import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Home from './pages/Home';
import ClassDetail from './pages/class/ClassDetail';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Modul from './pages/class/ClassModul';
import MaterialQuiz from './pages/class/ClassQuiz.jsx';
import Discussions from './pages/class/ClassDiscussion';
import ClassTask from './pages/class/ClassTask.jsx';

import TaskForm from './pages/class/TaskForm';
import QuizForm from './pages/class/QuizForm';
import ModulForm from './pages/class/ModulForm';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/class/:classId",
    element: <ClassDetail />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/class/modul/:id",
    element: <Modul />,
  },
  {
    path: "/class/quiz/:id",
    element: <MaterialQuiz />,
  },
  {
    path: "/class/discussion/:id",
    element: <Discussions />,
  },
  {
    path: "/class/task/:id",
    element: <ClassTask />,
  },
  {
    path: "/class/:classId/task",
    element: <TaskForm />,
  },
  {
    path: "/class/:classId/quiz",
    element: <QuizForm />,
  },
  {
    path: "/class/:classId/modul",
    element: <ModulForm />,
  },
]);

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
