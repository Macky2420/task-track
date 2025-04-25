import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Hero from "../pages/Hero";
import Profile from "../pages/Profile";
import Layout from "../layout/Layout";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Hero/>
    },
    {
        path: '/home/:userId',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Home/>
            }
        ]
    },
    {
        path: '/userInfo/:userId',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Profile/>
            }
        ]
    }
])