package com.hotel.booking.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class RoleAttributeConverter implements AttributeConverter<Role, Integer> {

    @Override
    public Integer convertToDatabaseColumn(Role role) {
        return role == null ? null : role.getId();
    }

    @Override
    public Role convertToEntityAttribute(Integer roleId) {
        return roleId == null ? null : Role.fromId(roleId);
    }
}