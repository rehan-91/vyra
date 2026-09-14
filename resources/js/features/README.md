# Feature Modules

Place VYRA UI capabilities in `resources/js/features/<feature>/` when
they grow beyond a single page or reusable primitive. A feature may contain its
own components, hooks, types, and presentation helpers.

Keep shared primitives in `components`, cross-cutting hooks in `hooks`, route
pages in `pages`, and application shells in `layouts`. Preserve authentication
behavior when evolving its presentation.

## Shared loading UI

Reuse `@/components/ui/loading` for loading UI: use `PageLoader` only when a
route cannot render useful content, `SectionLoader` for a bounded panel or
table, `InlineLoader` for small operations, `ButtonLoading` inside pending
buttons, and `Skeleton` when known layout should remain visible. Supply a
short contextual message from `loadingMessages`; do not introduce feature-local
spinners or loading copy.
