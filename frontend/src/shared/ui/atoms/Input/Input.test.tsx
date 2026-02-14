import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input - Comportamiento', () => {
  it('debe renderizar un input con placeholder', () => {
    render(<Input placeholder="Enter text" />);
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('debe renderizar con value controlado', () => {
    render(<Input value="Test value" onChange={vi.fn()} />);
    
    expect(screen.getByRole('textbox')).toHaveValue('Test value');
  });

  it('debe renderizar con label y asociarlo correctamente', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    
    expect(screen.getByText('Username')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Enter username');
    const label = screen.getByText('Username').closest('label');
    expect(label).toContainElement(input);
  });

  it('debe ejecutar onChange al escribir', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    input.focus();
    
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )?.set?.call(input, 'new value');
    
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('debe funcionar sin onChange definido', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(() => input.dispatchEvent(new Event('change', { bubbles: true }))).not.toThrow();
  });

  it('debe aplicar atributo disabled y no ejecutar onChange', () => {
    const handleChange = vi.fn();
    render(<Input disabled onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('debe aplicar atributo readonly', () => {
    render(<Input readOnly value="Read only value" onChange={vi.fn()} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveValue('Read only value');
  });

  it('debe aceptar y aplicar props HTML nativas', () => {
    render(
      <Input
        name="email"
        id="email-input"
        required
        maxLength={100}
        aria-label="Email input"
        data-testid="email-field"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('id', 'email-input');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('maxLength', '100');
    expect(screen.getByLabelText('Email input')).toBeInTheDocument();
    expect(screen.getByTestId('email-field')).toBeInTheDocument();
  });
});