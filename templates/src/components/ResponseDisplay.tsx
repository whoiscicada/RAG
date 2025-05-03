import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Link } from 'lucide-react';

type ResponseDisplayProps = {
  response: string | null;
  sources?: string[];
};

const ResponseDisplay = ({ response, sources }: ResponseDisplayProps) => {
  if (!response) return null;

  return (
    <Card className="glass-card mt-6 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} className="text-vibrant-green" />
          Response
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-black/30 p-4 rounded-md border border-white/5">
          <p className="text-white/90 whitespace-pre-wrap">{response}</p>
        </div>
        
        {sources && sources.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Link size={16} />
              <span>Sources:</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {sources.map((source, index) => (
                <a
                  key={index}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-vibrant-blue hover:underline"
                >
                  {new URL(source).hostname}
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponseDisplay;
