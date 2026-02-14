import { getTranscription } from "@/api/querys/query-file";
import { fetchAuthSession } from "aws-amplify/auth";
import { useState } from "react";


export interface Transcription {
    transcriptionId: string;
    createdAt: string;
    preview?: string;
    status?: string;
    s3Key?: string;
    fileName?: string;
    userId: string;
}

const useFetchTranscriptions = () => {
    const [loading, setLoading] = useState(false);
    const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
    const [lastKey, setLastKey] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);

    const fetchTranscriptions = async (loadMore = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();

            const currentKey = loadMore ? lastKey : undefined;

            const response = await getTranscription(token || '', 10, currentKey);

            if (response.ok) {
                const data = await response.json();
                const newItems = data.items || [];
                const nextKey = data.lastKey;

                setTranscriptions(prev => {
                    const combined = loadMore ? [...prev, ...newItems] : newItems;
                    const uniqueMap = new Map<string, Transcription>();
                    combined.forEach((item: Transcription) => uniqueMap.set(item.transcriptionId, item));
                    return Array.from(uniqueMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                });

                setLastKey(nextKey);
                setHasMore(!!nextKey);
            }
        } catch (error) {
            console.error("Error fetching transcriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        transcriptions,
        loading,
        fetchTranscriptions,
        hasMore,
        loadMore: () => fetchTranscriptions(true)
    }
}

export default useFetchTranscriptions
