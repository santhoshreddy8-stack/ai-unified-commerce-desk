/**
 * Project: AI Unified Commerce Desk
 * Author: Kandlagari Santhosh Reddy
 */
import React, { useState, useEffect, useMemo } from 'react';
import TicketCard from './TicketCard';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_CORE_API_URL || 'http://localhost:3000';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tickets`);
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, message: newMessage })
      });
      const result = await res.json();
      if (result.ticket) {
        setTickets(prev => [result.ticket, ...prev]);
        setNewEmail('');
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await fetch(`${API_URL}/api/tickets/${id}/resolve`, { method: 'PATCH' });
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t));
    } catch (err) {
      console.error('Error resolving ticket:', err);
    }
  };

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'OPEN' ? -1 : 1;
      if (a.urgency_level === 'HIGH_PRIORITY' && b.urgency_level !== 'HIGH_PRIORITY') return -1;
      if (a.urgency_level !== 'HIGH_PRIORITY' && b.urgency_level === 'HIGH_PRIORITY') return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [tickets]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 font-sans text-slate-100">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Unified Commerce Desk
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Engineered by <span className="text-indigo-400 font-semibold">Kandlagari Santhosh Reddy</span> | Logged in as {user?.email}
            </p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300"
          >
            Sign Out
          </button>
        </header>

        {/* Live AI Ticket Ingestion Simulator */}
        <form onSubmit={handleCreateTicket} className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <h2 className="text-lg font-semibold mb-4 text-purple-300">Simulate Inbound Customer Ticket (AI Sentiment Routing)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="email"
              placeholder="customer@example.com"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2 text-slate-200"
            />
            <input
              type="text"
              placeholder="Type an angry or normal customer message..."
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="md:col-span-2 bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2 text-slate-200"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-medium text-sm"
          >
            {isSubmitting ? 'Analyzing with Python NLP...' : 'Submit Ticket to AI Queue'}
          </button>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {sortedTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} onResolve={handleResolve} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;