import type { ChangeEvent } from "react";
import type { RoleState } from "@/types/roles";
import type { AdminUsersFilters } from "@/types/users";
import { UserRoleOptions } from "./UserRoleOptions";

type UsersFiltersProps = {
  filters: AdminUsersFilters;
  onRoleFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  roleState: RoleState;
  searchInput: string;
};

export function UsersFilters({
  filters,
  onRoleFilterChange,
  onSearchChange,
  onStatusFilterChange,
  roleState,
  searchInput,
}: UsersFiltersProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleRoleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onRoleFilterChange(event.target.value);
  };

  const handleStatusFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStatusFilterChange(event.target.value);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        className="field-input field-inline field-input-compact flex-1"
        onChange={handleSearchChange}
        placeholder="Tim theo ten hoac email"
        type="text"
        value={searchInput}
      />

      <select
        className="field-select h-10"
        onChange={handleRoleFilterChange}
        value={filters.roleFilter}
      >
        <UserRoleOptions includeAllOption roleState={roleState} />
      </select>

      <select
        className="field-select h-10"
        onChange={handleStatusFilterChange}
        value={filters.statusFilter}
      >
        <option value="ALL">All status</option>
        <option value="LOCKED">Locked</option>
        <option value="ACTIVE">Active</option>
      </select>
    </div>
  );
}
