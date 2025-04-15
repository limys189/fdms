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

import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { GlobalContext } from 'GlobalContext';

//=========================================
//=========================================
//=========================================
import { Modal, Box } from "@mui/material";
//=========================================
//=========================================
//=========================================

import "styles.css";

//=========================================
// 그리드 관련 셋팅
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
//=========================================


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

  // 전역변수 선언
  const {
    agGridTheme,                // 그리드 테마
    userInfo,                   // 사용자 세션 정보
//    isLoading,
//    error,
//    login,
//    logout,
//    validateSession,
//    hasPermission,
    isAuthenticated,            // 로그인 여부
    handleLogin,                // 로그인 핸들러
    callPostApi,                // REST-API 서비스 호출
    useValidation,              // 유효성 검사 커스텀 훅
    StatusPopup,                // 로딩 및 에러 표시 팝업
    confirmX,                   // confirm 다이얼로그 라이브러리
    setGridComboVal,            // 그리드 콤보 공통코드 셋팅
  } = useContext(GlobalContext);


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


  // 공통코드 상태
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

//  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
//=========================================
//=========================================
//=========================================
  const [open, setOpen] = useState(false);
//=========================================
//=========================================
//=========================================


  // 그리드 이벤트 정의
  const gridRef = useRef();


//=========================================
//=========================================
//=========================================
  // 더블클릭 이벤트 핸들러
  const handleRowDoubleClick = (event) => {
    setSelectedWhLoc({ ...event.data }); // 원본 보호용 복사
    setOpen(true);
    setIsDisabled(true);
  };

  const handleClose = () => setOpen(false);

/*
  const handleChange = (e) => {
    setSelectedWhLoc((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log("저장된 데이터:", selectedWhLoc);
    setOpen(false);
  };
*/
//=========================================
//=========================================
//=========================================


/*
  // ✅ 선택 이벤트 핸들러
  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setIsDisabled(true);
    setSelectedWhLoc(selectedData[0]);
//    console.log('✅ 선택된 행:', selectedData[0]);
  };
*/

/*
  // 그리드 USE_YN field 값 셋팅
  const handleCellValueChanged = useCallback((event: CellValueChangedEvent) => {
//console.log('handleCellValueChanged   :::   ', event.colDef);
//console.log('handleCellValueChanged  options  :::   ', event.colDef.options);
    if (event.colDef.field === 'USE_YN') {
      const updatedRowIndex = event.node.rowIndex;
      const gridOptions = event.colDef.cellEditor === "agSelectCellEditor" ? event.colDef.options : [];
//console.log('handleCellValueChanged  options  :::   ', gridOptions);
      const updatedValue = event.colDef.cellEditor === "agSelectCellEditor" ? getIdFromLabel(gridOptions, event.newValue) : event.newValue;
//console.log('handleCellValueChanged  updatedValue  :::   ', updatedValue);
      setWhLocCodes((prev) => {
        const newData = [...prev];
        newData[updatedRowIndex] = {
          ...newData[updatedRowIndex],
          USE_YN: updatedValue,
        };
        return newData;
      });
    }
  }, []);
*/

  // 그리드 콤보 id -> name
  const getLabelFromId = (objOptions, id) => {
    const match = objOptions.find((item) => item.id === id);
    return match ? match.name : id;
  };
  // 그리드 콤보 name -> id
  const getIdFromLabel = (objOptions, name) => {
    const match = objOptions.find((item) => item.name === name);
    return match ? match.id : name;
  };

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
        required: false,
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

      setCommonCodes(resData);
    } catch (err) {
      console.error('공통코드 조회 실패:', err);
      setError('공통코드를 불러오는 중 오류가 발생했습니다.');
      setCommonCodes([]);
    } finally {
      setLoading(false);
    }
  }, [codeSearch, callPostApi]);

  // 창고위치코드 조회
  const fetchWhLocCodes = useCallback(async () => {
    // API 호출 로직 (실제 구현 필요)
//    console.log('창고위치코드 조회:', whLocSearch);

    // 창고위치코드 조회조건 유효성 체크
    const isValid = validateFields('whLocSearch', validationRules.whLocSearch, whLocSearch);
    if (!isValid) {
      return; // 오류 시 여기서 종료
    }

    setLoading(true);
    setError(null);
    try {
      whLocSearch._DATA_ID = "LOC_CD_LIST";
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "WhLocMgmt.selectList",
        userInfo: userInfo,
        params: {
          ...whLocSearch,
//          OFFSET: page * limit,
//          LIMIT: limit
        }
      }]
//      console.log('창고위치코드 조회 값 ::: ', arrReqData);

      // apiService의 callPostApi 함수 호출
      const resData = await callPostApi(arrReqData);
//      console.log('창고위치코드 조회 결과 :::', resData);
      setWhLocCodes(resData.find(item => item.LOC_CD_LIST)?.LOC_CD_LIST || []);
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
  }, [whLocSearch, userInfo, validateFields, validationRules.whLocSearch, callPostApi]);

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
        sqlId: (selectedWhLoc ? "WhLocMgmt.updateWhLoc" : "WhLocMgmt.insertWhLoc"),
        userInfo: userInfo,
        paramsList: [dataToSave],
      }]
//      console.log('창고위치코드 저장 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
//      const savedData = await callPostApi(arrReqData);
      await callPostApi(arrReqData);

      setLoading(false);
      setOpen(false);
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
      setOpen(false);
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
        sqlId: "WhLocMgmt.deleteWhLoc",
        userInfo: userInfo,
        params: selectedWhLoc
      }]
