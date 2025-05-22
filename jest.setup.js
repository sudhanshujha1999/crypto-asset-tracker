// Mock TextEncoder
global.TextEncoder = class TextEncoder {
  encode(str) {
    return Buffer.from(str);
  }
};

// Mock TextDecoder
global.TextDecoder = class TextDecoder {
  decode(buffer) {
    return buffer.toString();
  }
};

// Mock fetch
global.fetch = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
