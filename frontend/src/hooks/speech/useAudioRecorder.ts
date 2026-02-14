import { useState, useRef, useCallback } from 'react';

interface UseAudioRecorderReturn {
    isRecording: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    audioStream: MediaStream | null;
    error: string | null;
}

export const useAudioRecorder = (
    onAudioData?: (audioData: Blob) => void
): UseAudioRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = useCallback(async () => {
        try {
            setError(null);

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            setAudioStream(stream);

            const audioContext = new AudioContext({ sampleRate: 16000 });
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);

            source.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcm16 = new Int16Array(inputData.length);

                let maxAmp = 0;
                for (let i = 0; i < inputData.length; i++) {
                    const s = Math.max(-1, Math.min(1, inputData[i]));
                    if (Math.abs(s) > maxAmp) maxAmp = Math.abs(s);
                    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }

                if (onAudioData) {
                    onAudioData(new Blob([pcm16]));
                }
            };

            (mediaRecorderRef as any).current = {
                stop: () => {
                    processor.disconnect();
                    source.disconnect();
                    audioContext.close();
                }
            };

            setIsRecording(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al acceder al micrófono';
            setError(errorMessage);
            console.error('Error starting recording:', err);
        }
    }, [onAudioData]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (audioStream) {
                audioStream.getTracks().forEach((track) => track.stop());
                setAudioStream(null);
            }
        }
    }, [isRecording, audioStream]);

    return {
        isRecording,
        startRecording,
        stopRecording,
        audioStream,
        error,
    };
};
