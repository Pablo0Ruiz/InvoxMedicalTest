import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TranscriptionList from './TranscriptionList';
import { useFetchTranscriptions, useFetchDownload } from '@/hooks/transcription';

vi.mock('@/hooks/transcription', () => ({
    useFetchTranscriptions: vi.fn(),
    useFetchDownload: vi.fn(),
}));

const mockTranscriptions = [
    {
        transcriptionId: '1',
        userId: 'user1',
        createdAt: '2023-01-01T10:00:00Z',
        s3Key: 'path/1',
        status: 'completed',
        preview: 'Preview 1',
        fileName: 'file1.mp3'
    },
    {
        transcriptionId: '2',
        userId: 'user1',
        createdAt: '2023-01-02T10:00:00Z',
        s3Key: 'path/2',
        status: 'pending',
        preview: 'Procesando...',
        fileName: 'file2.mp3'
    }
];

describe('TranscriptionList', () => {
    const mockFetchTranscriptions = vi.fn();
    const mockLoadMore = vi.fn();
    const mockDownloadFile = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useFetchTranscriptions as any).mockReturnValue({
            transcriptions: [],
            loading: false,
            fetchTranscriptions: mockFetchTranscriptions,
            hasMore: false,
            loadMore: mockLoadMore
        });
        (useFetchDownload as any).mockReturnValue({
            downloadFile: mockDownloadFile,
            isDownloading: false,
            handleDownload: mockDownloadFile
        });
    });

    it('renders initialization and empty state', () => {
        (useFetchTranscriptions as any).mockReturnValue({
            transcriptions: [],
            loading: false,
            fetchTranscriptions: mockFetchTranscriptions,
            hasMore: false,
            loadMore: mockLoadMore
        });
        render(<TranscriptionList />);
        expect(mockFetchTranscriptions).toHaveBeenCalled();
        expect(screen.getByText(/No hay transcripciones guardadas/i)).toBeInTheDocument();
    });

    it('renders loading state', () => {
        (useFetchTranscriptions as any).mockReturnValue({
            transcriptions: [],
            loading: true,
            fetchTranscriptions: mockFetchTranscriptions,
            hasMore: false,
            loadMore: mockLoadMore
        });

        render(<TranscriptionList />);
        expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
    });

    it('renders list of transcriptions', () => {
        (useFetchTranscriptions as any).mockReturnValue({
            transcriptions: mockTranscriptions,
            loading: false,
            fetchTranscriptions: mockFetchTranscriptions,
            hasMore: false,
            loadMore: mockLoadMore
        });
        render(<TranscriptionList />);

        expect(screen.getByText('file1.mp3')).toBeInTheDocument();
        expect(screen.getByText('Preview 1')).toBeInTheDocument();
        expect(screen.getAllByText(/Procesando.../i)[0]).toBeInTheDocument();
    });

    it('shows load more button when hasMore is true', () => {
        (useFetchTranscriptions as any).mockReturnValue({
            transcriptions: mockTranscriptions,
            loading: false,
            fetchTranscriptions: mockFetchTranscriptions,
            hasMore: true,
            loadMore: mockLoadMore
        });
        render(<TranscriptionList />);

        const loadMoreBtn = screen.getByText('Cargar más');
        expect(loadMoreBtn).toBeInTheDocument();

        fireEvent.click(loadMoreBtn);
        expect(mockLoadMore).toHaveBeenCalled();
    });

    it('calls refresh when refresh button is clicked', () => {
        (useFetchTranscriptions as any).mockReturnValue({
            transcriptions: mockTranscriptions,
            loading: false,
            fetchTranscriptions: mockFetchTranscriptions,
            hasMore: false,
            loadMore: mockLoadMore
        });
        render(<TranscriptionList />);

        const refreshBtn = screen.getByText('Refrescar');
        fireEvent.click(refreshBtn);

        expect(mockFetchTranscriptions).toHaveBeenCalled();
    });
});
