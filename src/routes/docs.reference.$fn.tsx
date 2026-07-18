import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocPageHeader } from "@/components/DocPageHeader";
import { FunctionDocPage } from "@/components/FunctionDocPage";
import { allDocs } from "@/content/reference";

export const Route = createFileRoute("/docs/reference/$fn")({
  head: ({ params }) => {
    const doc = allDocs.find((d) => d.slug === params.fn);
    const title = doc ? `edf.${doc.name}() — EazyDataFix API Reference` : "Reference — EazyDataFix";
    const desc = doc?.oneLiner ?? "EazyDataFix API reference.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const doc = allDocs.find((d) => d.slug === params.fn);
    if (!doc) throw notFound();
    return { doc };
  },
  component: RefPage,
});

function RefPage() {
  const { doc } = Route.useLoaderData();
  return (
    <div>
      <DocPageHeader
        breadcrumbs={[
          { label: "Docs", to: "/docs" },
          { label: "Reference", to: "/docs/reference" },
          { label: `${doc.name}()` },
        ]}
        title={`edf.${doc.name}()`}
        description={doc.oneLiner}
      />
      <FunctionDocPage doc={doc} />
    </div>
  );
}
