/*
  **************************************************************
  * 파일명    : CommonCodeMgmt.js
  * 화면명    : 공통코드관리
  * 기능      : 대분류코드, 소분류코드 를 관리한다.
  * 생성자    : LIMYS
  * 생성일자  : 2025-04-03
  * 수정이력  :
  *   수정일자  | 수정자 | 수정내용
  * 2025-04-03 | LIMYS | 최초생생
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
CREATE TABLE TB_BAS_LRG_CD (
	LRG_CD VARCHAR(30) NOT NULL COMMENT '대분류코드',
	LRG_NM VARCHAR(100) NULL COMMENT '대분류명',
	USE_YN VARCHAR(1) NULL COMMENT '사용여부',
	REG_DTM DATETIME NOT NULL COMMENT '등록일시',
	REGR_ID VARCHAR(20) NOT NULL COMMENT '등록자ID',
	UPD_DTM DATETIME NOT NULL COMMENT '수정일시',
	UPDR_ID VARCHAR(20) NOT NULL COMMENT '수정자ID',
	CONSTRAINT PK_BAS_LRG_CD PRIMARY KEY (LRG_CD)
) COMMENT = '기초대분류코드';

CREATE TABLE TB_BAS_SML_CD (
	LRG_CD VARCHAR(30) NOT NULL COMMENT '대분류코드',
	SML_CD VARCHAR(30) NOT NULL COMMENT '소분류코드',
	SML_NM VARCHAR(100) NULL COMMENT '소분류명',
	SRT_NO BIGINT NULL COMMENT '정렬순서',
	USE_YN VARCHAR(1) NULL COMMENT '사용여부',
	REG_DTM DATETIME NOT NULL COMMENT '등록일시',
	REGR_ID VARCHAR(20) NOT NULL COMMENT '등록자ID',
	UPD_DTM DATETIME NOT NULL COMMENT '수정일시',
	UPDR_ID VARCHAR(20) NOT NULL COMMENT '수정자ID',
	CONSTRAINT PK_BAS_SML_CD PRIMARY KEY (LRG_CD,SML_CD)
) COMMENT = '기초소분류코드';
*/

const CommonCodeMgmt = () => {

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
    /* 대분류 조회조건 */
    lrgSearch: {
      LRG_CD: useRef(null),
      LRG_NM: useRef(null),
      USE_YN: useRef(null),
    },
    /* 대분류 입력항목 */
    lrgCdInfo: {
      LRG_CD: useRef(null),
      LRG_NM: useRef(null),
      USE_YN: useRef(null),
    },
    /* 소분류 조회조건 */
    smlSearch: {
      SML_CD: useRef(null),
      SML_NM: useRef(null),
      USE_YN: useRef(null),
    },
    /* 소분류 입력항목 */
    smlCdInfo: {
      LRG_CD: useRef(null),
      SML_CD: useRef(null),
      SML_NM: useRef(null),
      SRT_NO: useRef(null),
      USE_YN: useRef(null),
    },
  };


  // 공통코드 상태
  const [commonCodes, setCommonCodes] = useState([]);
  const [codeSearch] = useState([
    {_DATA_ID: 'USE_YN_A', LRG_CD: 'USE_YN', CODE_NM: '사용여부', _OPTIONS: 'A'},  // 사용여부, 옵션: 전체
    {_DATA_ID: 'USE_YN_N', LRG_CD: 'USE_YN', CODE_NM: '사용여부', _OPTIONS: ''},  // 사용여부, 옵션: 알수없음
  ]);

  // 대분류코드 상태
  const [largeCodes, setLargeCodes] = useState([]);
  const [largeSearch, setLargeSearch] = useState({
    _DATA_ID: '',
    LRG_CD: '',
    LRG_NM: '',
    USE_YN: ' '
  });
  const [selectedLarge, setSelectedLarge] = useState(null);
  const [newLarge, setNewLarge] = useState({
    LRG_CD: '',
    LRG_NM: '',
    USE_YN: 'Y'
  });

  // 소분류코드 상태
  const [smallCodes, setSmallCodes] = useState([]);
  const [smallSearch, setSmallSearch] = useState({
    _DATA_ID: '',
    LRG_CD: '',
    SML_CD: '',
    SML_NM: '',
    USE_YN: ' '
  });
  const [selectedSmall, setSelectedSmall] = useState(null);
  const [newSmall, setNewSmall] = useState({
    LRG_CD: selectedLarge?.LRG_CD || '',
    SML_CD: '',
    SML_NM: '',
    SRT_NO: 0,
    USE_YN: 'Y'
  });

//  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLrgInfoDisabled, setIsLrgInfoDisabled] = useState(false);
  const [isSmlInfoDisabled, setIsSmlInfoDisabled] = useState(false);
