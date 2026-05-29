export const greeting = {
  name: 'Gabriel',
  subtitle: 'Aqui está o resumo do seu lançamento.',
  date: '28 de mai. de 2026',
};

export const demoLabel = 'Visualização demonstrativa';

export type OverviewCard = {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
};

export const overviewCards: OverviewCard[] = [
  { id: 'revenue', label: 'Receita', value: 'R$ 127.450,00', change: '+12%', changeType: 'positive' },
  { id: 'leads', label: 'Leads', value: '2.842', change: '+8%', changeType: 'positive' },
  { id: 'sales', label: 'Vendas', value: '148', change: '+5%', changeType: 'positive' },
  { id: 'roas', label: 'ROAS', value: '3,21', change: '+0,4', changeType: 'positive' },
];

export type ActionStatus = 'pendente' | 'em_andamento' | 'concluido';

export type NextAction = {
  id: string;
  title: string;
  status: ActionStatus;
  dueDate: string;
};

export const nextActions: NextAction[] = [
  { id: '1', title: 'Revisar copy da página de vendas', status: 'em_andamento', dueDate: '29 mai.' },
  { id: '2', title: 'Publicar anúncio — Versão 2', status: 'pendente', dueDate: '30 mai.' },
  { id: '3', title: 'Configurar sequência de e-mail', status: 'pendente', dueDate: '31 mai.' },
  { id: '4', title: 'Enviar e-mail de sequência', status: 'concluido', dueDate: '28 mai.' },
];

export type ActivityEvent = {
  id: string;
  description: string;
  timestamp: string;
  iconName: string;
};

export const recentActivity: ActivityEvent[] = [
  { id: '1', description: 'Nova inscrição no webinário gratuito', timestamp: 'há 2 horas', iconName: 'UserPlus' },
  { id: '2', description: 'Relatório de tráfego atualizado (R$ 45,12)', timestamp: 'há 5 horas', iconName: 'TrendingUp' },
  { id: '3', description: 'Página de vendas editada com sucesso', timestamp: 'há 1 dia', iconName: 'FileEdit' },
  { id: '4', description: 'Nova oportunidade identificada', timestamp: 'há 1 dia', iconName: 'Lightbulb' },
  { id: '5', description: 'Novo depoimento adicionado ao Proof Vault', timestamp: 'há 2 dias', iconName: 'Star' },
];

export const aiCredits = {
  available: 432,
  total: 1000,
};

export type QuickAction = {
  id: string;
  label: string;
  iconName: string;
};

export const quickActions: QuickAction[] = [
  { id: '1', label: 'Criar copy com IA', iconName: 'Pen' },
  { id: '2', label: 'Gerar criativo', iconName: 'Image' },
  { id: '3', label: 'Diagnóstico de tráfego', iconName: 'BarChart2' },
  { id: '4', label: 'Plano de lançamento', iconName: 'Rocket' },
];

export const launchProgress = {
  name: 'Lançamento Maio 2026',
  percent: 68,
  phases: ['Pré-lançamento', 'Lançamento', 'Pós-lançamento'],
};

export const performanceData = {
  period: '30 dias',
  points: [40, 55, 48, 62, 70, 65, 80, 75, 88, 92, 85, 95, 100, 108],
};
