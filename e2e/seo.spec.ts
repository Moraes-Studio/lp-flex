import { expect, test } from '@playwright/test';

/**
 * SEO técnico da homepage final. Lê atributos direto do <head> renderizado
 * (o que um crawler vê), nunca assume ordem das tags — só presença e
 * conteúdo dos atributos certos. `NEXT_PUBLIC_SITE_URL` localmente é
 * `http://localhost:3000` (.env.local, de propósito diferente de produção —
 * ver política de env do RULES.md); por isso os testes de URL absoluta
 * comparam contra o próprio valor resolvido (metadataBase), nunca contra um
 * domínio de produção hardcoded.
 */
test.describe('SEO — metadata da homepage', () => {
  test('title e meta description corretos', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Academia Flex | Musculação e Aulas em Santo André');
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      'Academia em Vila Helena, Santo André, desde 1992. Musculação com professor em sala e aulas de Pilates, Yoga, Zumba, Jump, Fit Dance e mais.'
    );
  });

  test('canonical existe, é absoluto e aponta pra própria origem (sem duplicidade)', async ({ page, baseURL }) => {
    await page.goto('/');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const href = await canonical.getAttribute('href');
    // O Next normaliza a barra final pra fora ao renderizar a tag (mesma URL
    // pra qualquer crawler) — o que importa pra "sem duplicidade" é existir
    // só ESTE valor, consistente com og:url abaixo.
    expect(href).toBe(baseURL);
  });

  test('robots permite indexação (sem noindex acidental)', async ({ page }) => {
    await page.goto('/');
    const robotsMeta = page.locator('meta[name="robots"]');
    const content = (await robotsMeta.getAttribute('content')) ?? '';
    expect(content).not.toContain('noindex');
    expect(content).toContain('follow');
  });

  test('Open Graph completo pro compartilhamento (WhatsApp/Facebook)', async ({ page, baseURL }) => {
    await page.goto('/');
    const og = async (property: string) => page.locator(`meta[property="${property}"]`).getAttribute('content');

    expect(await og('og:type')).toBe('website');
    expect(await og('og:locale')).toBe('pt_BR');
    expect(await og('og:site_name')).toBe('Academia Flex');
    expect(await og('og:title')).toBe('Academia Flex | Musculação e Aulas em Santo André');
    expect(await og('og:description')).toContain('Vila Helena, Santo André');
    expect(await og('og:url')).toBe(baseURL);
    // og:url e canonical sempre iguais — uma única URL de verdade pra página.
    expect(await og('og:url')).toBe(await page.locator('link[rel="canonical"]').getAttribute('href'));

    const image = await og('og:image');
    expect(image).toBeTruthy();
    expect(image).toMatch(/^https?:\/\//); // og:image sempre absoluto
    expect(await og('og:image:width')).toBe('1200');
    expect(await og('og:image:height')).toBe('630');
    expect(await og('og:image:alt')).toBe('Academia Flex — Vila Helena, Santo André');
  });

  test('Twitter/X card configurado, reaproveitando a OG image', async ({ page }) => {
    await page.goto('/');
    const twitter = async (name: string) => page.locator(`meta[name="${name}"]`).getAttribute('content');

    expect(await twitter('twitter:card')).toBe('summary_large_image');
    expect(await twitter('twitter:title')).toBe('Academia Flex | Musculação e Aulas em Santo André');
    expect(await twitter('twitter:description')).toContain('Vila Helena, Santo André');
    const twitterImage = await twitter('twitter:image');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(twitterImage).toBe(ogImage);
  });

  test('JSON-LD válido no HTML, sem depender de interação', async ({ page }) => {
    await page.goto('/');
    const script = page.locator('script[type="application/ld+json"]');
    await expect(script).toHaveCount(1);
    const raw = await script.textContent();
    expect(raw).toBeTruthy();
    const jsonLd = JSON.parse(raw!);

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('SportsActivityLocation');
    expect(jsonLd.name).toBe('Academia Flex');
    expect(jsonLd.address.addressLocality).toBe('Santo André');
    expect(jsonLd.address.addressRegion).toBe('SP');
    expect(Array.isArray(jsonLd.openingHoursSpecification)).toBe(true);
    expect(jsonLd.openingHoursSpecification.length).toBeGreaterThan(0);
    // Nada inventado: sem telefone, avaliação ou geolocalização.
    expect(jsonLd).not.toHaveProperty('telephone');
    expect(jsonLd).not.toHaveProperty('aggregateRating');
    expect(jsonLd).not.toHaveProperty('geo');
  });

  test('og:image responde 200, com content-type de imagem, sem exigir autenticação', async ({ page, request }) => {
    await page.goto('/');
    const imageUrl = await page.locator('meta[property="og:image"]').getAttribute('content');
    const response = await request.get(imageUrl!);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/');
  });
});

test.describe('SEO — rotas técnicas', () => {
  test('/robots.txt existe, permite a homepage e aponta pro sitemap', async ({ request, baseURL }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/Allow:\s*\//);
    expect(body).toContain(`${baseURL}/sitemap.xml`);
  });

  test('/sitemap.xml existe e só lista URLs reais (sem anchors, sem páginas inexistentes)', async ({
    request,
    baseURL,
  }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain(`<loc>${baseURL}</loc>`);
    // Página real que existe de verdade (não é uma âncora da home).
    expect(body).toContain('/privacidade</loc>');
    // Nunca uma URL de âncora nem uma rota que não existe como página própria.
    expect(body).not.toContain('#');
    expect(body).not.toContain('/planos<');
    expect(body).not.toContain('/modalidades<');
    expect(body).not.toContain('/professores<');
  });
});
