'use client';

import * as React from 'react';
import { Dialog } from 'radix-ui';
import { Menu, X } from 'lucide-react';
import { navigation } from '@/config/navigation';
import { siteConfig, whatsappUrl } from '@/config/site';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir menu"
          className="border-border text-foreground flex h-11 w-11 items-center justify-center rounded-full border md:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in bg-background/90 fixed inset-0 z-[100] backdrop-blur-sm" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right bg-card fixed inset-y-0 right-0 z-[101] flex w-[82%] max-w-sm flex-col gap-8 p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-heading text-lg">{siteConfig.name}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Fechar menu"
                className="border-border flex h-11 w-11 items-center justify-center rounded-full border"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Menu de navegação do site</Dialog.Description>
          <nav className="flex flex-col gap-1" aria-label="Navegação principal">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-border text-foreground border-b py-3.5 text-base font-medium last:border-b-0"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Button asChild className="mt-auto">
            <a
              href={whatsappUrl('Olá! Quero treinar na Academia Flex.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quero treinar agora
            </a>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
