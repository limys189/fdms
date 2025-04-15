package com.ininfo.fdms.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ResponseDto {

    // Getter와 Setter
    private String status;  // 응답 상태 (예: "SUCCESS", "ERROR")
    private String message; // 응답 메시지
    private List<Object> data;    // 응답 데이터 (List<Object>)

    // 기본 생성자
    public ResponseDto() {
    }

    // 모든 필드를 포함한 생성자
    public ResponseDto(String status, String message, List<Object> data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // 성공 응답을 위한 정적 메서드
    public static ResponseDto success(String message, List<Object> data) {
        return new ResponseDto("SUCCESS", message, data);
    }

    // 실패 응답을 위한 정적 메서드
    public static ResponseDto error(String message) {
        return new ResponseDto("ERROR", message, null);
    }

    @Override
    public String toString() {
        return "ResponseDto{" +
                "status='" + status + '\'' +
                ", message='" + message + '\'' +
                ", data='" + data + '\'' +
                '}';
    }
}
