import { render, screen } from '@testing-library/react';
import Input from './Input';
import { describe, it, expect } from 'vitest';

describe('Input', () => {
    it('renders with placeholder', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeDefined();
    });
});
