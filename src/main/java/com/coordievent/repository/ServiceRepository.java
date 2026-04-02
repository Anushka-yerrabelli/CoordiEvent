package com.coordievent.repository;

import com.coordievent.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long>, JpaSpecificationExecutor<Service> {
    List<Service> findByProviderId(Long providerId);
    List<Service> findByCategoryId(Long categoryId);
}
