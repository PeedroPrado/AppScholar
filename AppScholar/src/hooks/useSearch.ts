import { useState } from 'react';



export function useSearch<T>(items: T[], keys: (keyof T)[]) {
  const [search, setSearch] = useState('');

  const filtered = items.filter(item =>
    // some() retorna true se PELO MENOS UMA das chaves bater com a busca
    keys.some(key =>
      String(item[key]).toLowerCase().includes(search.toLowerCase())
    )
  );

  return { search, setSearch, filtered };
}