import { useState, useRef, useCallback, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { backendUrl,getToken } from '@/api/querys/query-file';
interface TranscriptResult {
    transcript: string;
    isFinal: boolean;
    speaker?: string;
}

interface UseSpeechmaticsWebSocketReturn {
    isConnected: boolean;
    transcripts: TranscriptResult[];
    partialTranscript: string;
    connect: () => Promise<void>;
    disconnect: () => void;
    sendAudio: (audioBlob: Blob) => void;
    error: string | null;
}

const SPEECHMATICS_WS_URL = 'wss://eu2.rt.speechmatics.com/v2';

export const useSpeechmaticsWebSocket = (
    
): UseSpeechmaticsWebSocketReturn => {
    const [isConnected, setIsConnected] = useState(false);
    const [transcripts, setTranscripts] = useState<TranscriptResult[]>([]);
    const [partialTranscript, setPartialTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const tokenRef = useRef<string | null>(null);


    const fetchToken = async (): Promise<string> => {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        try {

            if (!idToken) {
                throw new Error('No valid session found');
            }

            const response = await getToken(idToken);

            if (!response.ok) {
                throw new Error('Failed to fetch Speechmatics token');
            }

            const data = await response.json();
            return data.token;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error fetching token';
            throw new Error(errorMessage);
        }
    };

    const connect = useCallback(async () => {
        try {
            setError(null);

            const token = await fetchToken();
            tokenRef.current = token;

            const ws = new WebSocket(`${SPEECHMATICS_WS_URL}?jwt=${token}`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);

                const startMessage = {
                    message: 'StartRecognition',
                    audio_format: {
                        type: 'raw',
                        encoding: 'pcm_s16le',
                        sample_rate: 16000,
                    },
                    transcription_config: {
                        language: 'es',
                        enable_partials: true,
                        max_delay: 2,
                    },
                };

                ws.send(JSON.stringify(startMessage));
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);

                switch (message.message) {
                    case 'RecognitionStarted':
                        console.log('Recognition started');
                        break;

                    case 'AddPartialTranscript':
                        if (message.metadata?.transcript) {
                            setPartialTranscript(message.metadata.transcript);
                        }
                        break;

                    case 'AddTranscript':
                        if (message.metadata?.transcript) {
                            const transcript: TranscriptResult = {
                                transcript: message.metadata.transcript,
                                isFinal: true,
                                speaker: message.metadata.speaker,
                            };
                            setTranscripts((prev) => [...prev, transcript]);
                            setPartialTranscript('');
                        }
                        break;

                    case 'EndOfTranscript':
                        console.log('End of transcript');
                        break;

                    case 'Error':
                        console.error('Speechmatics error:', message);
                        setError(message.reason || 'Unknown error');
                        break;

                    case 'Warning':
                        console.warn('Speechmatics warning:', message);
                        break;

                    default:
                        console.log('Unhandled message:', message);
                }
            };

            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                setError('Error de conexión WebSocket');
                setIsConnected(false);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error connecting to WebSocket';
            setError(errorMessage);
            console.error('Connection error:', err);
        }
    }, [backendUrl]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            const endMessage = { message: 'EndOfStream' };
            wsRef.current.send(JSON.stringify(endMessage));

            wsRef.current.close();
            wsRef.current = null;
            setIsConnected(false);
        }
    }, []);

    const sendAudio = useCallback(async (audioBlob: Blob) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket not connected');
            return;
        }

        try {
            const buffer = await audioBlob.arrayBuffer();
            wsRef.current.send(buffer);
        } catch (err) {
            console.error('Error sending audio:', err);
        }
    }, []);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        isConnected,
        transcripts,
        partialTranscript,
        connect,
        disconnect,
        sendAudio,
        error,
    };
};
