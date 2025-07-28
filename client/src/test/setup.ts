import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock cho matchMedia - cần thiết cho Chakra UI
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Đơn giản hóa để tránh lỗi
Object.defineProperty(window, 'fetch', {
  value: vi.fn(),
  writable: true
});

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
}); 