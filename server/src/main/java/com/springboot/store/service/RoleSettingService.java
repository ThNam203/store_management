package com.springboot.store.service;

import com.springboot.store.entity.RoleSetting;
import com.springboot.store.payload.RoleSettingDTO;

import java.util.List;

public interface RoleSettingService {
    RoleSettingDTO savePermission(int staffPositionId, RoleSettingDTO roleSettingDTO);
    RoleSettingDTO getRoleSetting(int staffId);
    List<RoleSettingDTO> getAllRoleSetting();
    RoleSettingDTO createRoleSetting(RoleSettingDTO roleSettingDTO);
    void deleteRoleSetting(int staffPositionId);
}
