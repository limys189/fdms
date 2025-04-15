/*
  **************************************************************
  * 파일명    : WhLocMgmt.js
  * 화면명    : 창고위치관리
  * 기능      : 창고위치코드를 관리한다.
  * 생성자    : LIMYS
  * 생성일자  : 2025-04-04
  * 수정이력  :
  *   수정일자  | 수정자 | 수정내용
  * 2025-04-04 | LIMYS | 최초생생
  **************************************************************
*/

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { callPostApi }   from "services/apiService";            // REST-API 서비스 호출
import { useValidation } from 'utils/useValidation';            // 유효성 검사 커스텀 훅
import useUserSession    from 'libs/userSession';               // 사용자 세션정보
import StatusPopup       from 'components/StatusPopup';         // 로딩 및 에러 표시 팝업
import { confirmX }      from "components/WindowsConfirm";      // confirm 다이얼로그 라이브러리

//=========================================
// 그리드 관련 셋팅
import { Grid } from 'wx-react-grid';
import "css/wxReactGrid.css"
import "wx-react-grid/dist/grid.css";
//=========================================

import "styles.css";

/*
CREATE TABLE TB_WH_LOC (
    CO_CD VARCHAR(10) NOT NULL COMMENT '회사코드',
    LOC_CD VARCHAR(10) NOT NULL COMMENT '위치코드',
    LOC_NM VARCHAR(300) NULL COMMENT '위치명',
    USE_YN VARCHAR(1) NULL COMMENT '사용여부',
    REG_DTM DATETIME NOT NULL COMMENT '등록일시',
    REGR_ID VARCHAR(20) NOT NULL COMMENT '등록자ID',
    UPD_DTM DATETIME NOT NULL COMMENT '수정일시',
    UPDR_ID VARCHAR(20) NOT NULL COMMENT '수정자ID',
	CONSTRAINT PK_WH_LOC PRIMARY KEY (CO_CD,LOC_CD)
) COMMENT = '창고위치정보';
*/

