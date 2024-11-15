'use client';

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Mail, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";

export default function GmailConnect() {
  const { data: session } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: true 
      });
    } catch (error) {
      console.error('Gmail connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-center mb-4">
        <Mail className="w-12 h-12 text-blue-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {session ? 'Connected Gmail Account' : 'Connect Gmail Account'}
      </h2>
      
      <p className="text-center text-gray-600 mb-6">
        {session 
          ? `Signed in as ${session.user?.email}` 
          : 'Connect your Gmail account to start processing emails'}
      </p>
      
      <div className="space-y-4">
        {!session ? (
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isConnecting ? (
              <>Connecting...</>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Connect Gmail
              </>
            )}
          </button>
        ) : (
          <button 
            onClick={handleDisconnect}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Disconnect
          </button>
        )}
      </div>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        We only access your emails to process and summarize them
      </p>
    </div>
  );
}
