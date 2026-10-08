import { getModalidades } from '@/lib/content/modalidades';
import { getFuncionamento } from '@/lib/content/funcionamento';
import { gerarJsonLdNegocio } from '@/lib/structured-data';
import { FaixaFoto } from '@/components/shared/faixa-foto';
import { Marquee } from '@/components/shared/marquee';
import { Hero } from './_components/hero';
import { Planos } from './_components/planos';
import { Modalidades } from './_components/modalidades';
import { Horarios } from './_components/horarios';
import { Professores } from './_components/professores';
import { Sobre } from './_components/sobre';
import { Contato } from './_components/contato';

// A home é estática, então `new Date()` (campanha com `terminaEm`, Planos)
// rodaria só no build: campanha vencida ficaria no ar até o próximo deploy.
// Regerar de hora em hora tira a campanha do ar no máximo 1h após o fim.
export const revalidate = 3600;

export default function Home() {
  const modalidades = getModalidades();
  const funcionamento = getFuncionamento();
  const jsonLd = gerarJsonLdNegocio(funcionamento);

  return (
    <main>
      {/* JSON-LD (schema.org SportsActivityLocation) — SEO local, disponível
       * no HTML inicial sem depender de JS/interação (crawlers leem isto
       * direto). `JSON.stringify` + escapar "<" evita que um valor de
       * conteúdo feche a tag <script> prematuramente — defensivo mesmo com
       * dado hoje 100% estático/confiável (content/*.json versionado). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Hero />
      <Marquee items={modalidades.map((m) => m.nome)} tone="dark" />
      <Planos />
      <Modalidades />
      <FaixaFoto funcionamento={funcionamento} />
      <Horarios />
      <Professores />
      <Sobre />
      <Contato />
    </main>
  );
}
