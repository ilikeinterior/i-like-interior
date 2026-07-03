"use client";

import { useEffect } from "react";

export default function PortfolioFilter() {
  useEffect(() => {
    const filterBtns = document.querySelectorAll<HTMLElement>(".filter-btn");
    const cards = document.querySelectorAll<HTMLElement>(".work-card");

    const handlers: Array<() => void> = [];

    filterBtns.forEach((btn) => {
      const handler = () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        cards.forEach((card) => {
          if (filter === "all" || card.dataset.cat === filter) {
            card.classList.remove("hide");
          } else {
            card.classList.add("hide");
          }
        });
      };

      btn.addEventListener("click", handler);
      handlers.push(() => btn.removeEventListener("click", handler));
    });

    return () => {
      handlers.forEach((remove) => remove());
    };
  }, []);

  return null;
}
