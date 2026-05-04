import type { RoleState } from "@/types/roles";

type UserRoleOptionsProps = {
  includeAllOption?: boolean;
  roleState: RoleState;
};

export function UserRoleOptions({
  includeAllOption = false,
  roleState,
}: UserRoleOptionsProps) {
  return (
    <>
      {includeAllOption ? <option value="ALL">All roles</option> : null}

      {roleState.error ? (
        <option disabled>Load roles that bai</option>
      ) : !roleState.data ? (
        <option disabled>Dang tai roles...</option>
      ) : roleState.data.length === 0 ? (
        <option disabled>Khong co role</option>
      ) : (
        roleState.data.map((role) => (
          <option key={role.id} value={role.name}>
            {role.name}
          </option>
        ))
      )}
    </>
  );
}
