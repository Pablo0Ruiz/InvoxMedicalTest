import { getTranscriptionFile } from "@/api/querys/query-file";
import { fetchAuthSession } from "aws-amplify/auth";
import { useState } from "react";



const useFetchDownload = () => {
    const [downloading, setDownloading] = useState<string | null>(null);

    const handleDownload = async (key: string, id: string) => {
        if (!key) return;
        setDownloading(id);
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();

            const response = await getTranscriptionFile(token || '', key);

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transcription-${id}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            }
        } catch (error) {
            console.error("Download error:", error);
        } finally {
            setDownloading(null);
        }
    };

    return { handleDownload, downloading };
}

export default useFetchDownload;