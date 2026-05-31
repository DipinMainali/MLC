export default async function Page() {
  const notes = [
    {
      title: "Quick capture",
      description:
        "Drop ideas, reminders, and draft copy here when inspiration strikes.",
    },
    {
      title: "Content planning",
      description:
        "Use this space for brand notes, project thoughts, and follow-up items.",
    },
    {
      title: "Ready for the future",
      description:
        "This page now works without any backend-specific wiring and can be connected to your data source later.",
    },
  ];

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Notes
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          A simple space for ideas, reminders, and drafts.
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          This page now stands on its own, so the app no longer depends on a
          demo backend wiring.
        </p>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <article
            key={note.title}
            className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm"
          >
            <h2 className="text-base font-semibold">{note.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {note.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
