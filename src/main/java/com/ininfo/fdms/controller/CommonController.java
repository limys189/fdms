package com.ininfo.fdms.controller;

import com.ininfo.fdms.dto.RequestDto;
import com.ininfo.fdms.dto.ResponseDto;
import com.ininfo.fdms.service.CommonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/common")
public class CommonController {

//    private final CommonService commonService;
//    private final EncryptionUtil encryptionUtil;
//
//    public CommonController(CommonService commonService, EncryptionUtil encryptionUtil) {
//        this.commonService = commonService;
//        this.encryptionUtil = encryptionUtil;
//    }

    private final CommonService commonService;

    public CommonController(CommonService commonService) {
        this.commonService = commonService;
    }

    @PostMapping("/execute")
    public ResponseEntity<ResponseDto> executeQuery(@RequestBody List<RequestDto> requestDtoList) {
//        // 요청 데이터 복호화
//        String decryptedData = encryptionUtil.decrypt(requestDto.getData());
//        requestDto.setData(decryptedData);

        // 서비스 호출
        ResponseDto result = commonService.executeBatch(requestDtoList);

//        // 응답 데이터 암호화
//        String encryptedData = encryptionUtil.encrypt(result.getData());
//        result.setData(encryptedData);

        return ResponseEntity.ok(result);
    }
}
