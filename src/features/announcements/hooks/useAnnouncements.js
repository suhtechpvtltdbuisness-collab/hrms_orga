import { useCallback, useEffect, useState } from 'react';
import { announcementService } from '../services/announcementService';

export function useAnnouncements() {
  const [items,setItems]=useState([]), [loading,setLoading]=useState(true), [error,setError]=useState('');
  const refresh=useCallback(async()=>{ try { setLoading(true); setItems(await announcementService.list()); setError(''); } catch { setError('Unable to load announcements.'); } finally { setLoading(false); } },[]);
  useEffect(()=>{ refresh(); window.addEventListener('orga-announcements-change',refresh); return()=>window.removeEventListener('orga-announcements-change',refresh); },[refresh]);
  return {items,loading,error,refresh};
}
