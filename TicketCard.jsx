import React from 'react';

const TicketCard = ({ ticket }) => {
  const isHighPriority = ticket.urgency_level === 'HIGH_PRIORITY';

  // Format date to a readable string
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(ticket.created_at));

  return (
    <div className={`relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1
      ${isHighPriority 
        ? 'bg-red-900/20 border-red-500/30' 
        : 'bg-white/5 border-white/10'
      }`}
    >
      {/* Urgency Badge */}
      <div className="absolute top-6 right-6">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider
          ${isHighPriority 
            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}
        >
          {ticket.urgency_level.replace('_', ' ')}
        </span>
      </div>

      <div className="flex flex-col gap-3 pr-24">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
            {ticket.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-slate-200">{ticket.email}</h3>
            <p className="text-xs text-slate-400">{formattedDate}</p>
          </div>
        </div>
        
        <p className="text-slate-300 mt-2 leading-relaxed">
          "{ticket.message}"
        </p>
        
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-900/20">
            Reply
          </button>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-white/10">
            Mark Resolved
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;