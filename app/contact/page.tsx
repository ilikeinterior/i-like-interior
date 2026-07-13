import { site } from '@/lib/site-data';

export const metadata = { title: '문의하기' };

export default function ContactPage() {
  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <div className="contact-cta">
            <h3>견적이 아니라 현장 상황부터 들어보겠습니다.</h3>
            <p>
              현장 사진이나 평면도를 보내주시면 더 정확하게<br />
              안내드릴 수 있습니다.
            </p>
            <div style={{ margin: '24px 0', textAlign: 'left', display: 'inline-block' }}>
              <div><b>대표</b> 고승휘</div>
              <div><b>연락처</b> {site.phone}</div>
              <div><b>블로그</b> blog.naver.com/gris2</div>
              <div><b>활동지역</b> {site.area} · 상황에 따라 지방 출장 가능</div>
            </div>
            <div className="contact-btns">
              <a className="btn btn-primary" href={site.phoneHref}>
                {site.phone} 전화하기
              </a>
              <a
                className="btn"
                href={site.kakao}
                rel="noopener"
                style={{ background: '#FEE500', color: '#3A1D1D' }}
                target="_blank"
              >
                카톡 상담하기
              </a>
              <a
                className="btn btn-blog"
                href={site.blog}
                rel="noopener"
                target="_blank"
              >
                블로그에서 더 많은 사례 보기
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}