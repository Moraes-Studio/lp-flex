import { getModalidades } from '@/lib/content/modalidades';
import { Marquee } from '@/components/shared/marquee';
import { Hero } from './_components/hero';
import { Promo } from './_components/promo';
import { Planos } from './_components/planos';
import { Modalidades } from './_components/modalidades';
import { Horarios } from './_components/horarios';
import { Professores } from './_components/professores';
import { Sobre } from './_components/sobre';
import { Contato } from './_components/contato';

export default function Home() {
  const modalidades = getModalidades();

  return (
    <main>
      <Hero />
      <Marquee items={modalidades.map((m) => m.nome)} />
      <Promo />
      <Planos />
      <Modalidades />
      <Horarios />
      <Professores />
      <Sobre />
      <Contato />
    </main>
  );
}
