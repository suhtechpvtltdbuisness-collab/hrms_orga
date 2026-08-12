import { useCallback, useEffect, useState } from 'react';
import { announcementService } from '../services/announcementService';

export function useAnnouncements({ forEmployee = false } = {}) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ unread: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      if (forEmployee) {
        const result = await announcementService.listForEmployee();
        setItems(result.items);
        setMeta(result.meta);
      } else {
        setItems(await announcementService.list());
      }
      setError('');
    } catch {
      setError('Unable to load announcements.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [forEmployee]);

  useEffect(() => {
    refresh();
    window.addEventListener('orga-announcements-change', refresh);
    return () => window.removeEventListener('orga-announcements-change', refresh);
  }, [refresh]);

  return { items, meta, loading, error, refresh };
}
