package com.example.hrm.repository;

import com.example.hrm.entity.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryStructureRepository extends JpaRepository<SalaryStructure, Long> {
    Optional<SalaryStructure> findByName(String name);
    Boolean existsByName(String name);
    List<SalaryStructure> findByActiveTrue();
}
