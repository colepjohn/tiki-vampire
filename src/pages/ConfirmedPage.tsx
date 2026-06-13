import { useLocation, Link } from 'react-router-dom';

interface ConfirmState {
  name: string;
  attending: boolean;
  assignment: 'Tiki' | 'Vampire' | null;
}

export default function ConfirmedPage() {
  const location = useLocation();
  const state = location.state as ConfirmState | null;

  if (!state) {
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No RSVP Found</h2>
          <p className="text-gray-300 mb-4">
            Please submit an RSVP first!
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-tiki-orange to-vampire-red text-white font-bold rounded-lg"
          >
            Go to RSVP
          </Link>
        </div>
      </div>
    );
  }

  const { name, attending, assignment } = state;

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
        <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10 text-center">
          {attending ? (
            <>
              {assignment === 'Tiki' ? (
                <audio src="/tiki_anthem.mp3" autoPlay loop />
              ) : (
                <audio src="/vamp_anthem.mp3" autoPlay loop />
              )}
              <div className="text-6xl mb-6">
                {assignment === 'Tiki' ? '🌺' : '🦇'}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">See you there, {name}!</h2>
              <p className="text-gray-300 mb-6 text-lg">
                You've been assigned to the <strong className="text-white">{assignment}</strong> team!
              </p>
              <div className={assignment === 'Tiki' ? 'reveal-tiki' : 'reveal-vampire'}>
                {assignment}
              </div>
              <p className="text-gray-400 mt-6 text-sm">
                {assignment === 'Tiki'
                  ? 'Bring your best tropical vibes! 🌴🍹'
                  : 'Prepare for a night of dark elegance! 🖤🍷'}
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">😔</div>
              <h2 className="text-3xl font-bold text-white mb-2">We'll miss you, {name}!</h2>
              <p className="text-gray-300 mb-4">
                Thanks for letting us know. You'll be missed at the party!
              </p>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-white/10">
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-white underline transition-colors"
            >
              Submit another RSVP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}