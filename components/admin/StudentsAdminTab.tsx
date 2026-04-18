'use client';

import { useEffect, useMemo, useState } from 'react';
import GlassCard from '@/components/GlassCard';
import type { Student } from '@/lib/types';

type Status = 'active' | 'inactive' | 'paused';

const SUBJECT_OPTIONS = ['Maths', 'Science', 'English', 'History', 'Geography', 'Computer Science'];
const LEVEL_OPTIONS = [
  'Year 2 — KS1', 'Year 3 — KS2', 'Year 4 — KS2', 'Year 5 — KS2', 'Year 6 — 11+',
  'Year 7 — KS3', 'Year 8 — KS3', 'Year 9 — KS3',
  'Year 10 — GCSE', 'Year 11 — GCSE',
  'Year 12 — A-Level', 'Year 13 — A-Level'
];

interface FormState {
  name: string;
  email: string;
  pin: string;
  grade: string;
  parent_name: string;
  avatar: string;
  phone: string;
  school_name: string;
  subjects: string[];
  strengths: string;
  areas_to_improve: string;
  medical_notes: string;
  admin_notes: string;
  status: Status;
}

const emptyForm = (): FormState => ({
  name: '',
  email: '',
  pin: '1234',
  grade: '',
  parent_name: '',
  avatar: '',
  phone: '',
  school_name: '',
  subjects: [],
  strengths: '',
  areas_to_improve: '',
  medical_notes: '',
  admin_notes: '',
  status: 'active'
});

