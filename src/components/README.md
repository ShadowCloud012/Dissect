# Component boundaries

`ui/` holds generic primitives, `layout/` composes the shell and placeholder pages,
and `navigation/` holds active navigation and persisted training-level controls.
Pages and layouts remain Server Components; URLs are owned by the App Router.

Task 02 adds `content/` for exhaustive semantic block rendering, `topic/` for the
responsive layout and depth/anchor client boundaries, and `references/` for source
badges and lists. Imaging and simulation components stay deferred until their
implementation tasks.

`anatomy/` holds the operative-anatomy viewer and procedure artworks; see
`anatomy/README.md` for the orientation convention and the limits of automated
validation.
