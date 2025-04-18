package com.ininfo.fdms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement // 트랜잭션 관리 활성화
public class FdmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(FdmsApplication.class, args);
	}

}
