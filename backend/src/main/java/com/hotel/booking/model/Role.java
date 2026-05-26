package com.hotel.booking.model;

public enum Role {

	CUSTOMER(1, "customer", "ROLE_CUSTOMER"),
	MANAGER(2, "manager", "ROLE_MANAGER"),
	STAFF(3, "staff", "ROLE_STAFF");

	private final int id;
	private final String apiRole;
	private final String authorityRole;

	Role(int id, String apiRole, String authorityRole) {
		this.id = id;
		this.apiRole = apiRole;
		this.authorityRole = authorityRole;
	}

	public int getId() {
		return id;
	}

	public String toApiRole() {
		return apiRole;
	}

	public String toAuthorityRole() {
		return authorityRole;
	}

	public static Role fromId(Integer roleId) {
		if (roleId == null) {
			throw new IllegalStateException("User role id must not be null");
		}

		for (Role role : values()) {
			if (role.id == roleId) {
				return role;
			}
		}

		throw new IllegalStateException("Unsupported user roleId: " + roleId);
    }

	public static Role fromName(String roleName) {
		if (roleName == null || roleName.isBlank()) {
			throw new IllegalArgumentException("Role is required");
		}

		String normalized = roleName.trim().toLowerCase();
		return switch (normalized) {
			case "customer", "user" -> CUSTOMER;
			case "manager", "admin" -> MANAGER;
			case "staff" -> STAFF;
			default -> throw new IllegalArgumentException("Unsupported role: " + roleName);
		};
	}
}