//=========================================
//=========================================
//=========================================
  const [openLrg, setOpenLrg] = useState(false);
  const [openSml, setOpenSml] = useState(false);
//=========================================
//=========================================
//=========================================

  // 그리드 이벤트 정의
  const apiLrgGrid = useRef(null);
  const apiSmlGrid = useRef(null);


//=========================================
//=========================================
//=========================================
  // 더블클릭 이벤트 핸들러
  const handleLrgRowDoubleClick = (event) => {
    setSelectedLarge({ ...event.data }); // 원본 보호용 복사
    setOpenLrg(true);
    setIsLrgInfoDisabled(true);
  };

  const handleLrgClose = () => setOpenLrg(false);

  // 더블클릭 이벤트 핸들러
  const handleSmlRowDoubleClick = (event) => {
    setSelectedSmall({ ...event.data }); // 원본 보호용 복사
    setOpenSml(true);
    setIsSmlInfoDisabled(true);
  };

  const handleSmlClose = () => setOpenSml(false);

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


  // 대분류코드 ✅ 선택 이벤트 핸들러
  const onLrgGridSelectionChanged = () => {
    const selectedNodes = apiLrgGrid.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setIsLrgInfoDisabled(true);
    setSelectedLarge(selectedData[0]);
//    console.log('✅ 선택된 행:', selectedData[0]);
  };

/*
  // 소분류코드 ✅ 선택 이벤트 핸들러
  const onSmlGridSelectionChanged = () => {
    const selectedNodes = apiSmlGrid.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setIsSmlInfoDisabled(true);
    setSelectedSmall(selectedData[0]);
//    console.log('✅ 선택된 행:', selectedData[0]);
  };
*/

