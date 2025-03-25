// src/app/components/AppWrapper.tsx
"use client"; // Mark this component as client-side

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ReactNode } from "react";

const AppWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      {children} {/* Wrap children with Provider here */}
    </Provider>
  );
};

export default AppWrapper;
