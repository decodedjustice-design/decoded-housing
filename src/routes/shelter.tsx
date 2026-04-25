import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shelter')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/shelter"!</div>
}
