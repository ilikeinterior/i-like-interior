"use client";


import Link from "next/link";
import { navItems, site } from "@/lib/site-data";

export default function Header() {


  return (
    <header className="header">
      <div className="header-top">
        <Link className="logo" href="/">
          별내목수 <span>· 아이라이크 인테리어</span>
        </Link>

      
      </div>

      <nav className="nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <a className="cta" href={site.blog} target="_blank" rel="noreferrer">
  <span className="desktop-only">블로그 전체보기</span>
  <span className="mobile-only">블로그</span>
</a>
      </nav>

    </header>
  );
}
