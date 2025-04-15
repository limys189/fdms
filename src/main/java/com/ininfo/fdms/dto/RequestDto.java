package com.ininfo.fdms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Setter
@Getter
public class RequestDto {

    // Getters and Setters
    @NotBlank(message = "쿼리 ID는 필수입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "쿼리 ID는 영문자, 숫자, 언더스코어만 허용됩니다.")
    private String sqlId;

//    @NotBlank(message = "데이터는 필수입니다.")
//    private String data;

    private Map<String, Object> params;

    private Map<String, Object> userInfo;

    private List<Map<String, Object>> paramsList;

    @Override
    public String toString() {
        return "RequestDto{" +
                "sqlId='" + sqlId + '\'' +
//                ", data='" + data + '\'' +
                ", params='" + params + '\'' +
                ", userInfo='" + userInfo + '\'' +
                ", paramsList='" + paramsList + '\'' +
                '}';
    }
}
