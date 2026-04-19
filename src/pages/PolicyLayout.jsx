import SiteShell from '../components/SiteShell'

function PolicyLayout({ title, children }) {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="rounded-2xl border border-[#e9dddd] bg-white p-6 shadow-sm sm:p-8">
          <h1 className="title-font text-3xl font-bold text-[var(--maroon)] sm:text-4xl">
            {title}
          </h1>
          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-700 sm:text-base">
            {children}
          </div>
        </article>
      </section>
    </SiteShell>
  )
}

export default PolicyLayout
