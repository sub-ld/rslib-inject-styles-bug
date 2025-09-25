import React from 'react';
import './styles.css';

export interface MyComponentProps {
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({ children }) => {
  return (
    <button className="my-component">
      {children}
    </button>
  );
};