/*
  // 그리드 USE_YN field 값 셋팅
  const handleCellValueChanged = useCallback((event: CellValueChangedEvent) => {
console.log('handleCellValueChanged   :::   ', event.colDef);
//console.log('handleCellValueChanged  options  :::   ', event.colDef.options);
    if (event.colDef.field === 'USE_YN') {
      const updatedRowIndex = event.node.rowIndex;
      const gridOptions = event.colDef.cellEditor === "agSelectCellEditor" ? event.colDef.options : [];
//console.log('handleCellValueChanged  options  :::   ', gridOptions);
      const updatedValue = event.colDef.cellEditor === "agSelectCellEditor" ? getIdFromLabel(gridOptions, event.newValue) : event.newValue;
//console.log('handleCellValueChanged  updatedValue  :::   ', updatedValue);
//      setSmallCodes
      setLargeCodes((prev) => {
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
    /* 대분류 조회조건 */
    lrgSearch: {
      LRG_CD: {
        required: false,
        upperCaseOnly: true,
        minLength: 3,
        maxBytes: 30,
        minLengthMessage: '대분류코드는 최소 3자 이상이어야 합니다.'
      },
      LRG_NM: {
        required: false,
        koreanOnly: false,
        minLength: 2,
        minBytes: 6,
        minBytesMessage: '대분류명은 최소 6바이트(한글 2자) 이상 입력하세요.'
      },
      USE_YN: {
      },
    },
    /* 대분류 입력항목 */
    lrgCdInfo: {
      LRG_CD: {
        required: true,
        upperCaseOnly: true,
        maxBytes: 30,
        requiredMessage: '대분류코드는 필수 입력 항목입니다.'
      },
      LRG_NM: {
        required: true,
        koreanOnly: false,
        minLength: 2,
        minBytes: 6,
        maxBytes: 100,
        requiredMessage: '대분류명은 필수 입력 항목입니다.',
        minBytesMessage: '대분류명은 최소 6바이트(한글 2자) 이상 입력하세요.'
      },
      USE_YN: {
        required: true,
        maxBytes: 1,
        requiredMessage: '사용여부는 필수 입력 항목입니다.'
      },
    },
    /* 소분류 조회조건 */
    smlSearch: {
//      LRG_CD: {
//        required: false,
//        upperCaseOnly: true,
//        minLength: 3,
//        maxBytes: 5,
//        minLengthMessage: '대분류코드는 최소 3자 이상이어야 합니다.'
//      },
      SML_CD: {
        required: false,
        upperCaseOnly: true,
        minLength: 3,
        maxBytes: 30,
        minLengthMessage: '소분류코드는 최소 3자 이상이어야 합니다.'
      },
      SML_NM: {
        required: false,
        koreanOnly: false,
        minLength: 2,
        minBytes: 6,
        minBytesMessage: '소분류코드는 최소 6바이트(한글 2자) 이상 입력하세요.'
      },
      USE_YN: {
      },
    },
    /* 소분류 입력항목 */
    smlCdInfo: {
      LRG_CD: {
        required: true,
        upperCaseOnly: true,
        maxBytes: 30,
        requiredMessage: '대분류코드는 필수 입력 항목입니다.'
      },
      SML_CD: {
        required: true,
        upperCaseOnly: true,
        maxBytes: 30,
        requiredMessage: '소분류코드는 필수 입력 항목입니다.'
      },
      SML_NM: {
        required: true,
        koreanOnly: false,
        minLength: 2,
        minBytes: 6,
        maxBytes: 100,
        requiredMessage: '소분류명은 필수 입력 항목입니다.',
        minBytesMessage: '소분류명은 최소 6바이트(한글 2자) 이상 입력하세요.'
      },
      USE_YN: {
        required: true,
        maxBytes: 1,
        requiredMessage: '사용여부는 필수 입력 항목입니다.'
      },
    },
  };

  // 대분류코드 영역 초기화
  const resetLargeArea = () => {
    setLargeSearch({
      LRG_CD: '',
      LRG_NM: '',
      USE_YN: ' '
    });
    setLargeCodes([]);
    setSelectedLarge(null);
    setNewLarge({
      LRG_CD: '',
      LRG_NM: '',
      USE_YN: 'Y'
    });
  };

  // 소분류코드 영역 초기화
  const resetSmallArea = useCallback(() => {
    setSmallSearch({
      LRG_CD: selectedLarge?.LRG_CD || '',
      SML_CD: '',
      SML_NM: '',
      USE_YN: ' '
    });
    setSmallCodes([]);
    setSelectedSmall(null);
    setNewSmall({
      LRG_CD: selectedLarge?.LRG_CD || '',
      SML_CD: '',
      SML_NM: '',
      SRT_NO: 0,
      USE_YN: 'Y'
    });
  }, [selectedLarge?.LRG_CD]);

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

  // 대분류코드 조회
  const fetchLargeCodes = useCallback(async () => {
    // API 호출 로직 (실제 구현 필요)
//    console.log('대분류코드 조회:', largeSearch);

    // 대분류코드 조회조건 유효성 체크
    const isValid = validateFields('lrgSearch', validationRules.lrgSearch, largeSearch);
    if (!isValid) {
      return; // 오류 시 여기서 종료
    }

    setLoading(true);
    setError(null);
    try {
      largeSearch._DATA_ID = "LRG_CD_LIST";
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "BasLrgCd.selectList",
        userInfo: userInfo,
        params: {
          ...largeSearch,
//          OFFSET: page * limit,
//          LIMIT: limit
        }
      }]
//      console.log('대분류코드 조회 값 ::: ', arrReqData);

      // apiService의 callPostApi 함수 호출
      const resData = await callPostApi(arrReqData);
//      console.log('대분류코드 조회 결과 :::', resData);
      setLargeCodes(resData.find(item => item.LRG_CD_LIST)?.LRG_CD_LIST || []);
      setSelectedLarge(null);
      setNewLarge({
        LRG_CD: '',
        LRG_NM: '',
        USE_YN: 'Y'
      });
      resetSmallArea(); // 소분류코드 영역 초기화

    } catch (err) {
      console.error('대분류코드 조회 실패:', err);
      setError('대분류코드를 불러오는 중 오류가 발생했습니다.');
      setLargeCodes([]);
    } finally {
      setLoading(false);
    }
  }, [largeSearch, userInfo, validateFields, validationRules.lrgSearch, callPostApi, resetSmallArea]);

  // 소분류코드 조회
//  const fetchSmallCodes = useCallback(async () => {
  const fetchSmallCodes = async () => {
    if (!selectedLarge) return;
    // API 호출 로직 (실제 구현 필요)
//    console.log('소분류코드 조회:', selectedLarge, smallSearch);

    // 소분류코드 조회조건 유효성 체크
    const isValid = validateFields('smlSearch', validationRules.smlSearch, smallSearch);
    if (!isValid) {
      return; // 오류 시 여기서 종료
    }

    setLoading(true);
    setError(null);
    try {
      smallSearch._DATA_ID = "SML_CD_LIST";
      smallSearch.LRG_CD = selectedLarge.LRG_CD;
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "BasSmlCd.selectList",
        userInfo: userInfo,
        params: {
          ...smallSearch,
//          OFFSET: page * limit,
//          LIMIT: limit
        }
      }]

      // apiService의 callPostApi 함수 호출
      const resData = await callPostApi(arrReqData);
//      console.log('소분류코드 조회 결과 :::', resData);
      setSmallCodes(resData.find(item => item.SML_CD_LIST)?.SML_CD_LIST || []);
    } catch (err) {
      console.error('소분류코드 조회 실패:', err);
      setError('소분류코드를 불러오는 중 오류가 발생했습니다.');
      setSmallCodes([]);
    } finally {
      setLoading(false);
    }
