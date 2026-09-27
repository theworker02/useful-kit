import Link from "next/link";
import { StudioNav } from "./studio-nav";
import type { DocSection } from "@/lib/docs/content";

export function DocView({
  title,
  subtitle,
  sections,
  active,
  backHref = "/docs",
}: {
  title: string;
  subtitle: string;
  sections: DocSection[];
  active?: string;
  backHref?: string;
}) {
  return (
    <div className="product-surface min-h-screen">
      <StudioNav active={active} tone="product" />
      <article className="doc-prose mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <Link
          href={backHref}
          className="text-sm text-teal-900 underline-offset-4 hover:underline"
        >
          ← Diligence library
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[#0b1f2a] md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-lg text-slate-600">{subtitle}</p>
        {sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
            {section.table ? (
              <table>
                <thead>
                  <tr>
                    {section.table.headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row) => (
                    <tr key={row.join("|")}>
                      {row.map((cell) => (
                        <td key={cell}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </section>
        ))}
      </article>
    </div>
  );
}
