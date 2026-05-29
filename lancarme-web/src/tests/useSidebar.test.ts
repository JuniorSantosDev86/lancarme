import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSidebar } from '../hooks/useSidebar';

describe('useSidebar', () => {
  it('estado inicial é fechado', () => {
    const { result } = renderHook(() => useSidebar());
    expect(result.current.isOpen).toBe(false);
  });

  it('open() abre o drawer', () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it('close() fecha o drawer', () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.open());
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('toggle() alterna o estado', () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });
});
