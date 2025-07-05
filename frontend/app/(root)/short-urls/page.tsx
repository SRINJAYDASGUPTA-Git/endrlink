
'use client';
import React from 'react'
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Copy, CopyCheck } from 'lucide-react';
import axios from "@/utils/axiosInstance";

type URLData = {
    id: string;
    email: string;
    name: string;
    urls: Url[];
}

type Url = {
    id: string;
    original: string;
    slug: string;
    createdAt: string;
    clicks: number;
    userId: string;
}

const ShortURLsByUser = () => {
    const [urls, setUrls] = React.useState<URLData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [clicked, setClicked] = React.useState<number | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const token = localStorage.getItem('accessToken') || null;
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchUrls = async () => {
            try {
                const response = await axios.get('/api/v1/url/');
                const data = response.data;
                console.log('Fetched URLs:', data);
                setUrls(data as URLData);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    // No URLs found
                    setUrls(null);
                } else {
                    console.error('Error fetching URLs:', error);
                    setUrls(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUrls();
    }, []);


    return (
        <div>
            {
                loading ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <p>Loading...</p>
                    </div>
                ) : urls ? (
                    <div className='p-10'>
                        <h1 className="text-2xl font-bold mb-4">Your Short URLs</h1>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Sl. No</TableHead>
                                    <TableHead>Short URL</TableHead>
                                    <TableHead>Original URL</TableHead>
                                    <TableHead className="text-right">Clicks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {urls.urls.map((url: Url, index: number) => (
                                    <TableRow key={url.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className='font-medium flex place-items-center gap-2'>
                                            {`${process.env.NEXT_PUBLIC_BACKEND_URL}/s/${url.slug}`}
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BACKEND_URL}/s/${url.slug}`);
                                                    setClicked(index);
                                                    setTimeout(() => setClicked(null), 2000); // Reset after 2 seconds
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {clicked === index ? <CopyCheck size={20} /> : <Copy size={20} />}
                                            </button>
                                        </TableCell>
                                        <TableCell>{url.original}</TableCell>
                                        <TableCell className="text-right">{url.clicks}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className={'flex items-center justify-center min-h-screen text-gray-500'}>
                        No URLs found for this user.
                    </div>
                )

            }
        </div>
    )
}

export default ShortURLsByUser