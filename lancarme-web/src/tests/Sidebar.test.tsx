import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarNavItem } from '../components/layout/SidebarNavItem';
import { SidebarNav } from '../components/layout/SidebarNav';
import { Sidebar } from '../components/layout/Sidebar';
import { LayoutDashboard, Lightbulb } from 'lucide-react';
import type { NavItem } from '../types/navigation';

const activeItem: NavItem = {
  id: 'command-center',
  label: 'Command Center',
  icon: LayoutDashboard,
  active: true,
  comingSoon: false,
  group: 'Visão geral',
};

const inactiveItem: NavItem = {
  id: 'strategy',
  label: 'Strategy Core',
  icon: Lightbulb,
  active: false,
  comingSoon: true,
  group: 'Estratégia e Lançamento',
};

describe('SidebarNavItem', () => {
  it('item ativo renderiza com aria-current="page"', () => {
    render(<SidebarNavItem item={activeItem} />);
    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('aria-current', 'page');
  });

  it('item ativo não tem tabIndex (não interativo neste bloco)', () => {
    render(<SidebarNavItem item={activeItem} />);
    const item = screen.getByRole('listitem');
    expect(item).not.toHaveAttribute('tabindex');
  });

  it('item com comingSoon renderiza com aria-disabled="true"', () => {
    render(<SidebarNavItem item={inactiveItem} />);
    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('item com comingSoon não é <a> nem <button>', () => {
    const { container } = render(<SidebarNavItem item={inactiveItem} />);
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
  });

  it('item com comingSoon não possui tabIndex', () => {
    render(<SidebarNavItem item={inactiveItem} />);
    const item = screen.getByRole('listitem');
    expect(item).not.toHaveAttribute('tabindex');
  });

  it('label é visível no DOM', () => {
    render(<SidebarNavItem item={activeItem} />);
    expect(screen.getByText('Command Center')).toBeInTheDocument();
  });
});

describe('SidebarNav', () => {
  it('renderiza todos os grupos de navegação', () => {
    render(<SidebarNav />);
    expect(screen.getByText('Visão geral')).toBeInTheDocument();
    expect(screen.getByText('Estratégia e Lançamento')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Tráfego e Funil')).toBeInTheDocument();
    expect(screen.getByText('Execução')).toBeInTheDocument();
    expect(screen.getByText('Ativos')).toBeInTheDocument();
    expect(screen.getByText('Sistema')).toBeInTheDocument();
  });

  it('renderiza o item Command Center', () => {
    render(<SidebarNav />);
    expect(screen.getByText('Command Center')).toBeInTheDocument();
  });

  it('somente o Command Center tem aria-current="page"', () => {
    render(<SidebarNav />);
    const activeItems = screen.getAllByRole('listitem').filter(
      (el) => el.getAttribute('aria-current') === 'page',
    );
    expect(activeItems).toHaveLength(1);
    expect(within(activeItems[0]).getByText('Command Center')).toBeInTheDocument();
  });

  it('itens futuros têm aria-disabled="true"', () => {
    render(<SidebarNav />);
    const disabledItems = screen.getAllByRole('listitem').filter(
      (el) => el.getAttribute('aria-disabled') === 'true',
    );
    expect(disabledItems.length).toBeGreaterThan(0);
  });

  it('nenhum item futuro possui atributo href', () => {
    const { container } = render(<SidebarNav />);
    expect(container.querySelector('a')).toBeNull();
  });
});

describe('Sidebar', () => {
  it('renderiza o logo "Lançar.me"', () => {
    render(<Sidebar />);
    expect(screen.getByText('Lançar.me')).toBeInTheDocument();
  });

  it('renderiza o nome estático do usuário no rodapé', () => {
    render(<Sidebar />);
    expect(screen.getByText('Gabriel Silva')).toBeInTheDocument();
  });

  it('renderiza o SidebarNav com grupos de navegação', () => {
    render(<Sidebar />);
    expect(screen.getByText('Command Center')).toBeInTheDocument();
    expect(screen.getByText('Strategy Core')).toBeInTheDocument();
  });
});
