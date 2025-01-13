import NewPassword from '@/components/NewPassword';
import React, { Suspense } from 'react';

// Add explicit return type
const Page: React.FC = () => {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <NewPassword />
    </Suspense>
  );
};

export default Page;
