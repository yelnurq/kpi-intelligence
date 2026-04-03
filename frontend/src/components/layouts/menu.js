import React from 'react';
import { 
  LayoutDashboard, 
  PanelsTopLeftIcon, 
  ClipboardList, 
  CheckCircle, 
  BarChart3,
  Building2,
  Phone,
  Search,
  PanelRightCloseIcon
} from 'lucide-react';

export const sidebarMenuItems = [
  { id: 'dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Личный кабинет', type: 'route' },
  { 
  id: 'plan', 
  path: '/plan/user', 
  icon: <PanelRightCloseIcon size={20} />, 
  label: 'Мой план',
  type: 'route' 
},
  { id: 'plan', path: '/plan', icon: <PanelsTopLeftIcon size={20} />, label: 'Планирование KPI', type: 'route' },
  { id: 'archive', path: '/archive', icon: <ClipboardList size={20} />, label: 'Архив заявок', type: 'route' },
  { id: 'submit', path: '/submit', icon: <CheckCircle size={20} />, label: 'Подать активность', type: 'route' },
  { id: 'rating', path: '/rating', icon: <BarChart3 size={20} />, label: 'Рейтинг факультетов', type: 'route' },
];

export const departmentItems = [
  { 
    id: 'dep-it', 
    label: 'IT Отдел (Департамент цифровизации)', 
    room: '405 каб.', 
    type: 'department', 
    phone: '102', 
    icon: <Building2 size={18} /> 
  },
  { 
    id: 'dep-hr', 
    label: 'Отдел кадров (HR)', 
    room: '212 каб.', 
    type: 'department', 
    phone: '105', 
    icon: <Building2 size={18} /> 
  },
  { 
    id: 'dep-acc', 
    label: 'Бухгалтерия', 
    room: '105 каб.', 
    type: 'department', 
    phone: '110', 
    icon: <Building2 size={18} /> 
  },
  { 
    id: 'dep-rector', 
    label: 'Приемная ректора', 
    room: '301 каб.', 
    type: 'department', 
    phone: '100', 
    icon: <Building2 size={18} /> 
  },
];

const allSearchItems = [...sidebarMenuItems, ...departmentItems];
export default allSearchItems;