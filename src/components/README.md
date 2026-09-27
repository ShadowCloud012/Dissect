# Component boundaries

`ui/` holds generic primitives, `layout/` composes the shell and placeholder pages,
and `navigation/` holds the two small client islands. Pages and layouts remain
Server Components; URLs are owned by the App Router.

The blueprint reserves `content/`, `topic/`, `anatomy/`, `imaging/`, `operative/`,
`simulation/`, `questions/` and `references/` for later domain components. Add them
with their first implementation rather than checking in empty placeholder files.
