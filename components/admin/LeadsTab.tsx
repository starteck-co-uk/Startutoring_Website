'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { Download, Mail, Phone, Calendar, ExternalLink } from 'lucide-react';

interface Lead {
  id: string;
  type: 'assessment' | 'contact';
  name: string;
  email: string;
  phone?: string;
  date: string;
  status?: string;
  details?: string;
}

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'assessment' | 'contact'>('all');

  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true);
      try {
        const [assessR, contactR] = await Promise.all([
          fetch('/api/admin?section=assessments').then(r => r.json()),
          fetch('/api/admin?section=contacts').then(r => r.json())
        ]);

        const assessLeads: Lead[] = (assessR.assessments || []).map((a: any) => ({
          id: a.id,
          type: 'assessment' as const,
          name: a.parent_name || a.learner_name,
          email: a.email,
          phone: a.phone,
          date: a.created_at,
          status: a.status,
          details: `${a.learner_name} - ${a.course || 'General'} (${(a.subjects || []).join(', ')})`
        }));

        const contactLeads: Lead[] = (contactR.contacts || []).map((c: any) => ({
          id: c.id,
          type: 'contact' as const,
          name: c.name,
          email: c.email,
          date: c.created_at,
          details: c.message?.slice(0, 100)
        }));

        setLeads([...assessLeads, ...contactLeads].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } catch {}
      setLoading(false);
    };
    loadLeads();
  }, []);

  const filtered = filter === 'all' ? leads : leads.filter(l => l.type === filter);

  const exportCSV = () => {
    const rows = filtered.map(l => [
      l.name,
      l.email,
      l.phone || '',
      l.type,
      l.status || '',
      l.details || '',
      new Date(l.date).toLocaleDateString('en-GB')
    ]);

    const csv = [
      ['Name', 'Email', 'Phone', 'Source', 'Status', 'Details', 'Date'].join(','),
      ...rows.map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `star-tutoring-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyEmails = () => {
    const emails = [...new Set(filtered.map(l => l.email))].join(', ');
    navigator.clipboard.writeText(emails);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gradient">Leads</h2>
          <p className="text-ink-soft text-sm mt-1">
            All assessment bookings and contact form submissions — export for email outreach.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyEmails} className="text-xs px-3 py-2 rounded-lg border border-white/10 hover:border-gold/30 transition flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Copy Emails
          </button>
          <button onClick={exportCSV} className="btn btn-gold !py-2 !px-4 !text-xs">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'assessment', 'contact'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              filter === f
                ? 'border-gold/60 bg-gold-dim text-gold-light'
                : 'border-white/10 bg-white/3 text-ink-soft hover:border-white/20'
            }`}
          >
            {f === 'all' ? `All (${leads.length})` : f === 'assessment' ? `Assessments (${leads.filter(l => l.type === 'assessment').length})` : `Contacts (${leads.filter(l => l.type === 'contact').length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="!p-10 text-center" hover={false}>
          <p className="text-ink-muted">No leads yet. They will appear here when people submit forms on your website.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <GlassCard key={`${l.type}-${l.id}`} className="!p-5" hover={false}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{l.name}</p>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold border ${
                      l.type === 'assessment'
                        ? 'bg-gold-dim border-gold/30 text-gold-light'
                        : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
                    }`}>
                      {l.type}
                    </span>
                    {l.status && (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300">
                        {l.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-ink-soft">
                    <a href={`mailto:${l.email}`} className="hover:text-gold transition flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {l.email}
                    </a>
                    {l.phone && (
                      <a href={`tel:${l.phone}`} className="hover:text-gold transition flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {l.phone}
                      </a>
                    )}
                  </div>
                  {l.details && (
                    <p className="text-xs text-ink-muted mt-1 truncate">{l.details}</p>
                  )}
                </div>
                <div className="text-xs text-ink-muted flex items-center gap-1 whitespace-nowrap">
                  <Calendar className="w-3 h-3" />
                  {new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
