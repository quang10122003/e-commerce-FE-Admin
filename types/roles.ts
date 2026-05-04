export interface Role {
  id: number;
  name: string;
}

export interface RoleState {
  data: Role[] | null;
  isLoading: boolean;
  error: string | null;
}