//  }, [selectedLarge, userInfo, smallSearch, validateFields, validationRules.smlSearch]);
  };

  // 대분류코드 저장
  const handleSaveLargeCode = async () => {
//    if (selectedLarge) {
//      // 수정 로직
//      console.log('대분류코드 수정:', selectedLarge);
//    } else {
//      // 신규 등록 로직
//      console.log('대분류코드 신규:', newLarge);
//    }

    // 대분류코드 입력값 유효성 체크
    const isValid = validateFields('lrgCdInfo', validationRules.lrgCdInfo, selectedLarge || newLarge);
    if (!isValid) {
      return; // 오류 시 여기서 종료
    }

    // Confirm 다이얼로그 추가
    const isConfirmed = await confirmX({
      message: selectedLarge
                 ? '대분류코드를 수정하시겠습니까?'
                 : '대분류코드를 신규 등록하시겠습니까?',
      title: "대분류코드 저장",
      confirmText: "저장",
      cancelText: "취소"
    });
    if (!isConfirmed) {
      return; // 사용자가 취소하면 여기서 종료
    }

    const originalData = [...largeCodes];
    const dataToSave = selectedLarge || newLarge;

    try {
      setLoading(true);

      // 낙관적 업데이트
      if (selectedLarge) {
        setLargeCodes(largeCodes.map(item =>
          item.LRG_CD === dataToSave.LRG_CD ? dataToSave : item
        ));
      } else {
        setLargeCodes([...largeCodes, dataToSave]);
      }

      dataToSave._DATA_ID = (selectedLarge ? "LRG_CD_UPDATE" : "LRG_CD_INSERT");
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: (selectedLarge ? "BasLrgCd.update" : "BasLrgCd.insert"),
        userInfo: userInfo,
        paramsList: [dataToSave],
      }]
//      console.log('대분류코드 저장 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
//      const savedData = await callPostApi(arrReqData);
      await callPostApi(arrReqData);

      setLoading(false);
      setOpenLrg(false);
      await confirmX({
        title: "대분류코드 저장",
        message: "저장되었습니다",
        type: "success"
      });

      // 성공 시 정확한 데이터로 업데이트
      if (selectedLarge) {
        // 수정 후 리스트 업데이트
        setLargeCodes(largeCodes.map(item =>
          item.LRG_CD === dataToSave.LRG_CD ? dataToSave : item
        ));
      } else {
        // 신규 등록 후 리스트 업데이트
        setLargeCodes([...largeCodes.filter(item => item.LRG_CD !== dataToSave.LRG_CD), dataToSave]);
        setNewLarge({
          LRG_CD: '',
          LRG_NM: '',
          USE_YN: 'Y'
        });

        // 저장 후 리스트 재조회
        fetchLargeCodes();
      }

    } catch (err) {
      // 실패 시 롤백
      setLargeCodes(originalData);
      console.error('대분류코드 저장 실패:', err);
      setError('대분류코드 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setOpenLrg(false);
    }
  };

  // 소분류코드 저장
  const handleSaveSmallCode = async () => {
//    if (selectedSmall) {
//      // 수정 로직
//      console.log('소분류코드 수정:', selectedSmall);
//    } else {
//      // 신규 등록 로직
//      console.log('소분류코드 신규:', newSmall);
//    }

    // 소분류코드 입력값 유효성 체크
    const isValid = validateFields('smlCdInfo', validationRules.smlCdInfo, selectedSmall || newSmall);
    if (!isValid) {
      return; // 오류 시 여기서 종료
    }

    // Confirm 다이얼로그 추가
    const isConfirmed = await confirmX({
      message: selectedLarge
                 ? '소분류코드를 수정하시겠습니까?'
                 : '소분류코드를 신규 등록하시겠습니까?',
      title: "소분류코드 저장",
      confirmText: "저장",
      cancelText: "취소"
    });
    if (!isConfirmed) {
      return; // 사용자가 취소하면 여기서 종료
    }

    const originalData = [...smallCodes];
    const dataToSave = selectedSmall || newSmall;

    try {
      setLoading(true);

      // 낙관적 업데이트
      if (selectedSmall) {
        setSmallCodes(smallCodes.map(item =>
          item.LRG_CD === dataToSave.LRG_CD && item.SML_CD === dataToSave.SML_CD ? dataToSave : item
        ));
      } else {
        setSmallCodes([...smallCodes.filter(item => item.LRG_CD !== dataToSave.LRG_CD && item.SML_CD !== dataToSave.SML_CD), dataToSave]);
      }

      dataToSave._DATA_ID = (selectedSmall ? "SML_CD_UPDATE" : "SML_CD_INSERT");
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: (selectedSmall ? "BasSmlCd.update" : "BasSmlCd.insert"),
        userInfo: userInfo,
        paramsList: [dataToSave],
      }]
