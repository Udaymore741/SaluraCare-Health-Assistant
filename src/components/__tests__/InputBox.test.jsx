import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InputBox from '../InputBox';

describe('InputBox Component', () => {
  it('should render with placeholder text', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type a message..." />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    expect(input).toBeDefined();
  });

  it('should accept text input', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(input.value).toBe('Hello');
  });

  it('should call onSend when button is clicked', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    const button = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);
    
    expect(mockOnSend).toHaveBeenCalledWith('Test message');
    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

  it('should call onSend when Enter key is pressed', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(mockOnSend).toHaveBeenCalledWith('Test message');
    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

  it('should clear input after submission via button', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    const button = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);
    
    expect(input.value).toBe('');
  });

  it('should clear input after submission via Enter key', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(input.value).toBe('');
  });

  it('should disable input when disabled prop is true', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={true} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    const button = screen.getByText('Send');
    
    expect(input.disabled).toBe(true);
    expect(button.disabled).toBe(true);
  });

  it('should not call onSend when disabled', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={true} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    const button = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);
    
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should not submit empty or whitespace-only input', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    const button = screen.getByText('Send');
    
    // Test empty input
    fireEvent.click(button);
    expect(mockOnSend).not.toHaveBeenCalled();
    
    // Test whitespace-only input
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should trim whitespace from input before sending', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    const button = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: '  Test message  ' } });
    fireEvent.click(button);
    
    expect(mockOnSend).toHaveBeenCalledWith('Test message');
  });

  it('should disable button when input is empty', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const button = screen.getByText('Send');
    
    expect(button.disabled).toBe(true);
  });

  it('should enable button when input has text', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    const button = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Test' } });
    
    expect(button.disabled).toBe(false);
  });

  it('should apply focus styles when input is focused', () => {
    const mockOnSend = vi.fn();
    render(<InputBox onSend={mockOnSend} disabled={false} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    
    // Check that focus ring classes are present in className
    expect(input.className).toContain('focus:ring-2');
    expect(input.className).toContain('focus:ring-blue-500');
  });
});