//      console.log('창고위치코드 삭제 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
      await callPostApi(arrReqData);

      setLoading(false);
      setOpen(false);
      await confirmX({
        title: "창고위치코드 삭제",
        message: "삭제되었습니다",
        type: "success"
      });

      // 삭제 후 리스트 업데이트
//      setWhLocCodes(whLocCodes.filter(item => item.LOC_CD !== selectedWhLocMgmt.LOC_CD));
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
      setOpen(false);
    }
  };


  // 화면 오픈 시 처리
  useEffect(() => {
    if (!isAuthenticated) handleLogin();
    // 공통코드 조회
    fetchCommonCodes();

    // 상세정보 컴포넌트 비활성
    setIsDisabled(false);
  }, [isAuthenticated, handleLogin, fetchCommonCodes]);


  return (
    <div className="half-width-container">
      {/* 로딩 및 오류 표시 다이얼로그 팝업 */}
      {/*<StatusPopup loading={loading} error={error} onClose={handleClosePopup} />*/}

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
                        maxLength="10"
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
                      onClick={(e) => {
                        setIsDisabled(false);
                        resetWhLocArea();
                      }}
                      className="reset-btn"
                    >
                      초기화
                    </button>
                    <button
                      onClick={(e) => {
                        setIsDisabled(false);
                        fetchWhLocCodes();
                      }}
                      className="search-btn"
                    >
                      조회
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 상단 - 조회조건 영역 */}


            {/* 중간 - 데이터 영역 */}
            <div className="data-section ag-theme-alpine" style={{ height: '640px' }}>
              <AgGridReact
                ref={gridRef}
                theme={agGridTheme}
                rowData={whLocCodes}
                columnDefs={[
                  {
                    field: 'LOC_CD',
                    headerName: '창고위치코드',
                    width: 120,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'LOC_NM',
                    headerName: '창고위치명',
                    width: 372,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'USE_YN',
                    headerName: '사용여부',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'center' },
                    cellDataType : 'object',
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                      values: setGridComboVal(commonCodes, 'USE_YN_A').map((opt) => opt.name), // 셀렉트 박스에 표시할 label 목록
                    },
                    valueFormatter: (params) => getLabelFromId(setGridComboVal(commonCodes, 'USE_YN_A'), params.value), // id → name 표시
                    valueParser: (name) => getIdFromLabel(setGridComboVal(commonCodes, 'USE_YN_A'), name), // name → id 저장
                    options: [...setGridComboVal(commonCodes, 'USE_YN_A')],    // 사용자정의로 셋팅
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                ]}
                rowSelection="single" // 또는 "multiple"
                onRowDoubleClicked={handleRowDoubleClick}
                /*onSelectionChanged={onSelectionChanged} // ✅ 이벤트 연결*/
                /*onCellValueChanged={handleCellValueChanged}*/
                defaultColDef={{
                  sortable: true,  // 전체컬럼 정렬(오름차순,내림차순)기능
                  /*editable: true,  // 전체컬럼 편집기능*/
                  resizable: true, // 전체컬럼 사이즈조절
                  /*filter: true,    // 전체컬럼 필터기능*/
                  /*flex: 1,         // 균등비율 지정*/
                }}
                /*singleClickEdit={true} // ✅ 전체 컬럼에 적용도 가능*/
                /*pagination={true}            // ✅ 페이징 활성화*/
                /*paginationPageSize={100}       // ✅ 페이지당 행 수*/
              />
            </div>
            {/* 중간 - 데이터 영역 */}


            {/* 레이어팝업 - 상세정보 영역 */}
            <div className="detail-section">
              <div className="detail-grid">
                {/* 버튼 행 - 오른쪽 정렬 */}
                <div className="detail-row-button" style={{ justifyContent: 'flex-end' }}>
                  <div className="action-buttons">
                    <button
                      onClick={(e) => {
                        setOpen(true);
                        setIsDisabled(true);
                        setSelectedWhLoc(null);
                      }}
                      className="new-btn"
                    >
                      신규
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 레이어팝업 - 상세정보 영역 */}
          </div>
        </div>
        {/* 좌측 영역 - 창고위치코드 관리 */}



        {/* MUI 모달 팝업 */}
        {/*<Modal open={open} onClose={handleClose}>*/}
        <Modal open={open}>
          <Box
            sx={{
              p: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              width: 640,
              mx: "auto",
              mt: "15%",
              boxShadow: 24,
            }}
          >
            {/* 로딩 및 오류 표시 다이얼로그 팝업 */}
            <StatusPopup loading={loading} error={error} onClose={handleClosePopup} />

            {/* 레이어팝업 - 상세정보 영역 */}
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
                        pattern="[a-zA-Z0-9_]*"
                        maxLength="10"
                        className="form-input uppercase-input required"
                        disabled={!isDisabled || selectedWhLoc}
                      />
                    </div>
                    <div className="title-area">
                      {/*<label>창고위치명 <span className="required-mark">*</span></label>*/}
                      <label>창고위치명</label>
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
                        /*className="form-input required"*/
                        className="form-input"
                        disabled={!isDisabled}
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
                        disabled={!isDisabled}
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
                    <button
                      onClick={handleClose}
                      className="close-btn"
                    >
                      닫기
                    </button>
                  </div>
                </div>
                {/* 버튼 행 - 오른쪽 정렬 */}
              </div>
            </div>
            {/* 레이어팝업 - 상세정보 영역 */}


          </Box>
        </Modal>



      </div>
    </div>
  );
};

export default WhLocMgmt;
