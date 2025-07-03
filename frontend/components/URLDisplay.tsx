import { useEffect, useState } from "react";
import { LinkPreview } from "./ui/MicroLink";
import axios from "@/utils/axiosInstance";
type Props = {
  shortUrl: string;
};
type URL = {
  originalUrl: string;
  title: string;
  description: string;
  image: string;
};
export default function URLDisplay({ shortUrl }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const [clicked, setClicked] = useState<boolean>(false);
  const [ogData, setOgData] = useState<URL | null>(null);
  useEffect(() => {
    const fetchOg = async () => {
      try {
        const response = await axios.get(`api/v1/url/${shortUrl}`)
        if (response.status !== 200) {
          throw new Error("Failed to fetch Open Graph data");
        }
        const data = await response.data;
        setOgData(data);
      } catch (error) {
        console.error("Error fetching Open Graph data:", error);
      }
    };
    fetchOg();
  }, [shortUrl]);
  console.log(ogData);
  return (
    <div className="url-display relative">
      <p className="mt-10">Here is your magic URL:</p>
      <div className="mt-2 p-4 bg-gray-800 rounded-md shadow-md flex items-center justify-between gap-1">
        
           <LinkPreview
          url={ogData?.originalUrl || ""}
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
        >
          {`${BASE_URL}/s/${shortUrl}`}
        </LinkPreview>

        <button
          onClick={() => {
            navigator.clipboard.writeText(`${BASE_URL}/s/${shortUrl}`)
            setClicked(true);
            setTimeout(() => setClicked(false), 2000); // Reset after 2 seconds
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-fit"
        >
          {clicked ? "Copied!" : "Copy URL"}
        </button>
        
      </div>
    </div>
  );
}
