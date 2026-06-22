import React from 'react';

export default function ContactUsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6">Contact Us</h1>
      <p className="text-gray-600 text-lg leading-relaxed mb-8">
        Have any questions, suggestions, or just want to say hi? We'd love to hear from you.
      </p>
      <form className="max-w-xl space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="How can we help?"></textarea>
        </div>
        <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Send Message
        </button>
      </form>
    </div>
  );
}
