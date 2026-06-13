import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { RSVP } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<'all' | 'coming' | 'not-coming'>('all');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) {
        navigate('/admin');
        return;
      }
      setSession(true);
      fetchRSVPs();
    });
  }, [navigate]);

  const fetchRSVPs = async () => {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching RSVPs:', error);
      return;
    }

    setRsvps(data || []);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (session === null || loading) {
    return (
      <div className="min-h-screen tiki-gradient flex items-center justify-center">
        <div className="text-2xl font-bold text-white glow-text">Loading...</div>
      </div>
    );
  }

  const filteredRsvps = rsvps.filter((rsvp) => {
    if (filter === 'coming') return rsvp.attending;
    if (filter === 'not-coming') return !rsvp.attending;
    return true;
  });

  const totalRSVPs = rsvps.length;
  const comingCount = rsvps.filter((r) => r.attending).length;
  const notComingCount = rsvps.filter((r) => !r.attending).length;
  const tikiCount = rsvps.filter((r) => r.assignment === 'Tiki').length;
  const vampireCount = rsvps.filter((r) => r.assignment === 'Vampire').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-tiki-orange">Tiki</span>{' '}
            <span className="text-vampire-purple">Vampire</span>{' '}
            <span className="text-gray-700">Dashboard</span>
          </h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-800">{totalRSVPs}</div>
            <div className="text-sm text-gray-500">Total RSVPs</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{comingCount}</div>
            <div className="text-sm text-gray-500">Coming</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-red-500">{notComingCount}</div>
            <div className="text-sm text-gray-500">Not Coming</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-tiki-orange">{tikiCount}</div>
            <div className="text-sm text-gray-500">🌺 Tiki</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-vampire-purple">{vampireCount}</div>
            <div className="text-sm text-gray-500">🦇 Vampire</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'coming', 'not-coming'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-tiki-orange to-vampire-red text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'All' : f === 'coming' ? 'Coming' : 'Not Coming'}
            </button>
          ))}
        </div>

        {/* RSVP Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">First Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Last Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Team</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Message</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No RSVPs found
                    </td>
                  </tr>
                ) : (
                  filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{rsvp.first_name}</td>
                      <td className="px-4 py-3 text-gray-600">{rsvp.last_name}</td>
                      <td className="px-4 py-3">
                        {rsvp.attending ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Coming
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Not Coming
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {rsvp.assignment ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rsvp.assignment === 'Tiki'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {rsvp.assignment === 'Tiki' ? '🌺 Tiki' : '🦇 Vampire'}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                        {rsvp.message || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                        {new Date(rsvp.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}