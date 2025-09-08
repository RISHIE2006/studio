'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { LayoutGrid, User, Pill, UserPlus, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/first-aid', label: 'AI First-Aid', icon: Bot },
    { href: '/medicine', label: 'Medicine Locator', icon: Pill },
    { href: '/dashboard', label: 'NHAI Dashboard', icon: LayoutGrid },
    { href: '/login', label: 'Login', icon: User },
    { href: '/signup', label: 'Sign Up', icon: UserPlus },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container flex h-16 items-center"
      >
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            HighwayHealers
          </span>
        </Link>
        <nav className="flex flex-1 items-center justify-end space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-foreground/60'
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