const WhLocMgmt = () => {

  // 각 입력 필드에 대한 ref 생성
  const fieldRefs = {
    /* 창고위치 조회조건 */
    whLocSearch: {
      LOC_CD: useRef(null),
      LOC_NM: useRef(null),
      USE_YN: useRef(null),
    },
    /* 창고위치 입력항목 */
    whLocCdInfo: {
      LOC_CD: useRef(null),
      LOC_NM: useRef(null),
      USE_YN: useRef(null),
    },
  };

  // 사용자 세션정보
  const {
      userInfo,
//      isLoading,
//      error,
      login,
//      logout,
//      validateSession,
//      hasPermission,
      isAuthenticated
    } = useUserSession();

  // 그리드 이벤트 정의
  const apiLocGrid = useRef(null);

  // 공통코드 상태
  const [gridUseYnOptions] = useState([]);         // 그리드에서 사용할 사용여부 콤보 옵션
  const [commonCodes, setCommonCodes] = useState([]);
  const [codeSearch] = useState([
    {_DATA_ID: 'USE_YN_A', LRG_CD: 'USE_YN', CODE_NM: '사용여부', _OPTIONS: 'A'},  // 사용여부, 옵션: 전체
    {_DATA_ID: 'USE_YN_N', LRG_CD: 'USE_YN', CODE_NM: '사용여부', _OPTIONS: ''},  // 사용여부, 옵션: 알수없음
  ]);

  // 창고위치코드 상태
  const [whLocCodes, setWhLocCodes] = useState([]);
  const [whLocSearch, setWhLocSearch] = useState({
    _DATA_ID: '',
    LOC_CD: '',
    LOC_NM: '',
    USE_YN: ' '
  });
  const [selectedWhLoc, setSelectedWhLoc] = useState(null);
  const [newWhLoc, setNewWhLoc] = useState({
    LOC_CD: '',
    LOC_NM: '',
    USE_YN: 'Y'
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* 페이징처리 관련 */
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 100; // 한번에 조회할 건수
  let isInitial = true;
  /* 페이징처리 관련 */

// =============================================================================
// useValidation 훅 사용
// =============================================================================
  // 부모 상태를 사용하지 않는 경우
//   const { error: validationError, validateFields } = useValidation(fieldRefs);
  // 부모 상태와 연동하는 경우
  const { validateFields } = useValidation(fieldRefs, setError);
// =============================================================================

  // useValidation 검사 규칙 정의
  const validationRules = {
    /* 창고위치 조회조건 */
    whLocSearch: {
      LOC_CD: {
        required: false,
        upperCaseOnly: true,
        minLength: 3,
        maxBytes: 10,
        minLengthMessage: '창고위치코드는 최소 3자 이상이어야 합니다.'
      },
      LOC_NM: {
        required: false,
        koreanOnly: false,
        minLength: 2,
        minBytes: 6,
        minBytesMessage: '창고위치명은 최소 6바이트(한글 2자) 이상 입력하세요.'
      },
      USE_YN: {
      },
    },
    /* 창고위치 입력항목 */
    whLocCdInfo: {
      LOC_CD: {
        required: true,
        upperCaseOnly: true,
        maxBytes: 10,
        requiredMessage: '창고위치코드는 필수 입력 항목입니다.'
      },
      LOC_NM: {
        required: true,
        koreanOnly: false,
        minLength: 2,
        minBytes: 6,
        maxBytes: 30,
        requiredMessage: '창고위치명은 필수 입력 항목입니다.',
        minBytesMessage: '창고위치명은 최소 6바이트(한글 2자) 이상 입력하세요.'
      },
      USE_YN: {
        required: true,
        maxBytes: 1,
        requiredMessage: '사용여부는 필수 입력 항목입니다.'
      },
    },
  };

  // 창고위치코드 영역 초기화
  const resetWhLocArea = () => {
    setWhLocSearch({
      LOC_CD: '',
      LOC_NM: '',
      USE_YN: ' '
    });
    setWhLocCodes([]);
    setSelectedWhLoc(null);
    setNewWhLoc({
      LOC_CD: '',
      LOC_NM: '',
      USE_YN: 'Y'
    });
  };

  // 그리드 사이즈 속성 셋팅
  const gridSizes = {
    rowHeight: 30,
//    colWidth: 160,
    headerHeight: 30,
    footerHeight: 30,
  };

  // 팝업화면 닫기 핸들
  const handleClosePopup = () => {
    setError(null);
    // 로딩은 일반적으로 사용자가 닫을 수 없음
    // 필요시 setLoading(false) 추가
  };

  // 공통코드 조회
  const fetchCommonCodes = useCallback(async () => {
    // API 호출 로직 (실제 구현 필요)
//    console.log('공통코드 조회:', codeSearch);

    setLoading(true);
    setError(null);
    try {
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "BasSmlCd.selectListCode",
        paramsList: codeSearch
      }]

      // apiService의 callPostApi 함수 호출
      const resData = await callPostApi(arrReqData);
//      console.log('공통코드 조회 결과 :::', resData);

      // 그리드에서 사용할 사용여부 콤보 옵션 셋팅
      (resData.find(item => item.USE_YN_N)?.USE_YN_N || []).forEach((result)=>{
        var temp = {
          id: result.SML_CD,
          name: result.SML_NM,
        };
        if ( !gridUseYnOptions.find(item => item.id === result.SML_CD) ) {
            gridUseYnOptions.push(temp);
        }
      });

      setCommonCodes(resData);
    } catch (err) {
      console.error('공통코드 조회 실패:', err);
      setError('공통코드를 불러오는 중 오류가 발생했습니다.');
      setCommonCodes([]);
    } finally {
      setLoading(false);
    }
  }, [codeSearch, gridUseYnOptions]);

  // 창고위치코드 조회
  const fetchWhLocCodes = useCallback(async () => {
    // API 호출 로직 (실제 구현 필요)
//    console.log('창고위치코드 조회:', whLocSearch);

    // 창고위치코드 조회조건 유효성 체크
    const isValid = validateFields('whLocSearch', validationRules.whLocSearch, whLocSearch);
    if (!isValid) {
      return; // 오류 시 여기서 종료
    }

    // 초기 조회 시 상태 초기화
    if (isInitial) {
      setPage(0);
      setWhLocCodes([]);
      setHasMore(true);
    }

    setLoading(true);
    setError(null);
    try {
      whLocSearch._DATA_ID = "LOC_CD_LIST";
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "WhLoc.selectList",
        userInfo: userInfo,
        params: {
          ...whLocSearch,
          OFFSET: page * limit,
          LIMIT: limit
        }
      }]
      console.log('창고위치코드 조회 값 ::: ', arrReqData);

      // apiService의 callPostApi 함수 호출
      const resData = await callPostApi(arrReqData);
//      console.log('창고위치코드 조회 결과 :::', resData);
//      setWhLocCodes(resData.find(item => item.LOC_CD_LIST)?.LOC_CD_LIST || []);

      const newData = resData.find(item => item.LOC_CD_LIST)?.LOC_CD_LIST || [];
      if (isInitial) {
        setWhLocCodes(newData);
        isInitial = false;
      } else {
        setWhLocCodes(prev => [...prev, ...newData]);
      }
      // 더 불러올 데이터가 있는지 확인
      setHasMore(newData.length === limit);
      if (!isInitial) {
        setPage(prev => prev + 1);
      }

      setSelectedWhLoc(null);
      setNewWhLoc({
        LOC_CD: '',
        LOC_NM: '',
        USE_YN: 'Y'
      });

    } catch (err) {
      console.error('창고위치코드 조회 실패:', err);
      setError('창고위치코드를 불러오는 중 오류가 발생했습니다.');
      setWhLocCodes([]);
    } finally {
      setLoading(false);
    }
  }, [whLocSearch, page, userInfo, validateFields, validationRules.whLocSearch]);


