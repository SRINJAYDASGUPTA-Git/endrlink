'use client';
import React from 'react';
import {useRouter} from 'next/navigation';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Copy, CopyCheck} from 'lucide-react';
import axios from "@/utils/axiosInstance";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import Loader from "@/components/Loader";

type Url = {
    id: string;
    originalUrl: string;
    slug: string;
    createdAt: string;
    clicks: number;
    userId: string;
};

const ShortURLsByUser = () => {
    const [urls, setUrls] = React.useState<Url[] | []>([]);
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
                setUrls(response.data as Url[]);
            } 

            catch (error: any) {
                if (error.response?.status === 404) {
                    setUrls([]);
                } else {
                    console.error('Error fetching URLs:', error);
                    setUrls([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUrls();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            {
                loading ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader subtitle={'Loading your short URLs...'} />
                    </div>
                ) : urls.length > 0 ? (
                    <div
                        className="w-full max-w-5xl p-8 rounded-2xl bg-gray-900/80 backdrop-blur-md border border-white/10 shadow-2xl text-white">
                        <h1 className="text-3xl font-bold mb-6 text-white text-center">Your Short URLs</h1>
                        <Table className="text-sm">
                            <TableHeader>
                                <TableRow className="text-purple-400">
                                    <TableHead className="w-[60px] text-purple-400">#</TableHead>
                                    <TableHead className="text-purple-400">Short URL</TableHead>
                                    <TableHead className="text-purple-400">Original URL</TableHead>
                                    <TableHead className="text-right text-purple-400">Clicks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {urls.map((url: Url, index: number) => (
                                    <TableRow
                                        key={url.id}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <TableCell className="text-white/80">{index + 1}</TableCell>
                                        <TableCell className="flex items-center gap-2 text-purple-300 font-medium">
                                            <span
                                                className="break-all">{`${process.env.NEXT_PUBLIC_BACKEND_URL}/s/${url.slug}`}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BACKEND_URL}/s/${url.slug}`);
                                                    setClicked(index);
                                                    setTimeout(() => setClicked(null), 2000);
                                                }}
                                                className="hover:text-purple-400 transition"
                                            >
                                                {clicked === index ? <CopyCheck size={18}/> : <Copy size={18}/>}
                                            </button>
                                        </TableCell>
                                        {url.originalUrl.length > 20 ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <TableCell className="text-white/80 break-all">
                                                        {`${url.originalUrl.slice(0, 20)}...`}
                                                    </TableCell>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {url.originalUrl}
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <TableCell className="text-white/80 break-all">
                                                {url.originalUrl}
                                            </TableCell>
                                        )}
                                        <TableCell className="text-right text-purple-300">{url.clicks}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-white/60 text-lg">No URLs found for this user.</div>
                )
            }
        </div>
    );
};

export default ShortURLsByUser;
