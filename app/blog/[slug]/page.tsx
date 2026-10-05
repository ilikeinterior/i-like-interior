import { notFound } from 'next/navigation';
import { getAllPosts, getPost } from '@/lib/posts';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      images: post.image ? [post.image] : [],
    },
  };
}

function renderBody(body: string) {
  return body.split(/\n{2,}/).map((block, i) => {
    const b = block.trim();
    if (b.startsWith('## ')) return <h2 key={i} style={{ fontSize: 24, margin: '48px 0 16px' }}>{b.slice(3)}</h2>;
    if (/^\*\*[^*]+\*\*$/.test(b)) return <h3 key={i} style={{ fontSize: 19, margin: '32px 0 8px' }}>{b.slice(2, -2)}</h3>;
    const img = b.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (img) return <img key={i} src={img[2]} alt={img[1]} style={{ width: '100%', borderRadius: 8, margin: '24px 0' }} />;
    if (b.startsWith('> ')) return <blockquote key={i} style={{ borderLeft: '3px solid #b08a5b', paddingLeft: 16, margin: '24px 0', fontWeight: 600 }}>{b.replace(/^> ?/gm, '')}</blockquote>;
    if (b.split('\n').every((l) => l.startsWith('- '))) {
      return (
        <ul key={i} style={{ lineHeight: 1.9, margin: '16px 0', paddingLeft: 20 }}>
          {b.split('\n').map((l, j) => {
            const t = l.slice(2);
            return <li key={j}>{/^https?:\/\//.test(t.split(': ').slice(1).join(': ')) ? <>{t.split(': ')[0]}: <a href={t.split(': ').slice(1).join(': ')} target="_blank" rel="noreferrer">{t.split(': ').slice(1).join(': ')}</a></> : t}</li>;
          })}
        </ul>
      );
    }
    return (
      <p key={i} style={{ lineHeight: 1.9, margin: '16px 0', whiteSpace: 'pre-line' }}>{b}</p>
    );
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    description: post.summary,
    image: post.image ? [`https://www.ilikeinterior.com${post.image}`] : undefined,
    author: { '@type': 'Organization', name: '별내목수 아이라이크 인테리어' },
  };
  return (
    <main className="page-main">
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <p style={{ opacity: 0.6, fontSize: 14 }}>{post.date}{post.price ? ` · ${post.price}` : ''}</p>
          <h1 style={{ fontSize: 32, lineHeight: 1.4, margin: '8px 0 24px' }}>{post.title}</h1>
          {renderBody(post.body)}
          <div className="btn-row" style={{ marginTop: 48 }}>
            <a className="btn primary" href="/blog">시공일지 목록</a>
          </div>
        </div>
      </section>
    </main>
  );
}
