import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoItem from '../TodoItem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
    QueryClientProvider: (actual as Record<string, unknown>).QueryClientProvider,
    useMutation: () => ({
      mutate: vi.fn(),
      isPending: false
    })
  };
});

// Create a wrapper with QueryClientProvider for testing
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

describe('TodoItem Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.restoreAllMocks();
  });
  
  it('renders todo item text correctly', () => {
    const todo = { _id: 1, body: "Test todo", completed: false };
    
    render(
      <TodoItem todo={todo} />, 
      { wrapper: createWrapper() }
    );
    
    // Verify the todo text is displayed
    const element = screen.getByText("Test todo");
    expect(element).toBeTruthy();
  });

  it('shows correct badge for incomplete todo', () => {
    const todo = { _id: 1, body: "Test todo", completed: false };
    
    render(
      <TodoItem todo={todo} />,
      { wrapper: createWrapper() }
    );
    
    // Check that "In Progress" badge is displayed
    const element = screen.getByText("In Progress");
    expect(element).toBeTruthy();
  });

  it('shows correct badge for completed todo', () => {
    const todo = { _id: 1, body: "Test todo", completed: true };
    
    render(
      <TodoItem todo={todo} />,
      { wrapper: createWrapper() }
    );
    
    // Check that "Done" badge is displayed
    const element = screen.getByText("Done");
    expect(element).toBeTruthy();
  });
  
  // Ghi chú: Để test đầy đủ các hành động CRUD (update/delete),
  // cần thiết kế component để dễ test hơn, ví dụ:
  // 1. Thêm data-testid cho các button
  // 2. Tách logic mutation ra khỏi component hoặc cung cấp props để mock
  // 3. Sử dụng dependency injection để dễ mock API calls
}); 