import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant-rights')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant-rights"!</div>
}
