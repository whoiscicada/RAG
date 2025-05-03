
import React from 'react';
import { Brain, RefreshCw, Syringe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center glass-card mb-6 rounded-lg border border-white/10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-to-r from-vibrant-blue to-vibrant-purple">
            <Brain size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">RAG System</h1>
        </div>
        <div className="p-1.5 rounded-full bg-gradient-to-r from-vibrant-blue to-vibrant-purple">
          <Syringe size={16} className="text-white" />
        </div>
      </div>
      <Button 
        variant="outline" 
        className="border-white/10 hover:border-white/30 hover:bg-white/5 text-white flex items-center gap-2"
      >
        <RefreshCw size={16} className="mr-1" />
        Reset Index
      </Button>
    </header>
  );
};

export default Header;
