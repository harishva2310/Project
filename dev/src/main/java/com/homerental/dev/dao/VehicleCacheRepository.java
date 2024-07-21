package com.homerental.dev.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.homerental.dev.entity.VehicleCache;

@Repository
public interface VehicleCacheRepository extends CrudRepository<VehicleCache, String> {
}
