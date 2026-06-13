import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || attending === null) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    let assignment: 'Tiki' | 'Vampire' | null = null;

    if (attending) {
      // Fetch current counts for balanced assignment
      const { count: tikiCount, error: tikiError } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('assignment', 'Tiki');

      const { count: vampireCount, error: vampireError } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('assignment', 'Vampire');

      if (!tikiError && !vampireError) {
        if ((tikiCount ?? 0) <= (vampireCount ?? 0)) {
          assignment = 'Tiki';
        } else {
          assignment = 'Vampire';
        }
      } else {
        // Fallback to random if count query fails
        assignment = Math.random() < 0.5 ? 'Tiki' : 'Vampire';
      }
    }

    const { error: submitError } = await supabase
      .from('rsvps')
      .insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        attending,
        assignment,
        message: message.trim() || null,
      });

    if (submitError) {
      if (submitError.code === '23505') {
        setError('This name has already RSVP\'d. Please contact the host if you need to change your response.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
      return;
    }

    navigate('/confirmed', {
      state: { name: `${firstName.trim()} ${lastName.trim()}`, attending, assignment },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/tiki-rsvp.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold glow-text mb-2 tracking-tight">
            <span className="text-tiki-orange">Tiki</span>{' '}
            <span className="text-vampire-pink">Vampire</span>{' '}
            <span className="text-white">Party</span>
          </h1>
          <p className="text-white/90 text-xl font-semibold mb-2">
            Friday, July 24th, 2026 · 7:00 PM
          </p>
          <p className="text-gray-200 text-lg">
            You're invited to a night of tropical thrills!
          </p>
          <p className="text-gray-400 mt-1 text-sm">
            Join us for an unforgettable evening
          </p>
        </div>

        {/* RSVP Card */}
        <div className="bg-black/10 rounded-2xl shadow-2xl p-8 border border-white/10">
          {error && (
            <div className="bg-red-900/80 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-tiki-orange focus:border-transparent outline-none text-white placeholder-gray-400"
                  placeholder="First name"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-tiki-orange focus:border-transparent outline-none text-white placeholder-gray-400"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Will you attend? *
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAttending(true)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    attending === true
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  🎉 Yes!
                </button>
                <button
                  type="button"
                  onClick={() => setAttending(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    attending === false
                      ? 'bg-red-600 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  😔 No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-tiki-orange focus:border-transparent outline-none text-white placeholder-gray-400 resize-none"
                placeholder="Any message for the host?"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 bg-gradient-to-r from-tiki-orange to-vampire-red text-white font-bold rounded-lg text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send RSVP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}