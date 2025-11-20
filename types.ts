import { User } from '@supabase/supabase-js';

export type LeadStatus = 'LEADS' | 'CONTACTED' | 'NEGOTIATION' | 'WON';

export interface Lead {
  id: string;
  name: string;
  email: string;
  value: number;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  lastUpdated: string;
}

export interface CRMState {
  leads: Lead[];
  user: User | null;
  loading: boolean;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  moveLead: (id: string, newStatus: LeadStatus) => void;
  deleteLead: (id: string) => void;
  importData: (data: Lead[]) => void;
  clearData: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const COLUMNS: { id: LeadStatus; title: string; color: string; badgeColor: string }[] = [
  { id: 'LEADS', title: 'Leads', color: 'border-t-gray-400', badgeColor: 'bg-gray-100 text-gray-800' },
  { id: 'CONTACTED', title: 'Contacted', color: 'border-t-blue-500', badgeColor: 'bg-blue-100 text-blue-800' },
  { id: 'NEGOTIATION', title: 'In Negotiation', color: 'border-t-orange-500', badgeColor: 'bg-orange-100 text-orange-800' },
  { id: 'WON', title: 'Won', color: 'border-t-green-500', badgeColor: 'bg-green-100 text-green-800' },
];