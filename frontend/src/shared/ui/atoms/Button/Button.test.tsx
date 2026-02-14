import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button - Comportamiento', () => {
  it('debe renderizar el botón con texto', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('debe ejecutar onClick cuando se hace click', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByRole('button').click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no debe ejecutar onClick cuando está disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    screen.getByRole('button').click();
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('debe manejar múltiples clicks', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    button.click();
    button.click();
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('debe renderizar sin onClick definido', () => {
    render(<Button>No handler</Button>);
    
    expect(() => screen.getByRole('button').click()).not.toThrow();
  });

  it('debe ser tipo "button" por defecto', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('debe aplicar atributo disabled correctamente', () => {
    render(<Button disabled>Disabled</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('debe aceptar y aplicar props HTML nativas', () => {
    render(
      <Button 
        aria-label="Close dialog" 
        data-testid="custom-button"
        name="action"
      >
        X
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    expect(button).toHaveAttribute('name', 'action');
  });
});