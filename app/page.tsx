import fs from "fs";
import path from "path";
import PortfolioFilter from "./PortfolioFilter";

export default function Home() {
  const html = fs.readFileSync(path.join(process.cwd(), "content", "home.html"), "utf8");

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <PortfolioFilter />
    </>
  );
}
