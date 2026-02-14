import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TransccriptionItem from './TransccriptionItem';
import type { Transcription } from '@/hooks/transcription/useFetchTranscriptions';

const mockTranscription: Transcription = {
    transcriptionId: '123',
    userId: 'user1',
    createdAt: '2023-01-01T10:00:00Z',
    s3Key: 'path/to/audio.mp3',
    status: 'completed',
    preview: 'This is a test transcription preview.',
    fileName: 'test-audio.mp3'
};

describe('TransccriptionItem', () => {
    it('renders transcription details correctly', () => {
        render(<TransccriptionItem t={mockTranscription} />);

        expect(screen.getByText('test-audio.mp3')).toBeInTheDocument();
        expect(screen.getByText('This is a test transcription preview.')).toBeInTheDocument();

    });

    it('renders pending status correctly', () => {
        const pendingTranscription = { ...mockTranscription, status: 'pending', preview: 'Procesando...' };
        render(<TransccriptionItem t={pendingTranscription} />);

        expect(screen.getByText('Procesando...')).toBeInTheDocument();
    });

    it('renders error status correctly', () => {
        const failedTranscription = { ...mockTranscription, status: 'failed', preview: 'Error en transcripción' };
        render(<TransccriptionItem t={failedTranscription} />);

        expect(screen.getByText('Error en transcripción')).toBeInTheDocument();
    });
});
