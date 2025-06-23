'use client'
import { useEffect, useState } from 'react'
import URLForm from '@/components/URLForm'
import URLDisplay from '@/components/URLDisplay'

type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  urls: [
    {
      id: string;
      original: string;
      slug: string;
      createdAt: string;
      clicks: number;
      userId: string;
    }
  ]
}
export default function Home() {
  const [slug, setSlug] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('token', process.env.NEXT_PUBLIC_TEMP_USER_TOKEN!);
    }
    fetch('/api/me', {
      headers: {
        'Authorization': `Bearer ${token || process.env.NEXT_PUBLIC_TEMP_USER_TOKEN!}`
      }
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      if (user.name === 'Temporary User') {
        if (!localStorage.getItem('tries')) {
          localStorage.setItem('tries', '1'); 
        }
      } else {
        localStorage.setItem('tries', '999'); // Reset tries for registered user
      }
    }
  }, [user]); 

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="flex h-[90vh] w-full flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Magic URL Shortener</h1>
      <URLForm onShorten={setSlug} />
      {slug && <URLDisplay shortUrl={slug} />}
    </main>
  )
}
