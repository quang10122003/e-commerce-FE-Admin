"use client";

import { useRef } from "react";
import Form from "next/form";
import type { RoleState } from "@/types/roles";
import type { AdminUsersFilters } from "@/types/users";
import { UserRoleOptions } from "./UserRoleOptions";

type UsersFiltersProps = {
  filters: AdminUsersFilters;
  roleState: RoleState;
};

export function UsersFilters({
  filters,
  roleState,
}: UsersFiltersProps) {
  const submitTimeoutRef = useRef<number | null>(null);

  function submitFilter(form: HTMLFormElement, delay: number) {
    if (submitTimeoutRef.current) {
      window.clearTimeout(submitTimeoutRef.current);
    }

    submitTimeoutRef.current = window.setTimeout(() => {
      form.requestSubmit();
    }, delay);
  }

  return (
    <Form
      action="/admin/users"
      className="flex flex-wrap items-center gap-3"
      onChange={(event) => {
        const delay = event.target instanceof HTMLInputElement ? 350 : 0;
        submitFilter(event.currentTarget, delay);
      }}
      replace
      scroll={false}
    >
      <input
        className="field-input field-inline field-input-compact flex-1"
        defaultValue={filters.search}
        name="search"
        placeholder="Tim theo ten hoac email"
        type="text"
      />

      <select
        className="field-select h-10"
        defaultValue={filters.roleFilter}
        name="role"
      >
        <UserRoleOptions includeAllOption roleState={roleState} />
      </select>

      <select
        className="field-select h-10"
        defaultValue={filters.statusFilter}
        name="status"
      >
        <option value="ALL">All status</option>
        <option value="LOCKED">Locked</option>
        <option value="ACTIVE">Active</option>
      </select>
    </Form>
  );
}
