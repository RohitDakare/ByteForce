import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import SkillCluster from '../SkillCluster';

// Mock Three.js and WebGL
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({
    camera: {
      position: { x: 0, y: 0, z: 8 },
      lookAt: vi.fn(),
    },
  }),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Text: ({ children }: { children: React.ReactNode }) => <div data-testid="text">{children}</div>,
  Preload: () => null,
  Center: ({ children }: { children: React.ReactNode }) => <div data-testid="center">{children}</div>,
  useProgress: () => ({
    active: false,
    progress: 100,
    errors: [],
  }),
}));

describe('SkillCluster', () => {
  beforeEach(() => {
    // Mock WebGL context
    const mockContext = {
      canvas: document.createElement('canvas'),
      getContext: () => ({
        createProgram: vi.fn(),
        createShader: vi.fn(),
        shaderSource: vi.fn(),
        compileShader: vi.fn(),
        attachShader: vi.fn(),
        linkProgram: vi.fn(),
        getProgramParameter: vi.fn(),
        useProgram: vi.fn(),
      }),
    };
    global.WebGLRenderingContext = vi.fn(() => mockContext);
  });

  it('renders without crashing', () => {
    render(<SkillCluster />);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('shows loading screen when loading', () => {
    vi.mock('@react-three/drei', () => ({
      ...vi.importActual('@react-three/drei'),
      useProgress: () => ({
        active: true,
        progress: 50,
        errors: [],
      }),
    }));

    render(<SkillCluster />);
    expect(screen.getByText(/Loading visualization/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('shows error message when loading fails', () => {
    vi.mock('@react-three/drei', () => ({
      ...vi.importActual('@react-three/drei'),
      useProgress: () => ({
        active: true,
        progress: 100,
        errors: ['Failed to load texture'],
      }),
    }));

    render(<SkillCluster />);
    expect(screen.getByText(/Error loading assets/)).toBeInTheDocument();
  });

  it('renders all skill nodes', () => {
    render(<SkillCluster />);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('Data Science')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Deep Learning')).toBeInTheDocument();
  });

  it('includes orbit controls', () => {
    render(<SkillCluster />);
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
  });

  it('handles errors gracefully', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    
    vi.mock('@react-three/fiber', () => {
      throw error;
    });

    render(<SkillCluster />);
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
    
    consoleError.mockRestore();
  });
});
