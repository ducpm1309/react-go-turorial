import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TodoItem from '../TodoItem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
}); 