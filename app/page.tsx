import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          <span className="text-primary">Civic</span>
          <span className="text-secondary">Trust</span>
        </h1>
        <p className="text-center text-lg mb-8">
          Privacy-First Civic Engagement Platform for Smart Cities in India
        </p>

        <div className="flex justify-center space-x-4 mb-12">
          <Link href="/login" className="btn-primary">
            Login
          </Link>
          <Link href="/signup" className="btn-secondary">
            Sign Up
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Privacy-First</h3>
            <p>Secure, anonymous civic engagement with Anon Aadhaar and zero-knowledge proofs.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Blockchain-Powered</h3>
            <p>Transparent, secure, and decentralized governance with Polygon integration.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">AI-Enhanced</h3>
            <p>Smart recommendations and insights through custom BERT+LSTM models.</p>
          </div>
        </div>
      </div>
    </main>
  );
} 