import type { Transcription } from "@/hooks/transcription/useFetchTranscriptions";




const TransccriptionItem = ({ t }: { t: Transcription }) => {
    return (

        <div className="mb-2 md:mb-0">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${t.status === 'pending' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
                <span className="text-gray-300 font-medium">
                    {new Date(t.createdAt).toLocaleString()}
                </span>
                {t.fileName && <span className="text-xs px-2 py-0.5 bg-blue-900/40 text-blue-300 rounded-full">{t.fileName}</span>}
            </div>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1 w-full max-w-xl">
                {t.preview || "Sin vista previa"}
            </p>
        </div>
    );
};

export default TransccriptionItem;