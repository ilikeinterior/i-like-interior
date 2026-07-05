import SectionHead from '@/components/SectionHead';
import WorkCard from '@/components/WorkCard';
import { portfolioItems, images } from '@/lib/site-data';
import Image from 'next/image';
export const metadata = { title: '시공사례' };




export default function PortfolioPage(){return <main className="page-main"><section className="section"><div className="container"><SectionHead label="PORTFOLIO" title="현장에서 가져온 시공 사례들입니다." desc="주거 공간, 상업 공간, 맞춤가구, 수리·보수까지 실제 현장 중심으로 보여드립니다."/><div className="portfolio-grid">{portfolioItems.map((item)=><WorkCard key={item.title} item={item}/>)}</div></div></section><section className="section" style={{background:'var(--soft)'}}><div className="container"><SectionHead label="GALLERY" title="현장 사진 모음"/><div className="image-strip">{images.slice(0,8).map((img)=><Image key={img.src} src={img.src} alt={img.alt} width={500} height={350}/>)}</div></div></section></main>}