//      console.log('소분류코드 저장 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
//      const savedData = await callPostApi(arrReqData);
      await callPostApi(arrReqData);

      setLoading(false);
      setOpenSml(false);
      await confirmX({
        title: "소분류코드 저장",
        message: "저장되었습니다",
        type: "success"
      });

      if (selectedSmall) {
        // 수정 후 리스트 업데이트
        setSmallCodes(smallCodes.map(item =>
          item.LRG_CD === dataToSave.LRG_CD && item.SML_CD === dataToSave.SML_CD ? dataToSave : item
        ));
      } else {
        // 신규 등록 후 리스트 업데이트
        setSmallCodes([...smallCodes.filter(item => item.LRG_CD !== dataToSave.LRG_CD && item.SML_CD !== dataToSave.SML_CD), dataToSave]);
        setNewSmall({
          LRG_CD: selectedLarge?.LRG_CD || '',
          SML_CD: '',
          SML_NM: '',
          SRT_NO: 0,
          USE_YN: 'Y'
        });

        // 저장 후 리스트 재조회
        fetchSmallCodes();
      }

    } catch (err) {
      // 실패 시 롤백
      setSmallCodes(originalData);
      console.error('소분류코드 저장 실패:', err);
      setError('소분류코드 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setOpenSml(false);
    }
  };

  // 대분류코드 삭제
  const handleDeleteLargeCode = async () => {
    if (!selectedLarge) return;
//    console.log('대분류코드 삭제:', selectedLarge);

    // Confirm 다이얼로그 추가
    const isConfirmed = await confirmX({
      message: '대분류코드를 삭제하시겠습니까?',
      title: "대분류코드 삭제",
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
        sqlId: "BasLrgCd.delete",
        params: selectedLarge
      }]
//      console.log('대분류코드 삭제 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
      await callPostApi(arrReqData);

      setLoading(false);
      setOpenLrg(false);
      await confirmX({
        title: "대분류코드 삭제",
        message: "삭제되었습니다",
        type: "success"
      });

      // 삭제 후 리스트 업데이트
//      setLargeCodes(largeCodes.filter(item => item.LRG_CD !== selectedLarge.LRG_CD));
      setSelectedLarge(null);
      setNewLarge({
        LRG_CD: '',
        LRG_NM: '',
        USE_YN: 'Y'
      });

      // 삭제 후 리스트 재조회
      fetchLargeCodes();

    } catch (err) {
      console.error('대분류코드 삭제 실패:', err);
      setError('대분류코드 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setOpenLrg(false);
    }
  };

  // 소분류코드 삭제
  const handleDeleteSmallCode = async () => {
    if (!selectedSmall) return;
//    console.log('소분류코드 삭제:', selectedSmall);

    // Confirm 다이얼로그 추가
    const isConfirmed = await confirmX({
      message: '소분류코드를 삭제하시겠습니까?',
      title: "소분류코드 삭제",
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
        sqlId: "BasSmlCd.delete",
        params: selectedSmall
      }]
//      console.log('소분류코드 삭제 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
      await callPostApi(arrReqData);

      setLoading(false);
      setOpenSml(false);
      await confirmX({
        title: "소분류코드 삭제",
        message: "삭제되었습니다",
        type: "success"
      });

      // 삭제 후 리스트 업데이트
//      setSmallCodes(smallCodes.filter(item => item.LRG_CD !== selectedSmall.LRG_CD && item.SML_CD !== selectedSmall.SML_CD));
      setSelectedSmall(null);
      setNewSmall({
        LRG_CD: selectedLarge?.LRG_CD || '',
        SML_CD: '',
        SML_NM: '',
        SRT_NO: 0,
        USE_YN: 'Y'
      });

      // 삭제 후 리스트 재조회
      fetchSmallCodes();

    } catch (err) {
      console.error('소분류코드 삭제 실패:', err);
      setError('소분류코드 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setOpenSml(false);
    }
  };


  // 화면 오픈 시 처리
  useEffect(() => {
    if (!isAuthenticated) handleLogin();
    // 공통코드 조회
    fetchCommonCodes();

    // 상세정보 컴포넌트 비활성
    setIsLrgInfoDisabled(false);
    setIsSmlInfoDisabled(false);
  }, [isAuthenticated, handleLogin, fetchCommonCodes]);


  // 대분류코드 선택 시 소분류코드 조회
  useEffect(() => {
    if (selectedLarge?.LRG_CD) {
      setNewSmall(prev => ({ ...prev, LRG_CD: selectedLarge.LRG_CD }));
      fetchSmallCodes();
    }
  }, [selectedLarge?.LRG_CD]);


  return (
    <div className="common-code-container">

      <h5 className="main-title">공통코드관리</h5>

      <div className="code-management-container">
        {/* 좌측 영역 - 대분류코드 관리 */}
        <div className="left-section">
          <div className="paper" style={{ height: 'calc(100% - 12px)' }}>
            {/* 상단 - 조회조건 영역 */}
            <div className="search-section">
              <h6 className="section-title">대분류코드 조회</h6>
              <div className="search-grid">

                {/* 첫 번째 행 */}
                <div className="search-row">
                  <div className="search-field">
                    <div className="title-area">
                      <label>대분류코드</label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.lrgSearch.LRG_CD}
                        type="text"
                        value={largeSearch.LRG_CD}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
                          setLargeSearch({ ...largeSearch, LRG_CD: value });
                        }}
                        onKeyPress={(e) => {
                          const charCode = e.charCode;
                          if ( charCode === 13 ) { // 엔터 이벤트
                            e.preventDefault();
                            fetchLargeCodes();
                          }
                        }}
                        pattern="[a-zA-Z0-9_]*"
                        maxLength="30"
                        className="form-input uppercase-input"
                      />
                    </div>
                    <div className="title-area">
                      <label>대분류명</label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.lrgSearch.LRG_NM}
                        type="text"
                        value={largeSearch.LRG_NM}
                        onChange={(e) => setLargeSearch({ ...largeSearch, LRG_NM: e.target.value })}
                        onKeyPress={(e) => {
                          const charCode = e.charCode;
                          if ( charCode === 13 ) { // 엔터 이벤트
                            e.preventDefault();
                            fetchLargeCodes();
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
                        ref={fieldRefs.lrgSearch.USE_YN}
                        value={largeSearch.USE_YN}
                        onChange={(e) => setLargeSearch({ ...largeSearch, USE_YN: e.target.value })}
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
                        setIsLrgInfoDisabled(false);
                        resetLargeArea();   // 대분류코드 영역 초기화
                        resetSmallArea();   // 소분류코드 영역 초기화
                      }}
                      className="reset-btn"
                    >
                      초기화
                    </button>
                    <button
                      onClick={(e) => {
                        setIsLrgInfoDisabled(false);
                        fetchLargeCodes();
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
                ref={apiLrgGrid}
                theme={agGridTheme}
                rowData={largeCodes}
                columnDefs={[
                  {
                    field: 'LRG_CD',
                    headerName: '대분류코드',
                    width: 256,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType: 'text',
                  },
                  {
                    field: 'LRG_NM',
                    headerName: '대분류명',
                    width: 256,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType: 'text',
                  },
                  {
                    field: 'USE_YN',
                    headerName: '사용여부',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'center' },
                    /*editable: true,*/
                    cellDataType : 'object',
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                      values: setGridComboVal(commonCodes, 'USE_YN_A').map((opt) => opt.name), // 셀렉트 박스에 표시할 label 목록
                    },
                    valueFormatter: (params) => getLabelFromId(setGridComboVal(commonCodes, 'USE_YN_A'), params.value), // id → name 표시
                    valueParser: (name) => getIdFromLabel(setGridComboVal(commonCodes, 'USE_YN_A'), name), // name → id 저장
                    options: [...setGridComboVal(commonCodes, 'USE_YN_A')],    // 사용자정의로 셋팅
                    /*singleClickEdit: true,*/
                  }
                ]}
                rowSelection="single" // 또는 "multiple"
                onRowDoubleClicked={handleLrgRowDoubleClick}
                onSelectionChanged={onLrgGridSelectionChanged} // ✅ 이벤트 연결
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
                        setOpenLrg(true);
                        setIsLrgInfoDisabled(true);
                        setSelectedLarge(null);
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
        {/* 좌측 영역 - 대분류코드 관리 */}


        {/* 우측 영역 - 소분류코드 관리 */}
        <div className="right-section">
          <div className="paper" style={{ height: 'calc(100% - 12px)' }}>
            {/* 상단 - 조회조건 영역 */}
            <div className="search-section">
              <h6 className="section-title">소분류코드 조회</h6>
              <div className="search-grid">

                {/* 첫 번째 행 */}
                <div className="search-row">
                  <div className="search-field">
                    <div className="title-area">
                      <label>소분류코드</label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.smlSearch.SML_CD}
                        type="text"
                        value={smallSearch.SML_CD}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
                          setSmallSearch({ ...smallSearch, SML_CD: value });
                        }}
                        onKeyPress={(e) => {
                          const charCode = e.charCode;
                          if ( charCode === 13 ) { // 엔터 이벤트
                            e.preventDefault();
                            fetchSmallCodes();
                          }
                        }}
                        pattern="[a-zA-Z0-9_]*"
                        maxLength="30"
                        className="form-input uppercase-input"
                      />
                    </div>
                    <div className="title-area">
                      <label>소분류명</label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.smlSearch.SML_NM}
                        type="text"
                        value={smallSearch.SML_NM}
                        onChange={(e) => setSmallSearch({ ...smallSearch, SML_NM: e.target.value })}
                        onKeyPress={(e) => {
                          const charCode = e.charCode;
                          if ( charCode === 13 ) { // 엔터 이벤트
                            e.preventDefault();
                            fetchSmallCodes();
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
                        ref={fieldRefs.smlSearch.USE_YN}
                        value={smallSearch.USE_YN}
                        onChange={(e) => setSmallSearch({ ...smallSearch, USE_YN: e.target.value })}
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
                        setIsSmlInfoDisabled(false);
                        resetSmallArea();
                      }}
                      className="reset-btn"
                    >
                      초기화
                    </button>
                    <button
                      onClick={(e) => {
                        setIsSmlInfoDisabled(false);
                        fetchSmallCodes();
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
                ref={apiSmlGrid}
                theme={agGridTheme}
                rowData={smallCodes}
                columnDefs={[
                  /*{ field: 'LRG_CD', headerName: '대분류코드',  align: "left", width: 166 },*/
                  {
                    field: 'SML_CD',
                    headerName: '소분류코드',
                    width: 206,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    editor: 'text',
                  },
                  {
                    field: 'SML_NM',
                    headerName: '소분류명',
                    width: 206,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    editor: 'text',
                  },
                  {
                    field: 'SRT_NO',
                    headerName: '정렬순서',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    editor: 'text',
                  },
                  {
                    field: 'USE_YN',
                    headerName: '사용여부',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'center' },
                    /*editable: true,*/
                    cellDataType : 'object',
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                      values: setGridComboVal(commonCodes, 'USE_YN_A').map((opt) => opt.name), // 셀렉트 박스에 표시할 label 목록
                    },
                    valueFormatter: (params) => getLabelFromId(setGridComboVal(commonCodes, 'USE_YN_A'), params.value), // id → name 표시
                    valueParser: (name) => getIdFromLabel(setGridComboVal(commonCodes, 'USE_YN_A'), name), // name → id 저장
                    options: [...setGridComboVal(commonCodes, 'USE_YN_A')],    // 사용자정의로 셋팅
                    /*singleClickEdit: true,*/
                  },
                ]}
                rowSelection="single" // 또는 "multiple"
                onRowDoubleClicked={handleSmlRowDoubleClick}
                /*onSelectionChanged={onSmlGridSelectionChanged} // ✅ 이벤트 연결*/
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
                        setOpenSml(true);
                        setIsSmlInfoDisabled(true);
                        setSelectedSmall(null);
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
        {/* 우측 영역 - 소분류코드 관리 */}



        {/* MUI 모달 팝업 */}
        {/*<Modal open={open} onClose={handleClose}>*/}
        <Modal open={openLrg || openSml }>
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

            {/*레이어팝업 - 대분류 상세정보 영역 */}
            <div className="detail-section" style={{ display: openLrg ? 'block' : 'none' }}>
              <h6 className="section-title">대분류코드 상세정보</h6>
              <div className="detail-grid">

                {/* 첫 번째 행 */}
                <div className="detail-row">
                  <div className="detail-field">
                    <div className="title-area">
                      <label>대분류코드 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.lrgCdInfo.LRG_CD}
                        type="text"
                        value={selectedLarge ? selectedLarge.LRG_CD : newLarge.LRG_CD}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
                          selectedLarge
                            ? setSelectedLarge({ ...selectedLarge, LRG_CD: value })
                            : setNewLarge({ ...newLarge, LRG_CD: value });
                        }}
                        pattern="[a-zA-Z0-9_]*"
                        maxLength="30"
                        className="form-input uppercase-input required"
                        disabled={!isLrgInfoDisabled || selectedLarge}
                      />
                    </div>
                    <div className="title-area">
                      <label>대분류명 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.lrgCdInfo.LRG_NM}
                        type="text"
                        value={selectedLarge ? selectedLarge.LRG_NM : newLarge.LRG_NM}
                        onChange={(e) =>
                          selectedLarge
                            ? setSelectedLarge({ ...selectedLarge, LRG_NM: e.target.value })
                            : setNewLarge({ ...newLarge, LRG_NM: e.target.value })
                        }
                        maxLength="30"
                        className="form-input required"
                        disabled={!isLrgInfoDisabled}
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
                        ref={fieldRefs.lrgCdInfo.USE_YN}
                        value={selectedLarge ? selectedLarge.USE_YN : newLarge.USE_YN}
                        onChange={(e) =>
                          selectedLarge
                            ? setSelectedLarge({ ...selectedLarge, USE_YN: e.target.value })
                            : setNewLarge({ ...newLarge, USE_YN: e.target.value })
                        }
                        className="form-select required"
                        disabled={!isLrgInfoDisabled}
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
                      onClick={handleSaveLargeCode}
                      disabled={loading}
                      className="save-btn"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleDeleteLargeCode}
                      disabled={loading || !selectedLarge}
                      className="delete-btn"
                    >
                      삭제
                    </button>
                    <button
                      onClick={handleLrgClose}
                      className="close-btn"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>    {/* 대분류 상세정보 영역 */} {/*<div className="detail-section" style={{ display: openLrg ? 'block' : 'none' }}>*/}


            {/* 레이어팝업 - 소분류 상세정보 영역 */}
            <div className="detail-section" style={{ display: openSml ? 'block' : 'none' }}>
              <h6 className="section-title">소분류코드 상세정보</h6>
              <div className="detail-grid">

                {/* 첫 번째 행 */}
                <div className="detail-row">
                  <div className="detail-field">
                    <div className="title-area">
                      <label>대분류코드 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.smlCdInfo.LRG_CD}
                        type="text"
                        value={selectedSmall ? selectedSmall.LRG_CD : newSmall.LRG_CD}
                        onChange={(e) =>
                          selectedSmall
                            ? setSelectedSmall({ ...selectedSmall, LRG_CD: e.target.value })
                            : setNewSmall({ ...newSmall, LRG_CD: e.target.value })
                        }
                        className="form-input required"
                        disabled
                      />
                    </div>
                    <div className="title-area">
                      <label>소분류코드 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.smlCdInfo.SML_CD}
                        type="text"
                        value={selectedSmall ? selectedSmall.SML_CD : newSmall.SML_CD}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
                          selectedSmall
                            ? setSelectedSmall({ ...selectedSmall, SML_CD: value })
                            : setNewSmall({ ...newSmall, SML_CD: value });
                        }}
                        pattern="[a-zA-Z0-9_]*"
                        maxLength="30"
                        className="form-input uppercase-input required"
                        disabled={!isSmlInfoDisabled}
                      />
                    </div>
                  </div>
                </div>

                {/* 두 번째 행 */}
                <div className="detail-row">
                  <div className="detail-field">
                    <div className="title-area">
                      <label>소분류명 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.smlCdInfo.SML_NM}
                        type="text"
                        value={selectedSmall ? selectedSmall.SML_NM : newSmall.SML_NM}
                        onChange={(e) =>
                          selectedSmall
                            ? setSelectedSmall({ ...selectedSmall, SML_NM: e.target.value })
                            : setNewSmall({ ...newSmall, SML_NM: e.target.value })
                        }
                        maxLength="30"
                        className="form-input required"
                        disabled={!isSmlInfoDisabled}
                      />
                    </div>
                    <div className="title-area">
                      <label>정렬순서 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <input
                        ref={fieldRefs.smlCdInfo.SRT_NO}
                        type="number"
                        value={selectedSmall ? selectedSmall.SRT_NO : newSmall.SRT_NO}
                        onChange={(e) =>
                          selectedSmall
                            ? setSelectedSmall({ ...selectedSmall, SRT_NO: e.target.value })
                            : setNewSmall({ ...newSmall, SRT_NO: e.target.value })
                        }
                        className="form-input required"
                        disabled={!isSmlInfoDisabled}
                      />
                    </div>
                  </div>
                </div>

                {/* 세 번째 행 */}
                <div className="detail-row">
                  <div className="detail-field">
                    <div className="title-area">
                      <label>사용여부 <span className="required-mark">*</span></label>
                    </div>
                    <div className="component-area">
                      <select
                        ref={fieldRefs.smlCdInfo.USE_YN}
                        value={selectedSmall ? selectedSmall.USE_YN : newSmall.USE_YN}
                        onChange={(e) =>
                          selectedSmall
                            ? setSelectedSmall({ ...selectedSmall, USE_YN: e.target.value })
                            : setNewSmall({ ...newSmall, USE_YN: e.target.value })
                        }
                        className="form-select required"
                        disabled={!isSmlInfoDisabled}
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
                      onClick={handleSaveSmallCode}
                      disabled={loading}
                      className="save-btn"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleDeleteSmallCode}
                      disabled={loading || !selectedSmall}
                      className="delete-btn"
                    >
                      삭제
                    </button>
                    <button
                      onClick={handleSmlClose}
                      className="close-btn"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>    {/* 소분류 상세정보 영역 */} {/*<div className="detail-section" style={{ display: openSml ? 'block' : 'none' }}>*/}


          </Box>
        </Modal>



      </div>
    </div>
  );
};

export default CommonCodeMgmt;
