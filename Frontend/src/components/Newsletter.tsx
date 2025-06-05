import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      // In a real app, you'd submit this to your backend
    }
  };

  return (
    <section className="py-20 px-4 bg-black text-white">
      <div className="container mx-auto text-center max-w-2xl">
        <h2 className="text-4xl font-bold mb-4">Join Our Adventure</h2>
        <p className="text-lg mb-8">
          Subscribe to our newsletter for exclusive offers, new product announcements,<br />
          and outdoor inspiration.
        </p>
        
        {subscribed ? (
          <div className="bg-white/10 p-6 rounded-lg">
            <p className="text-xl">Thank you for subscribing!</p>
            <p className="text-gray-300 mt-2">We'll keep you updated with our latest news and offers.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 w-full px-6 py-3 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;