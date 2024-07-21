package com.homerental.dev.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homerental.dev.entity.Payment;

public interface  PaymentRepository extends JpaRepository<Payment, Long>{
    Payment findByUserEmail(String userEmail);
}
