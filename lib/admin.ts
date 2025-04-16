export const isAdmin = (userId: string | null | undefined) => {
  if (!userId) return false;
  return userId === process.env.NEXT_PUBLIC_ADMIN_USER_ID;
}; 