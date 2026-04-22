package com.hotel.booking.model;

public enum Role {

	USER(1, "USER", "ROLE_USER"),
	ADMIN(2, "ADMIN", "ROLE_ADMIN"),
	STAFF(3, "STAFF", "ROLE_STAFF");

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
}	
  