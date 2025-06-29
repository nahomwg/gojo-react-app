import React from 'react';
import { SignupForm } from '../components/Auth/SignupForm';

export const SignupPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <SignupForm />
    </div>
  );
};