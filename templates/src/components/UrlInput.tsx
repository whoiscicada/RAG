import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';

type UrlInputProps = {
  onUrlIngested: (url: string) => void;
};

const UrlInput = ({ onUrlIngested }: UrlInputProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleIngest = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.ingestUrl(url);
      
      toast({
        title: "Success",
        description: response.message || "URL has been ingested successfully",
      });
      
      // Call the callback with the ingested URL
      onUrlIngested(url);
      setUrl('');
    } catch (error) {
      console.error('Error ingesting URL:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to ingest URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Globe size={20} className="text-vibrant-blue" />
          Ingest URL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-background/60 border-white/10"
          />
          <Button 
            onClick={handleIngest} 
            disabled={isLoading}
            className="bg-gradient-to-r from-vibrant-blue to-vibrant-purple hover:opacity-90 text-white"
          >
            {isLoading ? 'Ingesting...' : 'Ingest'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UrlInput;
