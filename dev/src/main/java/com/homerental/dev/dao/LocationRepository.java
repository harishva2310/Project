package com.homerental.dev.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homerental.dev.entity.Location;
public interface LocationRepository extends JpaRepository<Location, Long>{

}
