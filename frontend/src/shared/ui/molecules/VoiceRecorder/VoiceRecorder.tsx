import { useAudioRecorder } from '@/hooks/speech/useAudioRecorder';
import { useSpeechmaticsWebSocket } from '@/hooks/speech/useSpeechmaticsWebSocket';
import { Button } from '@/shared/ui/atoms';
import { fetchAuthSession } from 'aws-amplify/auth';
import { IndicatorStatus } from './indicatorStatus';
import { saveTranscription } from '@/api/querys/query-file';
import { VoiceItem } from '@/shared/ui/atoms/VoiceItem';
import { AiMicIcon } from 'hugeicons-react';

const VoiceRecorder = () => {
    const {
        isConnected,
        transcripts,
        partialTranscript,
        connect,
        disconnect,
        sendAudio,
        error: wsError
    } = useSpeechmaticsWebSocket();

    const {
        isRecording,
        startRecording,
        stopRecording,
        error: recorderError
    } = useAudioRecorder(sendAudio);

    const handleStartRecording = async () => {
        await connect();
        setTimeout(async () => {
            await startRecording();
        }, 500);
    };

    const handleStopRecording = async () => {
        stopRecording();
        disconnect();

        if (transcripts.length === 0 && !partialTranscript) return;

        const fullTranscript = transcripts.map(t => t.transcript).join(' ') + (partialTranscript ? ' ' + partialTranscript : '');

        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();

            const payload = session.tokens?.idToken?.payload;
            const userId = payload?.sub;

            if (!token || !userId) {
                console.error("No auth token or user ID found");
                return;
            }

            const response = await saveTranscription(token, fullTranscript, userId);

            if (response.ok) {
                console.log("Transcription saved successfully");
                window.location.reload();
            } else {
                console.error("Failed to save transcription");
            }
        } catch (error) {
            console.error("Error saving transcription:", error);
        }
    };

    const fullTranscript = transcripts.map(t => t.transcript).join(' ');
    const displayText = partialTranscript || fullTranscript || 'La transcripción aparecerá aquí...';

    const error = recorderError || wsError;

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    {!isRecording ? (
                        <Button
                            onClick={handleStartRecording}
                            variant="primary"
                            size="lg"
                        >
                            <AiMicIcon className="w-5 h-5" />
                            Iniciar Grabación
                        </Button>
                    ) : (
                        <Button
                            onClick={handleStopRecording}
                            variant="secondary"
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 border-red-500 animate-pulse"
                        >
                            <div className="w-3 h-3 bg-white rounded-full" />
                            Detener Grabación
                        </Button>
                    )}
                </div>

                <IndicatorStatus isRecording={isRecording} isConnected={isConnected} error={error} />

                <div className="min-h-[200px] p-4 bg-gray-900 rounded border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">Transcripción en Tiempo Real</h3>
                    <div className="text-gray-300 whitespace-pre-wrap">
                        {fullTranscript && (
                            <p className="mb-2">{fullTranscript}</p>
                        )}
                        {partialTranscript && (
                            <p className="text-gray-400 italic">{partialTranscript}</p>
                        )}
                        {!fullTranscript && !partialTranscript && (
                            <p className="text-gray-500">{displayText}</p>
                        )}
                    </div>
                </div>

                {transcripts.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Historial:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {transcripts.map((t, idx) => (
                                <VoiceItem key={idx} transcript={t.transcript} speaker={t.speaker} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceRecorder;
