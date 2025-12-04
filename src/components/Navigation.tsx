import React from 'react';
import { Car, Wifi, Settings, Activity } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'drive', label: 'Drive', icon: Car },
    { id: 'network', label: 'Network', icon: Wifi },
    { id: 'status', label: 'Status', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-card border-t border-border">
      <div className="grid grid-cols-4 px-2 py-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={currentPage === id ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(id)}
            className="flex flex-col items-center gap-1 h-auto py-2 px-1"
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}