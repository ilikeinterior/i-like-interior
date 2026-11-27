import SectionHead from '@/components/SectionHead';
import { services } from '@/lib/site-data';
export const metadata = {
  title: '서비스 안내 · 아파트 목공·가벽·히든도어',
  description: '맞춤가구, 목공 인테리어(가벽, 우물천장, 몰딩, 아트월, 히든도어), 상업공간 목공, 수리·보수. 남양주 별내 중심 서울·경기 시공.',
  alternates: { canonical: '/service' },
};
export default function ServicePage(){return <main className="page-main"><section className="section"><div className="container"><SectionHead label="SERVICE" title="공간에 필요한 목공을 정리합니다." desc="현장 상황, 예산, 일정에 맞춰 가능한 공정과 우선순위를 안내드립니다."/><div className="grid-4">{services.map((s)=><div className="card" key={s.title}><h3>{s.title}</h3><p>{s.desc}</p></div>)}</div></div></section><section className="section" style={{background:'var(--soft)'}}><div className="container"><SectionHead label="PROCESS" title="상담부터 마감까지"/><div className="grid-4 process"><div className="card"><h3>상담</h3><p>사진, 평면도, 원하는 분위기를 확인합니다.</p></div><div className="card"><h3>현장 확인</h3><p>가능하면 현장을 보고 정확한 범위를 정합니다.</p></div><div className="card"><h3>견적·일정</h3><p>공정 순서와 예산 우선순위를 함께 정합니다.</p></div><div className="card"><h3>시공·마감</h3><p>작업 후 보완 범위까지 책임 있게 안내합니다.</p></div></div></div></section></main>}
