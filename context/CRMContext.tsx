import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CRMState, Lead, LeadStatus } from '../types';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

const CRMContext = createContext<CRMState | undefined>(undefined);

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  // Initialize Theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Initialize Session
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Leads
  useEffect(() => {
    if (!user || !supabase) {
      setLeads([]);
      return;
    }

    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
      } else if (data) {
        const mappedLeads: Lead[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          value: Number(item.value),
          status: item.status,
          notes: item.notes,
          createdAt: item.created_at,
          lastUpdated: item.last_updated,
        }));
        setLeads(mappedLeads);
      }
    };

    fetchLeads();
  }, [user]);

  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'lastUpdated'>) => {
    if (!user || !supabase) return;

    const newLeadPayload = {
      user_id: user.id,
      name: leadData.name,
      email: leadData.email,
      value: leadData.value,
      status: leadData.status,
      notes: leadData.notes,
    };

    const { data, error } = await supabase
      .from('leads')
      .insert(newLeadPayload)
      .select()
      .single();

    if (error) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead: ' + error.message);
      return;
    }

    if (data) {
      const mappedLead: Lead = {
        id: data.id,
        name: data.name,
        email: data.email,
        value: Number(data.value),
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at,
        lastUpdated: data.last_updated,
      };
      setLeads((prev) => [mappedLead, ...prev]);
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    if (!supabase) return;

    // Prepare payload for Supabase
    const payload: any = { ...updates };
    delete payload.id;
    delete payload.createdAt;
    delete payload.lastUpdated;
    payload.last_updated = new Date().toISOString();

    const { error } = await supabase
      .from('leads')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update lead');
      return;
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { ...lead, ...updates, lastUpdated: new Date().toISOString() }
          : lead
      )
    );
  };

  const moveLead = async (id: string, newStatus: LeadStatus) => {
    if (!supabase) return;

    // Optimistic update
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );

    if (newStatus === 'WON') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b'],
      });
    }

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, last_updated: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error moving lead:', error);
      const { data } = await supabase.from('leads').select('status').eq('id', id).single();
      if (data) {
         setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: data.status as LeadStatus } : lead))
        );
      }
    }
  };

  const deleteLead = async (id: string) => {
    if (!supabase) return;

    const { error } = await supabase.from('leads').delete().eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
      return;
    }

    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const importData = async (data: Lead[]) => {
    if (!user || !supabase) return;

    const formattedData = data.map(item => ({
      user_id: user.id,
      name: item.name,
      email: item.email,
      value: item.value,
      status: item.status,
      notes: item.notes,
    }));

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert(formattedData)
      .select();

    if (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data: ' + error.message);
      return;
    }

    if (insertedData) {
      const mappedLeads: Lead[] = insertedData.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        value: Number(item.value),
        status: item.status,
        notes: item.notes,
        createdAt: item.created_at,
        lastUpdated: item.last_updated,
      }));
      setLeads((prev) => [...prev, ...mappedLeads]);
      alert(`Successfully imported ${mappedLeads.length} leads.`);
    }
  };

  const clearData = async () => {
     if(!supabase || !user) return;
     const { error } = await supabase.from('leads').delete().eq('user_id', user.id);
     if(error) {
         console.error("Error clearing data", error);
     } else {
         setLeads([]);
     }
  };

  const deleteAccount = async () => {
    if (!supabase || !user) return;
    
    try {
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      await signOut();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account data: " + error.message);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setLeads([]);
  };

  const updateUserProfile = async (name: string, email: string) => {
    if (!supabase || !user) return;

    try {
      const attributes: any = { data: { full_name: name } };
      if (email !== user.email) {
        attributes.email = email;
      }
      const { data, error } = await supabase.auth.updateUser(attributes);
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        alert('Profile updated successfully!' + (attributes.email ? ' Please check your new email for a confirmation link.' : ''));
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile: ' + err.message);
    }
  };

  const updateSubscription = async () => {
    if (!supabase || !user) return;
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { subscription_active: true }
      });
      if (error) throw error;
      if (data.user) setUser(data.user);
    } catch (err: any) {
      console.error('Error updating subscription:', err);
    }
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        user,
        loading,
        theme,
        toggleTheme,
        addLead,
        updateLead,
        moveLead,
        deleteLead,
        importData,
        clearData,
        deleteAccount,
        signOut,
        updateUserProfile,
        updateSubscription,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};