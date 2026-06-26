import Link from 'next/link'
import { login } from './actions'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Site
      </Link>

      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter">Admin Portal</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to access the dashboard.
        </p>
      </div>

      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={login}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-border mb-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          name="email"
          placeholder="admin@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-border mb-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 text-foreground font-medium mb-2 transition-all">
          Sign In
        </button>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-destructive/10 text-destructive text-center text-sm rounded-md border border-destructive/20">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
