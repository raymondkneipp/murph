import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/login"!</div>
}
