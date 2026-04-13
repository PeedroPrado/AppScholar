import { useState } from 'react';



export function useSearch<T>(items: T[], keys: (keyof T)[]) {
  const [search, setSearch] = useState('');

  const filtered = items.filter(item =>
    
    keys.some(key =>
      String(item[key]).toLowerCase().includes(search.toLowerCase())
    )
  );

  return { search, setSearch, filtered };
}
