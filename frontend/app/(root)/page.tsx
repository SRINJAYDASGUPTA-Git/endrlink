'use client'
import { useEffect, useState } from 'react'
import URLForm from '@/components/URLForm'
import URLDisplay from '@/components/URLDisplay'
import {useUser} from "@/providers/UserContext";
import Loader from "@/components/Loader";

export default function Home() {
  const [slug, setSlug] = useState<string | null>(null)
  const { user, loading } = useUser();

  useEffect(() => {
    if (user) {
      if (user.name === 'Temporary User') {
        console.log('Temporary user detected, setting tries in localStorage');
        localStorage.setItem('tries', '1');
      } else {
        localStorage.setItem('tries', '999'); // Reset tries for registered user
      }
    }
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <Loader subtitle={'Please wait...'}/>
    </div>;
  }

  return (
    <main className="flex h-[90vh] w-full flex-col items-center justify-center p-6 z-20">
      <h1 className="text-3xl font-bold mb-4">Magic URL Shortener</h1>
      <URLForm onShorten={setSlug} />
      {slug && <URLDisplay shortUrl={slug} />}
    </main>
  )
}
