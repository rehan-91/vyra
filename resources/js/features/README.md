# Feature Modules

Place Creator OS UI capabilities in `resources/js/features/<feature>/` when
they grow beyond a single page or reusable primitive. A feature may contain its
own components, hooks, types, and presentation helpers.

Keep shared primitives in `components`, cross-cutting hooks in `hooks`, route
pages in `pages`, and application shells in `layouts`. Preserve authentication
behavior when evolving its presentation.
