import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface JournalEntry {
  id: string;
  type: 'soin' | 'routine';
  title: string;
  date: string;
  note: string;
  timestamp: number;
  created_at?: string;
  updated_at?: string;
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    fetchEntries();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('journal_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchEntries(); // Refresh data when there are changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching journal entries:', fetchError);
        setError('Erreur lors du chargement des entrées');
        return;
      }

      // Transform data to match the expected format
      const transformedEntries: JournalEntry[] = (data || []).map(entry => ({
        id: entry.id,
        type: entry.type as 'soin' | 'routine',
        title: entry.title,
        date: entry.date,
        note: entry.note || '',
        timestamp: entry.timestamp,
        created_at: entry.created_at,
        updated_at: entry.updated_at
      }));

      setEntries(transformedEntries);
      setError(null);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Erreur lors du chargement des entrées');
    } finally {
      setLoading(false);
    }
  };

  const refreshEntries = () => {
    fetchEntries();
  };

  return {
    entries,
    loading,
    error,
    refreshEntries
  };
}