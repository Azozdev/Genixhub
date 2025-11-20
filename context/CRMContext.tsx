import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CRMState, Lead, LeadStatus } from '../types';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

const CRMContext = createContext<CRMState | undefined>(undefined);

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Leads from Supabase
  const fetchLeads = async () => {
    if (!user || !supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        // Map Supabase snake_case to App camelCase
        const mappedLeads: Lead[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email || '',
          value: Number(item.value),
          status: item.status as LeadStatus,
          notes: item.notes || '',
          createdAt: item.created_at,
          lastUpdated: item.last_updated,
        }));
        setLeads(mappedLeads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [user]);

  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'lastUpdated'>) => {
    if (!user || !supabase) return;

    const newLeadId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Optimistic Update
    const optimisticLead: Lead = {
      ...leadData,
      id: newLeadId,
      createdAt: timestamp,
      lastUpdated: timestamp,
    };
    setLeads((prev) => [...prev, optimisticLead]);

    try {
      const { error } = await supabase.from('leads').insert([{
        id: newLeadId,
        user_id: user.id,
        name: leadData.name,
        email: leadData.email,
        value: leadData.value,
        status: leadData.status,
        notes: leadData.notes,
        created_at: timestamp,
        last_updated: timestamp
      }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding lead:', error);
      // Revert on error
      setLeads((prev) => prev.filter(l => l.id !== newLeadId));
      alert('Failed to save lead. Please try again.');
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    if (!user || !supabase) return;

    // Optimistic Update
    const oldLeads = [...leads];
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { ...lead, ...updates, lastUpdated: new Date().toISOString() }
          : lead
      )
    );

    try {
      const dbUpdates: any = {
        last_updated: new Date().toISOString()
      };
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.value !== undefined) dbUpdates.value = updates.value;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { error } = await supabase
        .from('leads')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating lead:', error);
      setLeads(oldLeads);
      alert('Failed to update lead.');
    }
  };

  const moveLead = async (id: string, newStatus: LeadStatus) => {
    if (!user || !supabase) return;

    const leadToMove = leads.find(l => l.id === id);
    if (!leadToMove) return;

    if (newStatus === 'WON' && leadToMove.status !== 'WON') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    await updateLead(id, { status: newStatus });
  };

  const deleteLead = async (id: string) => {
    if (!user || !supabase) return;

    const oldLeads = [...leads];
    setLeads((prev) => prev.filter((lead) => lead.id !== id));

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting lead:', error);
      setLeads(oldLeads);
      alert('Failed to delete lead.');
    }
  };

  const importData = async (data: Lead[]) => {
    if (!user || !supabase || !Array.isArray(data)) return;

    const confirm = window.confirm(`Importing ${data.length} leads. This will upload them to your account. Continue?`);
    if (!confirm) return;

    const timestamp = new Date().toISOString();
    
    const formattedData = data.map(item => ({
      user_id: user.id,
      name: item.name,
      email: item.email,
      value: item.value,
      status: item.status,
      notes: item.notes,
      created_at: item.createdAt || timestamp,
      last_updated: item.lastUpdated || timestamp
    }));

    try {
      const { error } = await supabase.from('leads').insert(formattedData);
      if (error) throw error;
      fetchLeads(); 
      alert('Import successful!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check your file format.');
    }
  };

  const clearData = async () => {
    if (!user || !supabase) return;
    
    const oldLeads = [...leads];
    setLeads([]);

    try {
      // Delete all rows for this user (RLS handles the filter usually, but adding user_id eq for safety)
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Clear data failed:', error);
      setLeads(oldLeads);
      throw error; // Re-throw for caller handling
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setLeads([]);
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!user || !supabase) return;

    try {
      // 1. Delete all user data
      await clearData();

      // 2. Sign Out
      // Note: Actual User Deletion requires Admin API or a specific PostgreSQL function.
      // For this client-side implementation, we wipe data and sign out.
      await signOut();
      
    } catch (error) {
      console.error('Delete account failed:', error);
      alert('Failed to delete account data completely.');
    }
  };

  return (
    <CRMContext.Provider
      value={{ 
        leads, 
        user, 
        loading, 
        addLead, 
        updateLead, 
        moveLead, 
        deleteLead, 
        importData, 
        clearData,
        deleteAccount,
        signOut 
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};