import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoList from '../TodoList';
import { useQuery } from '@tanstack/react-query';
import type { Todo } from '../TodoList';

// Mock dữ liệu cho tests
const mockTodos: Todo[] = [
  { _id: 1, body: "Task 1", completed: false },
  { _id: 2, body: "Task 2", completed: true },
];

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => {
  return {
    useQuery: vi.fn(),
    QueryClient: vi.fn(),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  };
});

// Mock Text component để tránh vấn đề với gradient
vi.mock('@chakra-ui/react', () => {
  return {
    Flex: ({ children }: { children: React.ReactNode }) => <div data-testid="flex">{children}</div>,
    Text: ({ children }: { children: React.ReactNode }) => <div data-testid="text">{children}</div>,
    Stack: ({ children }: { children: React.ReactNode }) => <div data-testid="stack">{children}</div>,
    Spinner: () => <div data-testid="spinner">Loading...</div>
  };
});

// Mock TodoItem component
vi.mock('../TodoItem', () => ({
  default: ({ todo }: { todo: Todo }) => <div data-testid={`todo-${todo._id}`}>{todo.body}</div>
}));

describe('TodoList Component', () => {
  it('shows loading spinner when isLoading is true', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({ isLoading: true, data: undefined });
    
    render(<TodoList />);
    
    // Kiểm tra spinner xuất hiện
    const spinnerElement = screen.getByTestId("spinner");
    expect(spinnerElement).toBeTruthy();
  });
  
  it('shows empty state when no todos are available', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({ isLoading: false, data: [] });
    
    render(<TodoList />);
    
    // Kiểm tra text hiển thị khi không có todos
    expect(screen.getByText(/All tasks completed!/i)).toBeTruthy();
  });
  
  it('renders list of todos when data is available', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({ isLoading: false, data: mockTodos });
    
    render(<TodoList />);
    
    // Kiểm tra todos được render
    expect(screen.getByText("Task 1")).toBeTruthy();
    expect(screen.getByText("Task 2")).toBeTruthy();
  });
}); 