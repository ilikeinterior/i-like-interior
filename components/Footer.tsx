import { site } from '@/lib/site-data';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <b>{site.brand}</b><br />
        {site.description}
      </div>
    </footer>
  );
}