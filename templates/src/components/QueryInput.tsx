import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiService, QueryResponse } from '@/lib/api';

type QueryInputProps = {
  onQueryResult: (result: QueryResponse) => void;
  currentUrl: string | null;
};

const QueryInput = ({ onQueryResult, currentUrl }: QueryInputProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleQuery = async () => {
    if (!query) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    if (!currentUrl) {
      toast({
        title: "Error",
        description: "Please ingest a URL first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.query(query, currentUrl);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      onQueryResult(response);
      setQuery('');
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process query",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search size={20} className="text-vibrant-pink" />
          Ask a Question
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Textarea
            placeholder="Enter your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px] bg-background/60 border-white/10"
          />
          <Button 
            onClick={handleQuery} 
            disabled={isLoading || !currentUrl}
            className="bg-gradient-to-r from-vibrant-pink to-vibrant-purple hover:opacity-90 text-white self-end"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueryInput;
