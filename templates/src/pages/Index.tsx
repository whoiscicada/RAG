import React, { useState } from 'react';
import Header from '@/components/Header';
import UrlInput from '@/components/UrlInput';
import QueryInput from '@/components/QueryInput';
import ResponseDisplay from '@/components/ResponseDisplay';
import BackgroundEffects from '@/components/BackgroundEffects';
import { QueryResponse } from '@/lib/api';

const Index = () => {
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const handleQueryResult = (response: QueryResponse) => {
    setQueryResponse(response);
  };

  const handleUrlIngested = (url: string) => {
    setCurrentUrl(url);
  };

  return (
    <>
      <BackgroundEffects />
      
      <div className="min-h-screen w-full py-8 px-4 max-w-5xl mx-auto">
        <Header />
        
        {currentUrl && (
          <div className="mb-4 p-3 bg-black/30 rounded-md border border-white/10">
            <p className="text-sm text-white/80">
              Currently analyzing: <span className="text-vibrant-blue">{currentUrl}</span>
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <UrlInput onUrlIngested={handleUrlIngested} />
            <QueryInput onQueryResult={handleQueryResult} currentUrl={currentUrl} />
          </div>
          
          <div>
            <ResponseDisplay 
              response={queryResponse?.response || null} 
              sources={queryResponse?.sources}
            />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-white/50">
          <p>RAG System Interface • {new Date().getFullYear()}</p>
        </footer>
      </div>
    </>
  );
};

export default Index;
