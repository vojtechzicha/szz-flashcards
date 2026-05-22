import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req }) => {
  const role = (req.user as { role?: string } | null | undefined)?.role
  return role === 'admin'
}

export const isAdminFieldLevel: FieldAccess = ({ req }) => {
  const role = (req.user as { role?: string } | null | undefined)?.role
  return role === 'admin'
}

export const isSignedIn: Access = ({ req }) => Boolean(req.user)

export const isAdminOrSelf: Access = ({ req, id }) => {
  const user = req.user as { id?: string | number; role?: string } | null | undefined
  if (!user) return false
  if (user.role === 'admin') return true
  if (id != null && user.id != null && String(user.id) === String(id)) return true
  return false
}

export const adminOrOwnerWhere: Access = ({ req }) => {
  const user = req.user as { id?: string | number; role?: string } | null | undefined
  if (!user) return false
  if (user.role === 'admin') return true
  return { user: { equals: user.id } }
}