/*
  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchWhLocCodes(false);
    }
  }, [loading, hasMore, fetchWhLocCodes]);
*/


  // 창고위치코드 저장
  const handleSaveWhLocCode = async () => {
//    if (selectedWhLoc) {
//      // 수정 로직
//      console.log('창고위치코드 수정:', selectedWhLoc);
//    } else {
//      // 신규 등록 로직
//      console.log('창고위치코드 신규:', newWhLoc);
//    }

    // 창고위치코드 입력값 유효성 체크
    const isValid = validateFields('whLocCdInfo', validationRules.whLocCdInfo, selectedWhLoc || newWhLoc);
    if (!isValid) {
      return; // 오류 시 여기서 종료
    }

    // Confirm 다이얼로그 추가
    const isConfirmed = await confirmX({
      message: selectedWhLoc
                 ? '창고위치코드를 수정하시겠습니까?'
                 : '창고위치코드를 신규 등록하시겠습니까?',
      title: "창고위치코드 저장",
      confirmText: "저장",
      cancelText: "취소"
    });
    if (!isConfirmed) {
      return; // 사용자가 취소하면 여기서 종료
    }

    const originalData = [...whLocCodes];
    const dataToSave = selectedWhLoc || newWhLoc;

    try {
      setLoading(true);

      // 낙관적 업데이트
      if (selectedWhLoc) {
        setWhLocCodes(whLocCodes.map(item =>
          item.LOC_CD === dataToSave.LOC_CD ? dataToSave : item
        ));
      } else {
        setWhLocCodes([...whLocCodes, dataToSave]);
      }

      dataToSave._DATA_ID = (selectedWhLoc ? "LOC_CD_UPDATE" : "LOC_CD_INSERT");
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: (selectedWhLoc ? "WhLoc.updateWhLoc" : "WhLoc.insertWhLoc"),
        userInfo: userInfo,
        paramsList: [dataToSave],
      }]
