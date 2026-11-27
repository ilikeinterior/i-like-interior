import Image from 'next/image';
import SectionHead from '@/components/SectionHead';
import { images } from '@/lib/site-data';

export const metadata = {
  title: '회사소개 · 25년 경력 비흡연 목수팀',
  description: '별내목수는 아버지와 아들이 함께하는 인테리어 목공팀입니다. 대표 25년 경력, 30~40대 젊은 팀, 현장에서 직접 설명하고 예산 우선순위를 함께 정합니다.',
  alternates: { canonical: '/about' },
};
export default function AboutPage(){return <main className="page-main"><section className="section"><div className="container"><SectionHead label="ABOUT US" title={<>아버지의 손기술과<br/>아들의 소통 감각이 만났습니다.</>} desc="별내목수는 현장에서 직접 설명하고 함께 결정하는 인테리어 목공팀입니다."/><div className="grid-2"><div className="card"><h3>대표 · 아들</h3><p>25년 경력. 인테리어 목공 전반, 현장 소통과 일정 관리를 맡습니다.</p></div><div className="card"><h3>아버지</h3><p>오랜 손기술로 디테일과 마감 완성도를 함께 봅니다.</p></div></div></div></section><div className="seam"/><section className="section"><div className="container"><div className="grid-2"><div><div className="label">WORK PHILOSOPHY</div><h2 style={{fontSize:'2.4rem',lineHeight:1.2,marginTop:10}}>우선순위를 정하면 예산이 선명해집니다.</h2><p style={{marginTop:18}}>별내목수는 단순히 자재를 붙이는 팀이 아니라, 고객님의 예산 안에서 무엇을 먼저 해야 하는지 설명하고 함께 결정하는 팀입니다.</p></div><Image src={images[12].src} alt={images[12].alt} width={800} height={540}/></div></div></section></main>}
