import { useEffect, useState } from "react";
import { LinkPreview } from "./ui/MicroLink";

type Props = {
  shortUrl: string;
};
type URL = {
  original: string;
  title: string;
  description: string;
  image: string;
};
export default function URLDisplay({ shortUrl }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const [clicked, setClicked] = useState<boolean>(false);
  const [ogData, setOgData] = useState<URL | null>(null);
  useEffect(() => {
    const fetchOg = async () => {
      try {
        const response = await fetch(`api/urls/${shortUrl}`)
        if (!response.ok) {
          throw new Error("Failed to fetch Open Graph data");
        }
        const data = await response.json();
        setOgData(data);
      } catch (error) {
        console.error("Error fetching Open Graph data:", error);
      }
    };
    fetchOg();
  }, [shortUrl]);
  console.log(ogData);
  return (
    <div className="url-display">
      <p className="mt-10">Here is your magic URL:</p>
      <div className="mt-2 p-4 bg-gray-800 rounded-md shadow-md flex items-center justify-between gap-1">
        
           <LinkPreview
          url={ogData?.original || ""}
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
        >
          {`${BASE_URL}/api/${shortUrl}`}
        </LinkPreview>

        <button
          onClick={() => {
            navigator.clipboard.writeText(`${BASE_URL}/api/${shortUrl}`)
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