//      console.log('창고위치코드 저장 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
//      const savedData = await callPostApi(arrReqData);
      await callPostApi(arrReqData);

      setLoading(false);
      await confirmX({
        title: "창고위치코드 저장",
        message: "저장되었습니다",
        type: "success"
      });

      // 성공 시 정확한 데이터로 업데이트
      if (selectedWhLoc) {
        // 수정 후 리스트 업데이트
        setWhLocCodes(whLocCodes.map(item =>
          item.LOC_CD === dataToSave.LOC_CD ? dataToSave : item
        ));
      } else {
        // 신규 등록 후 리스트 업데이트
        setWhLocCodes([...whLocCodes.filter(item => item.LOC_CD !== dataToSave.LOC_CD), dataToSave]);
        setNewWhLoc({
          LOC_CD: '',
          LOC_NM: '',
          USE_YN: 'Y'
        });

        // 저장 후 리스트 재조회
        fetchWhLocCodes();
      }

    } catch (err) {
      // 실패 시 롤백
      setWhLocCodes(originalData);
      console.error('창고위치코드 저장 실패:', err);
      setError('창고위치코드 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 창고위치코드 삭제
  const handleDeleteWhLocCode = async () => {
    if (!selectedWhLoc) return;
//    console.log('창고위치코드 삭제:', selectedWhLoc);

    // Confirm 다이얼로그 추가
    const isConfirmed = await confirmX({
      message: '창고위치코드를 삭제하시겠습니까?',
      title: "창고위치코드 삭제",
      confirmText: "삭제",
      cancelText: "취소"
    });
    if (!isConfirmed) {
      return; // 사용자가 취소하면 여기서 종료
    }

    try {
      setLoading(true);

      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "WhLoc.deleteWhLoc",
        userInfo: userInfo,
        params: selectedWhLoc
      }]
//      console.log('창고위치코드 삭제 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
      await callPostApi(arrReqData);

      setLoading(false);
      await confirmX({
        title: "창고위치코드 삭제",
        message: "삭제되었습니다",
        type: "success"
      });

      // 삭제 후 리스트 업데이트
//      setWhLocCodes(whLocCodes.filter(item => item.LOC_CD !== selectedWhLoc.LOC_CD));
      setSelectedWhLoc(null);
      setNewWhLoc({
        LOC_CD: '',
        LOC_NM: '',
        USE_YN: 'Y'
      });

      // 삭제 후 리스트 재조회
      fetchWhLocCodes();

    } catch (err) {
      console.error('창고위치코드 삭제 실패:', err);
      setError('창고위치코드 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = useCallback(async () => {
    try {
      await login({ username: 'test', password: '1234' });
      console.log('로그인 성공!');
    } catch (err) {
      console.error('로그인 실패:', err);
    }
  }, [login]);


  // 화면 오픈 시 처리
  useEffect(() => {
    if (!isAuthenticated) handleLogin();
    // 공통코드 조회
    fetchCommonCodes();
  }, []);


/*
  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
*/


  // 그리드 이벤트 처리
  useEffect(() => {
    // 창고위치코드 그리드 이벤트 처리
    if (apiLocGrid.current) {
        apiLocGrid.current.on("select-row", (ev) => {
          // 창고위치 상세정보 셋팅
          setSelectedWhLoc(apiLocGrid.current.getRow(ev.id));
        });
//        apiLocGrid.current.exec("scroll", { row, column });
        apiLocGrid.current.on("scroll", (ev) => {
          let rows = apiLocGrid.current.getRow(ev.id);
          console.log('rows : ', rows);
        });
    }
  }, [apiLocGrid]);

  return (
    <div className="half-width-container">
      {/* 로딩 및 오류 표시 다이얼로그 팝업 */}
      <StatusPopup loading={loading} error={error} onClose={handleClosePopup} />

      <h5 className="main-title">창고위치관리</h5>

      <div className="code-management-container">
        {/* 좌측 영역 - 창고위치코드 관리 */}
        <div className="left-section-fullWidth">
          <div className="paper" style={{ height: 'calc(100% - 12px)' }}>
            {/* 상단 - 조회조건 영역 */}
            <div className="search-section">
              <h6 className="section-title">창고위치코드 조회</h6>
              <div className="search-grid">

                {/* 첫 번째 행 */}
                <div className="search-row">
                  <div className="search-field">
                    <div className="title-area">
                      <label>창고위치코드</label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.whLocSearch.LOC_CD}
                        type="text"
                        value={whLocSearch.LOC_CD}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
                          setWhLocSearch({ ...whLocSearch, LOC_CD: value });
                        }}
                        onKeyPress={(e) => {
                          const charCode = e.charCode;
                          if ( charCode === 13 ) { // 엔터 이벤트
                            e.preventDefault();
                            fetchWhLocCodes();
                          }
                        }}
                        pattern="[a-zA-Z0-9_]*"
                        maxLength="30"
                        className="form-input uppercase-input"
                      />
                    </div>
                    <div className="title-area">
                      <label>창고위치명</label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.whLocSearch.LOC_NM}
                        type="text"
                        value={whLocSearch.LOC_NM}
                        onChange={(e) => setWhLocSearch({ ...whLocSearch, LOC_NM: e.target.value })}
                        onKeyPress={(e) => {
                          const charCode = e.charCode;
                          if ( charCode === 13 ) { // 엔터 이벤트
                            e.preventDefault();
                            fetchWhLocCodes();
                          }
                        }}
                        maxLength="30"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* 두 번째 행 */}
                <div className="search-row">
                  <div className="search-field">
                    <div className="title-area">
                      <label>사용여부</label>
                    </div>
                    <div className="component-area">
                      <select
                        ref={fieldRefs.whLocSearch.USE_YN}
                        value={whLocSearch.USE_YN}
                        onChange={(e) => setWhLocSearch({ ...whLocSearch, USE_YN: e.target.value })}
                        className="form-select"
                      >
                        {(commonCodes.find(item => item.USE_YN_A)?.USE_YN_A || []).map((option) => (
                          <option key={option.SML_CD} value={option.SML_CD}>
                            {option.SML_NM}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="title-area-blank" style={{ width: '20%' }}>
                      {/* 빈 공간 */}
                    </div>
                    <div className="component-area-blank" style={{ width: '30%' }}>
                      {/* 빈 공간 */}
                    </div>
                  </div>
                </div>

                {/* 버튼 행 - 오른쪽 정렬 */}
                <div className="search-row-button" style={{ justifyContent: 'flex-end' }}>
                  <div className="search-buttons">
                    <button
                      onClick={resetWhLocArea}
                      className="reset-btn"
                    >
                      초기화
                    </button>
                    <button
                      onClick={fetchWhLocCodes}
                      className="search-btn"
                    >
                      조회
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 중간 - 데이터 영역 */}
            <div className="data-section wx-willow-theme">
              <Grid
                data={whLocCodes}
                columns={[
                  { id: 'LOC_CD', header: '창고위치코드', footer: '창고위치코드', editor: 'text', width: 120, },
                  { id: 'LOC_NM', header: '창고위치명', footer: '창고위치명', editor: 'text', width: 392, },
                  { id: 'USE_YN', header: '사용여부', footer: '사용여부', editor: "combo", options: gridUseYnOptions, width: 80, }
                ]}
                sizes={gridSizes}
                api={apiLocGrid}
                style={{ fontSize: '0.8rem' }}
              />
            </div>

            {/* 하단 - 상세정보 영역 */}
            <div className="detail-section">
              <h6 className="section-title">창고위치 상세정보</h6>
              <div className="detail-grid">

                {/* 첫 번째 행 */}
                <div className="detail-row">
                  <div className="detail-field">
                    <div className="title-area">
                      <label>창고위치코드 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.whLocCdInfo.LOC_CD}
                        type="text"
                        value={selectedWhLoc ? selectedWhLoc.LOC_CD : newWhLoc.LOC_CD}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
                          selectedWhLoc
                            ? setSelectedWhLoc({ ...selectedWhLoc, LOC_CD: value })
                            : setNewWhLoc({ ...newWhLoc, LOC_CD: value });
                        }}
                        disabled={selectedWhLoc}
                        pattern="[a-zA-Z0-9_]*"
                        maxLength="30"
                        className="form-input uppercase-input required"
                      />
                    </div>
                    <div className="title-area">
                      <label>창고위치명 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.whLocCdInfo.LOC_NM}
                        type="text"
                        value={selectedWhLoc ? selectedWhLoc.LOC_NM : newWhLoc.LOC_NM}
                        onChange={(e) =>
                          selectedWhLoc
                            ? setSelectedWhLoc({ ...selectedWhLoc, LOC_NM: e.target.value })
                            : setNewWhLoc({ ...newWhLoc, LOC_NM: e.target.value })
                        }
                        maxLength="30"
                        className="form-input required"
                      />
                    </div>
                  </div>
                </div>

                {/* 두 번째 행 */}
                <div className="detail-row">
                  <div className="detail-field">
                    <div className="title-area">
                      <label>사용여부 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <select
                        ref={fieldRefs.whLocCdInfo.USE_YN}
                        value={selectedWhLoc ? selectedWhLoc.USE_YN : newWhLoc.USE_YN}
                        onChange={(e) =>
                          selectedWhLoc
                            ? setSelectedWhLoc({ ...selectedWhLoc, USE_YN: e.target.value })
                            : setNewWhLoc({ ...newWhLoc, USE_YN: e.target.value })
                        }
                        className="form-select required"
                      >
                        {(commonCodes.find(item => item.USE_YN_N)?.USE_YN_N || []).map((option) => (
                          <option key={option.SML_CD} value={option.SML_CD}>
                            {option.SML_NM}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="title-area-blank" style={{ width: '20%' }}>
                      {/* 빈 공간 */}
                    </div>
                    <div className="component-area-blank" style={{ width: '30%' }}>
                      {/* 빈 공간 */}
                    </div>
                  </div>
                </div>

                {/* 버튼 행 - 오른쪽 정렬 */}
                <div className="detail-row-button" style={{ justifyContent: 'flex-end' }}>
                  <div className="action-buttons">
                    <button
                      onClick={() => setSelectedWhLoc(null)}
                      className="new-btn"
                    >
                      신규
                    </button>
                    <button
                      onClick={handleSaveWhLocCode}
                      disabled={loading}
                      className="save-btn"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleDeleteWhLocCode}
                      disabled={loading || !selectedWhLoc}
                      className="delete-btn"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhLocMgmt;
