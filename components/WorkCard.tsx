import Image from 'next/image';
import { portfolioItems } from '@/lib/site-data';

type Work = (typeof portfolioItems)[number];

export default function WorkCard({ item }: { item: Work }) {
  return (
    <article className="work-card">
      {item.images ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          <Image src={item.images[0].src} alt={item.images[0].alt} width={360} height={480} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Image src={item.images[1].src} alt={item.images[1].alt} width={360} height={480} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <Image src={item.image.src} alt={item.image.alt} width={720} height={540} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      <div className="work-body">
        <span className="cat-tag">{item.category}</span>
        <span className="price-tag">{item.price}</span>
        <div className="body">
          <h4>{item.title}</h4>
          <p className="desc">{item.desc}</p>
          <div className="process-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}