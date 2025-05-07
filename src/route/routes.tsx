import React from "react";
import { Navigate } from "react-router-dom";
import Home from "@/view/home";
import Wallet from "@/view/wallet";
import Detail from "@/view/detail";
import History from "@/view/history";

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  auth?: boolean;
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  { path: "/", element: <Home />, auth: false },
  { path: "/wallet", element: <Wallet />, auth: false },
  { path: "/history", element: <History />, auth: false },
  { path: "/detail/:id", element: <Detail />, auth: false },
  { path: "*", element: <Navigate to="/" replace />, auth: false },
];
