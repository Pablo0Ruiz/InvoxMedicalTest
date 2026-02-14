import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VoiceItem from './VoiceItem';

describe('VoiceItem', () => {
    it('renders transcript correctly', () => {
        render(<VoiceItem transcript="Hello world" />);
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('renders speaker when provided', () => {
        render(<VoiceItem transcript="Hello world" speaker="User" />);
        expect(screen.getByText('User:')).toBeInTheDocument();
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });
});
