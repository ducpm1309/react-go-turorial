import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoForm from '../TodoForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BASE_URL } from '../../App';

// Mock react-query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  const mockInvalidateQueries = vi.fn();
  
  return {
    ...(actual as object),
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries
    }),
    // Original exports we need for the wrapper
    QueryClient: (actual as Record<string, unknown>).QueryClient,
    QueryClientProvider: (actual as Record<string, unknown>).QueryClientProvider
  };
});

// Tạo wrapper với QueryClientProvider cho testing
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('TodoForm Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.restoreAllMocks();
    
    // Mock fetch API
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ _id: 123, body: "New test todo", completed: false })
    });
  });
  
  it('renders input field and add button', () => {
    render(
      <TodoForm />, 
      { wrapper: createWrapper() }
    );
    
    // Kiểm tra input field và button tồn tại
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeTruthy();
    
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeTruthy();
  });
  
  it('allows typing in the input field', () => {
    render(
      <TodoForm />, 
      { wrapper: createWrapper() }
    );
    
    // Tìm input field
    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    
    // Giả lập nhập text
    fireEvent.change(inputElement, { target: { value: 'New test todo' } });
    
    // Kiểm tra giá trị đã được cập nhật
    expect(inputElement.value).toBe('New test todo');
  });
  
  it('calls API to create todo when form is submitted', async () => {
    render(
      <TodoForm />, 
      { wrapper: createWrapper() }
    );
    
    // Tìm input và button
    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    const buttonElement = screen.getByRole('button');
    
    // Nhập text và submit form
    fireEvent.change(inputElement, { target: { value: 'New test todo' } });
    fireEvent.click(buttonElement);
    
    // Kiểm tra fetch đã được gọi đúng cách
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/todos`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: 'New test todo' }),
        })
      );
    });
  });
  
  it('clears input after successful form submission', async () => {
    render(
      <TodoForm />, 
      { wrapper: createWrapper() }
    );
    
    // Tìm input và button
    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    const buttonElement = screen.getByRole('button');
    
    // Nhập text và submit form
    fireEvent.change(inputElement, { target: { value: 'New test todo' } });
    fireEvent.click(buttonElement);
    
    // Kiểm tra input đã được xóa sau khi submit thành công
    await waitFor(() => {
      expect(inputElement.value).toBe('');
    });
  });
}); 