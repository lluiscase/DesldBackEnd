export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  createdAt?: string;
}

export function userAdapter(user: any): UserProfileResponse {
  if (!user) return {} as UserProfileResponse;

  return {
    id: String(user.id),
    name: user.name || "",
    email: user.email || "",
    avatarUrl: user.avatar_url || undefined,
    phone: user.phone_number || undefined,
    createdAt: user.created_at ? new Date(user.created_at).toISOString() : undefined
  };
}
