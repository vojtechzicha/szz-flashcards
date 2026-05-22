'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { signIn } from 'next-auth/react'

import { signInWithPassword, type SignInState } from '@/lib/auth/sign-in-action'

type Labels = {
  email: string
  password: string
  signIn: string
  google: string
  invalidCredentials: string
}

export function SignInForm({
  labels,
  callbackUrl,
  googleOnly = false,
}: {
  labels: Labels
  callbackUrl: string
  googleOnly?: boolean
}) {
  const [state, formAction] = useActionState<SignInState, FormData>(
    signInWithPassword,
    {},
  )

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl })}
        className="w-full inline-flex items-center justify-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg-base)] hover:bg-[color:var(--color-bg-hover)] px-4 py-2.5 font-medium"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.36 0-4.36-1.6-5.07-3.74H.94v2.34A8.99 8.99 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.93 10.68A5.4 5.4 0 0 1 3.64 9c0-.58.1-1.15.29-1.68V4.98H.94A8.99 8.99 0 0 0 0 9c0 1.45.35 2.83.94 4.02l2.99-2.34z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 8.99 8.99 0 0 0 .94 4.98l2.99 2.34C4.64 5.18 6.64 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
        {labels.google}
      </button>
      {googleOnly ? null : (
        <>
      <div className="flex items-center gap-3 text-xs text-[color:var(--color-text-faint)]">
        <span className="flex-1 h-px bg-[color:var(--color-border)]" />
        <span>or</span>
        <span className="flex-1 h-px bg-[color:var(--color-border)]" />
      </div>
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <label className="block text-sm">
          <span className="text-[color:var(--color-text-dim)]">{labels.email}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 w-full rounded-md bg-[color:var(--color-bg-base)] border border-[color:var(--color-border)] px-3 py-2 outline-none focus:border-[color:var(--color-accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[color:var(--color-text-dim)]">{labels.password}</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-md bg-[color:var(--color-bg-base)] border border-[color:var(--color-border)] px-3 py-2 outline-none focus:border-[color:var(--color-accent)]"
          />
        </label>
        {state?.error === 'invalid' ? (
          <p role="alert" className="text-sm text-[color:var(--color-bad)]">
            {labels.invalidCredentials}
          </p>
        ) : null}
        <SubmitButton label={labels.signIn} />
      </form>
        </>
      )}
    </div>
  )
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[color:var(--color-accent)] text-black font-medium px-4 py-2.5 disabled:opacity-60"
    >
      {label}
    </button>
  )
}
