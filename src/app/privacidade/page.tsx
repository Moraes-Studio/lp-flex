import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  // string simples aqui vira "Política de Privacidade — Academia Flex" via
  // o template do layout raiz — não repetir o nome do site aqui.
  title: 'Política de Privacidade',
  description: `Política de privacidade da ${siteConfig.name}, ${siteConfig.address.city} — ${siteConfig.address.state}.`,
  alternates: { canonical: '/privacidade' },
};

export default function PrivacidadePage() {
  const endereco = `${siteConfig.address.street}, ${siteConfig.address.city} — ${siteConfig.address.state}, ${siteConfig.address.zip}`;
  const controlador = `${siteConfig.razaoSocial ?? siteConfig.name}, inscrita no CNPJ ${siteConfig.cnpj}, com endereço em ${endereco}`;
  const hoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="px-[6%] py-14 md:py-20">
      <div className="mx-auto max-w-[720px]">
        <p className="text-flex-blue-600 mb-2 font-mono text-[11px] tracking-[0.14em] uppercase">
          Atualizada em {hoje}
        </p>
        <h1 className="text-[clamp(30px,5vw,44px)] leading-[1.05]">Política de Privacidade</h1>

        <div className="text-muted-foreground mt-10 space-y-8 text-[15.5px] normal-case [&_h2]:font-heading [&_h2]:text-flex-blue-700 [&_h2]:mt-0 [&_h2]:mb-2 [&_h2]:text-[19px] [&_h2]:normal-case [&_h2]:tracking-normal [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          <p>
            Esta política explica como a {siteConfig.name} trata os dados pessoais de quem entra
            em contato pelo site, pelo WhatsApp ou presencialmente, conforme a Lei Geral de
            Proteção de Dados (Lei 13.709/2018).
          </p>

          <section>
            <h2>Quem é o controlador</h2>
            <p>{controlador}.</p>
          </section>

          <section>
            <h2>Que dados coletamos</h2>
            <ul>
              <li>
                <strong className="text-foreground">Dados que você nos envia:</strong> nome,
                telefone, e-mail e o conteúdo das mensagens enviadas pelo WhatsApp ou por outro
                canal de contato.
              </li>
              <li>
                <strong className="text-foreground">Dados de matrícula:</strong> ao se matricular,
                coletamos os dados necessários ao contrato e à sua segurança durante o treino.
              </li>
              <li>
                <strong className="text-foreground">Dados de navegação:</strong> o site usa fontes
                e mapa hospedados pelo Google, que podem registrar seu endereço IP ao carregar
                esses recursos.
              </li>
            </ul>
          </section>

          <section>
            <h2>Por que usamos esses dados</h2>
            <ul>
              <li>Responder ao seu contato e informar sobre planos, horários e modalidades.</li>
              <li>Executar o contrato de prestação de serviço, quando há matrícula.</li>
              <li>Cumprir obrigações legais, fiscais e regulatórias.</li>
            </ul>
            <p className="mt-3">
              Não vendemos dados pessoais nem os compartilhamos com terceiros para publicidade.
            </p>
          </section>

          <section>
            <h2>Com quem compartilhamos</h2>
            <p>
              Compartilhamos dados apenas com prestadores necessários à operação — hospedagem do
              site, WhatsApp (Meta Platforms) e sistema de gestão de alunos — e com autoridades
              públicas quando houver exigência legal.
            </p>
          </section>

          <section>
            <h2>Por quanto tempo guardamos</h2>
            <p>
              Mensagens de contato são mantidas enquanto durar o atendimento. Dados de alunos são
              mantidos durante a vigência do contrato e pelos prazos legais aplicáveis após o
              encerramento.
            </p>
          </section>

          <section>
            <h2>Seus direitos</h2>
            <p>
              Você pode solicitar a confirmação de tratamento, o acesso, a correção, a
              anonimização, a portabilidade ou a exclusão dos seus dados, além de revogar
              consentimento. Para isso, use o contato abaixo.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              Este site não usa cookies próprios de rastreamento ou publicidade. Recursos
              incorporados do Google (fontes e mapa) podem definir cookies próprios ao serem
              carregados.
            </p>
          </section>

          <section>
            <h2>Contato</h2>
            <p>
              Fale com a gente na recepção da academia ou pelo{' '}
              <a href="#contato" className="text-flex-blue-600 hover:underline">
                WhatsApp
              </a>
              .
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="text-flex-blue-600 mt-12 inline-block text-sm font-medium hover:underline"
        >
          ← Voltar ao site
        </Link>
      </div>
    </main>
  );
}
