import fs from 'fs';
import path from 'path';

export type Post = {
  slug: string;
  title: string;
  date: string;
  price: string;
  summary: string;
  image: string;
  body: string;
};

const dir = path.join(process.cwd(), 'content', 'posts');

function parse(slug: string, raw: string): Post {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  let body = text;
  if (m) {
    body = m[2];
    m[1].split('\n').forEach((line) => {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
  }
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || '',
    price: meta.price || '',
    summary: meta.summary || '',
    image: meta.image || '',
    body: body.trim(),
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parse(f.replace(/\.md$/, ''), fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
