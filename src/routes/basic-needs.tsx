import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/basic-needs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/basic-needs"!</div>
}
