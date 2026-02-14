import { useEffect } from 'react';
import { Button } from '../../atoms';
import { useFetchTranscriptions, useFetchDownload } from '@/hooks/transcription';
import TransccriptionItem from '../../atoms/TransccriptionItem/TransccriptionItem';

const TranscriptionList = () => {
    const { transcriptions, loading, fetchTranscriptions, hasMore, loadMore } = useFetchTranscriptions();
    const { handleDownload, downloading } = useFetchDownload();

    useEffect(() => {
        fetchTranscriptions();
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Historial de Transcripciones</h2>
                <Button
                    onClick={() => fetchTranscriptions()}
                    className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                >
                    Refrescar
                </Button>
            </div>

            {loading && transcriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Cargando...</div>
            ) : transcriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No hay transcripciones guardadas.</div>
            ) : (
                <div className="space-y-3">
                    {transcriptions.map((t) => (
                        <div key={t.transcriptionId} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                            <TransccriptionItem t={t} />

                            <div className="flex items-center gap-3">
                                {t.status === 'pending' ? (
                                    <span className="text-xs text-yellow-500">Procesando...</span>
                                ) : (
                                    <Button
                                        onClick={() => t.s3Key && handleDownload(t.s3Key, t.transcriptionId)}
                                        disabled={downloading === t.transcriptionId || !t.s3Key}
                                        className="text-sm px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {downloading === t.transcriptionId ? 'Bajando...' : 'Descargar'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={loadMore}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                            >
                                {loading ? 'Cargando más...' : 'Cargar más'}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TranscriptionList;