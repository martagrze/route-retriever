
import React from 'react';
import { Navigation } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="flex items-center justify-center py-6 mb-6">
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 p-2 rounded-full">
          <Navigation className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Route Retriever</h1>
      </div>
    </header>
  );
};

export default AppHeader;
