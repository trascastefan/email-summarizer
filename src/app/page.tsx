'use client';

import EmailInputForm from "@/components/email/email-input-form";
import GmailConnect from "@/components/gmail/gmail-connect";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">
              Email Processing App
            </h1>
            <EmailInputForm />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-center mb-8">
              Gmail Connection
            </h2>
            <GmailConnect />
          </div>
        </div>
      </main>
    </SessionProvider>
  );
}