export default function StudentsAdminTab() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [editing, setEditing] = useState<Student | 'new' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Student | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/admin/students');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to load students');
      setStudents((j.students || []).filter((s: Student) => s.role !== 'admin'));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      if (statusFilter !== 'all' && (s.status || 'active') !== statusFilter) return false;
      if (!q) return true;
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.parent_name?.toLowerCase().includes(q) ||
        s.school_name?.toLowerCase().includes(q) ||
        s.grade?.toLowerCase().includes(q)
      );
    });
  }, [students, search, statusFilter]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const r = await fetch(`/api/admin/students/${confirmDelete.id}`, { method: 'DELETE' });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || 'Failed to delete');
      }
      setConfirmDelete(null);
      refresh();
    } catch (e: any) {
      setError(e.message);
      setConfirmDelete(null);
    }
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
          <h2 className="font-serif text-3xl font-semibold text-gradient">
            Students <span className="text-lg text-ink-muted">({students.length})</span>
          </h2>
          <p className="text-sm text-ink-soft mt-1">Manage student profiles. Parents log in with the email and PIN you set here.</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn btn-gold">
          + Add Student
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <GlassCard className="!p-4 mb-6" hover={false}>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="field"
            placeholder="Search by student, parent, email, school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </GlassCard>

      {filtered.length === 0 ? (
        <GlassCard className="!p-10 text-center" hover={false}>
          <p className="text-ink-muted">No students yet. Add your first student above.</p>
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <StudentCard
              key={s.id}
              student={s}
              onEdit={() => setEditing(s)}
              onDelete={() => setConfirmDelete(s)}
            />
          ))}
        </div>
      )}

      {editing && (
        <StudentModal
          existing={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh(); }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete this student?"
          message={`Are you sure you want to delete ${confirmDelete.name}? This will also remove all their quiz history. This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

/* ==================== STUDENT CARD ==================== */
function StudentCard({ student, onEdit, onDelete }: { student: Student; onEdit: () => void; onDelete: () => void }) {
  const status = student.status || 'active';
  const statusColors: Record<string, string> = {
    active: 'bg-green-400/10 border-green-400/30 text-green-300',
    paused: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300',
    inactive: 'bg-red-400/10 border-red-400/30 text-red-300'
  };

  return (
    <GlassCard className="!p-5">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg shrink-0"
          style={{
            background: 'linear-gradient(135deg, #ffd166, #f5b72f)',
            color: '#1a1304'
          }}
        >
          {student.avatar || student.name?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-semibold truncate">{student.name}</h3>
          {student.parent_name && (
            <p className="text-xs text-ink-soft truncate">Parent: {student.parent_name}</p>
          )}
          <p className="text-xs text-ink-muted truncate">{student.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold border ${statusColors[status]}`}>
          {status}
        </span>
        {student.grade && (
          <span className="text-xs text-ink-muted">{student.grade}</span>
        )}
      </div>

      <div className="space-y-1 text-xs text-ink-soft mb-4">
        {student.phone && <p>Phone: {student.phone}</p>}
        {student.school_name && <p>School: {student.school_name}</p>}
        {student.subjects && student.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {student.subjects.map((sub) => (
              <span key={sub} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm transition"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 rounded-lg bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 text-red-300 text-sm transition"
        >
          Delete
        </button>
      </div>
    </GlassCard>
  );
}

/* ==================== STUDENT MODAL ==================== */
function StudentModal({
  existing,
  onClose,
  onSaved
}: {
  existing: Student | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => {
    if (!existing) return emptyForm();
    return {
      name: existing.name || '',
      email: existing.email || '',
      pin: existing.pin || '1234',
      grade: existing.grade || '',
      parent_name: existing.parent_name || '',
      avatar: existing.avatar || '',
      phone: existing.phone || '',
      school_name: existing.school_name || '',
      subjects: existing.subjects || [],
      strengths: existing.strengths || '',
      areas_to_improve: existing.areas_to_improve || '',
      medical_notes: existing.medical_notes || '',
      admin_notes: existing.admin_notes || '',
      status: (existing.status || 'active') as Status
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSubject = (sub: string) => {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(sub)
        ? f.subjects.filter((s) => s !== sub)
        : [...f.subjects, sub]
    }));
  };

  const save = async () => {
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.pin.trim()) {
      setError('Student name, parent email, and PIN are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^\d{4,6}$/.test(form.pin)) {
      setError('PIN must be 4–6 digits.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        role: 'student',
        avatar: form.avatar || form.name[0]?.toUpperCase()
      };
      const url = existing ? `/api/admin/students/${existing.id}` : '/api/admin/students';
      const method = existing ? 'PATCH' : 'POST';
      const r = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to save');
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c1424] border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/5 bg-[#0c1424]/95 backdrop-blur-xl">
          <h3 className="font-serif text-2xl font-semibold text-gradient">
            {existing ? `Edit ${existing.name}` : 'Add New Student'}
          </h3>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Student & Parent Info */}
          <Section title="Student & Parent">
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Student's Full Name *">
                <input
                  className="field"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Amara Patel"
                />
              </Field>
              <Field label="Parent's Name">
                <input
                  className="field"
                  value={form.parent_name}
                  onChange={(e) => update('parent_name', e.target.value)}
                  placeholder="e.g. Sarah Patel"
                />
              </Field>
              <Field label="Parent's Email *" hint="Used to log in to the portal">
                <input
                  type="email"
                  className="field"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="parent@email.com"
                />
              </Field>
              <Field label="Login PIN *" hint="4–6 digit PIN shared with parent">
                <input
                  className="field font-mono"
                  value={form.pin}
                  onChange={(e) => update('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="1234"
                />
              </Field>
              <Field label="Parent's Phone">
                <input
                  type="tel"
                  className="field"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+44 7..."
                />
              </Field>
              <Field label="Avatar Initial" hint="Single character shown on cards">
                <input
                  className="field"
                  value={form.avatar}
                  maxLength={2}
                  onChange={(e) => update('avatar', e.target.value)}
                  placeholder="Auto from name"
                />
              </Field>
            </div>
          </Section>

          {/* Level & Status */}
          <Section title="Level & Status">
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Year / Level *">
                <select
                  className="field"
                  value={form.grade}
                  onChange={(e) => update('grade', e.target.value)}
                >
                  <option value="">Select level...</option>
                  {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select
                  className="field"
                  value={form.status}
                  onChange={(e) => update('status', e.target.value as Status)}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
              <Field label="School Name">
                <input
                  className="field"
                  value={form.school_name}
                  onChange={(e) => update('school_name', e.target.value)}
                  placeholder="St. Mary's High School"
                />
              </Field>
            </div>
          </Section>

          {/* Subjects */}
          <Section title="Subjects Being Tutored">
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((sub) => {
                const active = form.subjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${
                      active
                        ? 'bg-gold-dim border-gold/60 text-gold-light'
                        : 'bg-white/3 border-white/10 text-ink-soft hover:border-white/20'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Academic Profile */}
          <Section title="Academic Profile">
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Strengths">
                <textarea
                  className="field min-h-[80px]"
                  value={form.strengths}
                  onChange={(e) => update('strengths', e.target.value)}
                  placeholder="Strong in algebra, enjoys problem-solving..."
                />
              </Field>
              <Field label="Areas to Improve">
                <textarea
                  className="field min-h-[80px]"
                  value={form.areas_to_improve}
                  onChange={(e) => update('areas_to_improve', e.target.value)}
                  placeholder="Needs work on essay structure, time management..."
                />
              </Field>
            </div>
          </Section>

          {/* Care & Notes */}
          <Section title="Care & Internal Notes">
            <Field label="Medical Notes" hint="Allergies, accommodations, learning differences">
              <textarea
                className="field min-h-[60px]"
                value={form.medical_notes}
                onChange={(e) => update('medical_notes', e.target.value)}
                placeholder="e.g. Dyslexia — needs extra time. Severe nut allergy."
              />
            </Field>
            <div className="mt-3">
              <Field label="Admin Notes" hint="Private — not visible to parents">
                <textarea
                  className="field min-h-[60px]"
                  value={form.admin_notes}
                  onChange={(e) => update('admin_notes', e.target.value)}
                  placeholder="Internal notes for the tutoring team..."
                />
              </Field>
            </div>
          </Section>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 p-5 border-t border-white/5 bg-[#0c1424]/95 backdrop-blur-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="btn btn-gold disabled:opacity-60"
          >
            {saving ? 'Saving...' : existing ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== HELPERS ==================== */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest text-ink-muted mb-3 font-semibold">{title}</h4>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  danger,
  onCancel,
  onConfirm
}: {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#0c1424] border border-white/10 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-xl font-semibold mb-3">{title}</h3>
        <p className="text-ink-soft text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              danger
                ? 'bg-red-500/20 border border-red-500/40 text-red-200 hover:bg-red-500/30'
                : 'btn btn-gold'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
