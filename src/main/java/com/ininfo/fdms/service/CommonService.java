package com.ininfo.fdms.service;

import com.ininfo.fdms.dto.RequestDto;
import com.ininfo.fdms.dto.ResponseDto;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommonService {

    @Autowired
    private SqlSession sqlSession;

    private static final Logger logger = LoggerFactory.getLogger(CommonService.class);

    // 단일 작업 처리
    public Object execute(String sqlId, Map<String, Object> params) {
        switch (sqlId.split("\\.")[1].substring(0, 6)) { // SQL 동작 유형 확인 (INSERT, SELECT, UPDATE, DELETE)
            case "insert":
                return sqlSession.insert(sqlId, params);
            case "select":
                if (sqlId.contains("List")) {
                    return sqlSession.selectList(sqlId, params);
                } else {
                    return sqlSession.selectOne(sqlId, params);
                }
            case "update":
                return sqlSession.update(sqlId, params);
            case "delete":
                return sqlSession.delete(sqlId, params);
            default:
                throw new IllegalArgumentException("Unsupported SQL operation: " + sqlId);
        }
    }

    // 다중 작업 처리 (트랜잭션 적용)
    @Transactional
    public ResponseDto executeBatch(List<RequestDto> requestDtoList) {
        ResponseDto responseDto = new ResponseDto();
        List<Object> results = new ArrayList<>();

        try {
            for (RequestDto request : requestDtoList) {
                String sqlId = request.getSqlId();
                List<Map<String, Object>> paramsList = request.getParamsList();
                Map<String, Object> userInfo = request.getUserInfo();

                if (paramsList != null) {
                    // 리스트 데이터 처리
                    for (Map<String, Object> params : paramsList) {
                        if (userInfo != null) params.putAll(userInfo);

                        if ( logger.isDebugEnabled() ) {
                            logPrint("INPUT", sqlId, params);
                        }

                        Object resultObj = execute(sqlId, params);

                        if ( logger.isDebugEnabled() ) {
                            logPrint("OUTPUT", sqlId, resultObj);
                        }

                        Map<String, Object> resultMaps = new HashMap<String, Object>();
                        resultMaps.put(params.get("_DATA_ID").toString(), resultObj);

                        results.add(resultMaps);
                    }
                } else {
                    // 단일 데이터 처리
                    Map<String, Object> params = request.getParams();
                    if (userInfo != null) params.putAll(userInfo);

                    if ( logger.isDebugEnabled() ) {
                        logPrint("INPUT", sqlId, params);
                    }

                    Object resultObj = execute(sqlId, params);

                    if ( logger.isDebugEnabled() ) {
                        logPrint("OUTPUT", sqlId, resultObj);
                    }

                    Map<String, Object> resultMaps = new HashMap<String, Object>();
                    resultMaps.put(params.get("_DATA_ID").toString(), resultObj);

                    results.add(resultMaps);
                }
            }

            responseDto.setStatus("SUCCESS");
            responseDto.setMessage("정상적으로 처리되었습니다.");
            responseDto.setData(results);
        } catch (Exception e) {
            responseDto.setStatus("ERROR");
            responseDto.setMessage("An error occurred: " + e.getMessage());
            responseDto.setData(null);
        }

        return responseDto;
    }

    private void logPrint(String logTitle, String sqlId, Object obj) {
        if ( logger.isDebugEnabled() ) {
            // 디버그 로그 출력
            logger.debug("=================================================");
            logger.debug(">>  {}  :: ", logTitle);
            logger.debug("=================================================");
            logger.debug("    sqlId   ::: {}", sqlId);
            if ( "OUTPUT".equals(logTitle) ) {
                logger.debug("    result  ::: {}", obj);
            } else {
                logger.debug("    params  ::: {}", obj);
            }
            logger.debug("=================================================");
        }
    }
}
