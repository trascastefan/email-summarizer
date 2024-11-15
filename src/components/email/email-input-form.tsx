'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, X, Trash2 } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const bulkEmailSchema = z.object({
  emails: z.string()
    .max(1000, "Input is too long")
    .transform((str) => {
      const emails = str.split(/[\n,]/).map((e) => e.trim()).filter(Boolean);
      return emails;
    })
    .refine((emails) => emails.length <= 20, "Maximum 20 emails allowed")
    .refine(
      (emails) => emails.every((email) => z.string().email().safeParse(email).success),
      "Some emails are invalid"
    ),
});

export default function EmailInputForm() {
  const [emails, setEmails] = useState<string[]>([]);
  const [inputMode, setInputMode] = useState<"single" | "bulk">("single");
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(inputMode === "single" ? emailSchema : bulkEmailSchema),
  });

  const onSubmit = (data: any) => {
    setBulkErrors([]);
    const newEmails = inputMode === "single" ? [data.email] : data.emails;
    
    if (inputMode === "bulk") {
      const invalidEmails = newEmails.filter(
        (email) => !z.string().email().safeParse(email).success
      );
      if (invalidEmails.length > 0) {
        setBulkErrors(invalidEmails.map((email) => `Invalid email: ${email}`));
        return;
      }
    }

    setEmails((prev) => {
      const combined = [...new Set([...prev, ...newEmails])];
      return combined.slice(0, 20);
    });
    reset();
  };

  const removeEmail = (index: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllEmails = () => {
    setEmails([]);
    reset();
    setBulkErrors([]);
  };

  const switchMode = (mode: "single" | "bulk") => {
    setInputMode(mode);
    reset();
    setBulkErrors([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => switchMode("single")}
            className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
              inputMode === "single"
                ? "bg-blue-700 text-white shadow-md"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            Single Email
          </button>
          <button
            onClick={() => switchMode("bulk")}
            className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
              inputMode === "bulk"
                ? "bg-blue-700 text-white shadow-md"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            Bulk Import
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {inputMode === "single" ? (
            <div>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent">
                <Mail className="w-5 h-5 text-gray-600" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>
          ) : (
            <div>
              <textarea
                {...register("emails")}
                placeholder="Enter multiple email addresses (comma or new line separated)"
                className="w-full h-32 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              {errors.emails && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.emails.message as string}
                </p>
              )}
              {bulkErrors.map((error, index) => (
                <p key={index} className="text-red-700 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={emails.length >= 20}
            >
              Add Email{inputMode === "bulk" ? "s" : ""}
            </button>
            {emails.length > 0 && (
              <button
                type="button"
                onClick={clearAllEmails}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                aria-label="Clear all emails"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {emails.length > 0 && (
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <h3 className="font-semibold mb-2 text-gray-900">Added Emails ({emails.length}/20)</h3>
          <div className="space-y-2">
            {emails.map((email, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 bg-gray-100 p-2 rounded border border-gray-200 group"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900">{email}</span>
                </div>
                <button
                  onClick={() => removeEmail(index)}
                  className="text-gray-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove email ${email}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
