import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/preview/$publicId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/preview/$publicId"!</div>
}
