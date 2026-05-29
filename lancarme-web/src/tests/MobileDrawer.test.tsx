import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MobileDrawer } from '../components/layout/MobileDrawer';

describe('MobileDrawer', () => {
  it('drawer está fechado quando isOpen=false', () => {
    render(<MobileDrawer isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText('Lançar.me')).not.toBeInTheDocument();
  });

  it('drawer abre quando isOpen=true', () => {
    render(<MobileDrawer isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Lançar.me')).toBeInTheDocument();
  });

  it('botão fechar chama onClose', async () => {
    const onClose = vi.fn();
    render(<MobileDrawer isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByRole('button', { name: 'Fechar menu de navegação' });
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('drawer contém itens de navegação', () => {
    render(<MobileDrawer isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Command Center')).toBeInTheDocument();
  });
});
