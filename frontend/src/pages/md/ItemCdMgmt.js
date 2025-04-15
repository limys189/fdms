/*
  **************************************************************
  * 파일명    : ItemCdMgmt.js
  * 화면명    : 품목관리
  * 기능      : 품목코드를 관리한다.
  * 생성자    : LIMYS
  * 생성일자  : 2025-04-09
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
CREATE TABLE TB_ITM_CD (
    CO_CD VARCHAR(10) NOT NULL COMMENT '회사코드',
	ITEM_NO VARCHAR(15) NOT NULL COMMENT '품목번호',
	ITEM_NM VARCHAR(300) NULL COMMENT '품목명',
	ITEM_ABBR VARCHAR(300) NULL COMMENT '품목약어명',
	LAST_PUR_DT VARCHAR(8) NULL COMMENT '최종매입일자',
	UNIT_GCD VARCHAR(10) NULL COMMENT '단위구분코드',
	BOX_QTY BIGINT NULL COMMENT '박스수량',
	CUST_CD VARCHAR(15) NULL COMMENT '거래처코드',
	PUR_PRC DECIMAL(20,3) NULL COMMENT '매입단가',
	OUT_PRC DECIMAL(20,3) NULL COMMENT '출고단가',
	SAL_PRC DECIMAL(20,3) NULL COMMENT '판매단가',
	ITEM_LOC_CD VARCHAR(10) NULL COMMENT '품목위치코드',
	STK_QTY BIGINT NULL COMMENT '재고수량',
	STK_YN VARCHAR(1) NULL COMMENT '재고여부',
	STK_ADJ_DT VARCHAR(8) NULL COMMENT '재고조정일자',
	TAX_YN VARCHAR(1) NULL COMMENT '과세여부',
	PRC_APLY_GCD VARCHAR(1) NULL COMMENT '단가적용구분코드',
	ITEM_ALIAS VARCHAR(300) NULL COMMENT '품목별칭명',
	STK_PER BIGINT NULL COMMENT '재고기간',
	ORD_PER BIGINT NULL COMMENT '발주기간',
	PUR_PER BIGINT NULL COMMENT '매입기간',
	EXP_PER BIGINT NULL COMMENT '유통기한',
	SAL_STOP_YN VARCHAR(1) NULL COMMENT '판매중지여부',
	OUT_MRGN_RT DECIMAL(18,3) NULL COMMENT '출고마진율',
	DC_MRGN_RT DECIMAL(18,3) NULL COMMENT '할인마진율',
	SAL_MRGN_RT DECIMAL(18,3) NULL COMMENT '판매마진율',
	ITEM_GRP_NM VARCHAR(300) NULL COMMENT '품목그룹명',
	BARCODE VARCHAR(20) NULL COMMENT '바코드',
	BARCODE_SUB VARCHAR(20) NULL COMMENT '바코드SUB',
	REG_DTM DATETIME NOT NULL COMMENT '등록일시',
	REGR_ID VARCHAR(20) NOT NULL COMMENT '등록자ID',
	UPD_DTM DATETIME NOT NULL COMMENT '수정일시',
	UPDR_ID VARCHAR(20) NOT NULL COMMENT '수정자ID',
	CONSTRAINT PK_ITM_CD PRIMARY KEY (CO_CD,ITEM_NO)
) COMMENT = '품목코드정보';
*/

const ItemMgmt = () => {

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
    formatByType,               // 포맷타입
  } = useContext(GlobalContext);


  // 각 입력 필드에 대한 ref 생성
  const fieldRefs = {
    /* 품목 조회조건 */
    itemCdSearch: {
      ITEM_NM: useRef(null),
      ITEM_ABBR: useRef(null),
      SAL_STOP_YN: useRef(null),
      CUST_NM: useRef(null),
    },
    /* 품목 입력항목 */
    itemCdInfo: {
      ITEM_NO: useRef(null),
      ITEM_NM: useRef(null),
      ITEM_ABBR: useRef(null),
      LAST_PUR_DT: useRef(null),
      UNIT_GCD: useRef(null),
      BOX_QTY: useRef(null),
      CUST_CD: useRef(null),
      PUR_PRC: useRef(null),
      OUT_PRC: useRef(null),
      SAL_PRC: useRef(null),
      ITEM_LOC_CD: useRef(null),
      STK_QTY: useRef(null),
      STK_YN: useRef(null),
      STK_ADJ_DT: useRef(null),
      TAX_YN: useRef(null),
      PRC_APLY_GCD: useRef(null),
      ITEM_ALIAS: useRef(null),
      STK_PER: useRef(null),
      ORD_PER: useRef(null),
      PUR_PER: useRef(null),
      EXP_PER: useRef(null),
      SAL_STOP_YN: useRef(null),
      SAL_STOP_DTM: useRef(null),
      OUT_MRGN_RT: useRef(null),
      DC_MRGN_RT: useRef(null),
      SAL_MRGN_RT: useRef(null),
      ITEM_GRP_NM: useRef(null),
      BARCODE: useRef(null),
      BARCODE_SUB: useRef(null),
    },
  };


  // 공통코드 상태
//  const [gridUNIT_GCD_A] = useState([]);         // 그리드에서 사용할 사용여부 콤보 옵션
  const [commonCodes, setCommonCodes] = useState([]);
  const [codeSearch] = useState([
//    {_DATA_ID: 'USE_YN_A', LRG_CD: 'USE_YN', CODE_NM: '사용여부', _OPTIONS: 'A'},  // 사용여부, 옵션: 전체
//    {_DATA_ID: 'USE_YN_N', LRG_CD: 'USE_YN', CODE_NM: '사용여부', _OPTIONS: ''},  // 사용여부, 옵션:
    {_DATA_ID: 'UNIT_GCD_A'    , LRG_CD: 'UNIT_GCD'    , CODE_NM: '단위구분코드', _OPTIONS: 'A'},  // 단위구분코드, 옵션: 전체
    {_DATA_ID: 'UNIT_GCD_B'    , LRG_CD: 'UNIT_GCD'    , CODE_NM: '단위구분코드', _OPTIONS: 'B'},  // 단위구분코드, 옵션: ''
    {_DATA_ID: 'ITEM_LOC_CD_B' , LRG_CD: 'ITEM_LOC_CD' , CODE_NM: '창고위치코드', _OPTIONS: 'B'},  // 창고위치코드, 옵션: ''
    {_DATA_ID: 'TAX_YN_A'      , LRG_CD: 'TAX_YN'      , CODE_NM: '과세여부'   , _OPTIONS: 'A'},  // 과세여부, 옵션: 전체
    {_DATA_ID: 'TAX_YN_N'      , LRG_CD: 'TAX_YN'      , CODE_NM: '과세여부'   , _OPTIONS: ''},  // 과세여부, 옵션:
    {_DATA_ID: 'STK_YN_N'      , LRG_CD: 'STK_YN'      , CODE_NM: '재고여부'   , _OPTIONS: ''},  // 재고여부, 옵션:
    {_DATA_ID: 'PRC_APLY_GCD_A', LRG_CD: 'PRC_APLY_GCD', CODE_NM: '단가적용구분', _OPTIONS: 'A'},  // 단가적용구분, 옵션: 전체
    {_DATA_ID: 'PRC_APLY_GCD_S', LRG_CD: 'PRC_APLY_GCD', CODE_NM: '단가적용구분', _OPTIONS: 'S'},  // 단가적용구분, 옵션: 선택
    {_DATA_ID: 'SAL_STOP_YN_A' , LRG_CD: 'SAL_STOP_YN' , CODE_NM: '판매중지여부', _OPTIONS: 'A'},  // 판매중지여부, 옵션: 전체
    {_DATA_ID: 'SAL_STOP_YN_N' , LRG_CD: 'SAL_STOP_YN' , CODE_NM: '판매중지여부', _OPTIONS: ''},  // 판매중지여부, 옵션:
//    {_DATA_ID: 'STK_YN_A'      , LRG_CD: 'STK_YN'      , CODE_NM: '재고여부'   , _OPTIONS: 'A'},  // 재고여부, 옵션: 전체
  ]);

  // 품목코드 상태
  const [itemCodes, setItemCodes] = useState([]);
  const [itemCdSearch, setItemSearch] = useState({
    _DATA_ID   : '',
    ITEM_NM    : '',
    ITEM_ABBR  : '',
    SAL_STOP_YN: '',
    CUST_NM    : '',
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    ITEM_NO: '',
    ITEM_NM: '',
    ITEM_ABBR: '',
    LAST_PUR_DT: '',
    UNIT_GCD: '',
    BOX_QTY: 0,
    CUST_CD: '',
    PUR_PRC: 0,
    OUT_PRC: 0,
    SAL_PRC: 0,
    ITEM_LOC_CD: '',
    STK_QTY: 0,
    STK_YN: 'Y',
    STK_ADJ_DT: '',
    TAX_YN: '',
    PRC_APLY_GCD: '',
    ITEM_ALIAS: '',
    STK_PER: 0,
    ORD_PER: 0,
    PUR_PER: 0,
    EXP_PER: 0,
    SAL_STOP_YN: 'N',
    OUT_MRGN_RT: 0,
    DC_MRGN_RT: 0,
    SAL_MRGN_RT: 0,
    ITEM_GRP_NM: '',
    BARCODE: '',
    BARCODE_SUB: '',
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
    setSelectedItem({ ...event.data }); // 원본 보호용 복사
    setOpen(true);
    setIsDisabled(true);
  };

  const handleClose = () => setOpen(false);

/*
  const handleChange = (e) => {
    setSelectedItem((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log("저장된 데이터:", selectedItem);
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
    setSelectedItem(selectedData[0]);
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
      setItemCodes((prev) => {
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
    /* 품목 조회조건 */
    itemCdSearch: {
      ITEM_NM: {
        required: false,
        koreanOnly: false,
        minLength: 2,
        minBytes: 6,
        minLengthMessage: '품목명은 최소 6바이트(한글 2자) 이상 입력하세요.'
      },
      ITEM_ABBR: {
        required: false,
        koreanOnly: false,
        minLength: 1,
        minBytes: 3,
        minBytesMessage: '품목약어는 최소 3바이트(한글 1자) 이상 입력하세요.'
      },
      CUST_NM: {
        required: false,
        koreanOnly: false,
        minLength: 2,
        minBytes: 6,
        minBytesMessage: '매입처명은 최소 6바이트(한글 2자) 이상 입력하세요.'
      },
      SAL_STOP_YN: {
      },
    },
    /* 품목 입력항목 */
    itemCdInfo: {
/*
      LOC_CD: {
        required: true,
        upperCaseOnly: true,
        maxBytes: 10,
        requiredMessage: '품목코드는 필수 입력 항목입니다.'
      },
      LOC_NM: {
        required: false,
        koreanOnly: false,
        minLength: 2,
        minBytes: 6,
        maxBytes: 30,
        requiredMessage: '품목명은 필수 입력 항목입니다.',
        minBytesMessage: '품목명은 최소 6바이트(한글 2자) 이상 입력하세요.'
      },
      USE_YN: {
        required: true,
        maxBytes: 1,
        requiredMessage: '사용여부는 필수 입력 항목입니다.'
      },
*/
    },
  };

  // 품목코드 영역 초기화
  const resetItemArea = () => {
    setItemSearch({
      ITEM_NM    : '',
      ITEM_ABBR  : '',
      CUST_NM    : '',
      SAL_STOP_YN: ''
    });
    setItemCodes([]);
    setSelectedItem(null);
    setNewItem({
      ITEM_NO: '',
      ITEM_NM: '',
      ITEM_ABBR: '',
      LAST_PUR_DT: '',
      UNIT_GCD: '',
      BOX_QTY: 0,
      CUST_CD: '',
      PUR_PRC: 0,
      OUT_PRC: 0,
      SAL_PRC: 0,
      ITEM_LOC_CD: '',
      STK_QTY: 0,
      STK_YN: 'Y',
      STK_ADJ_DT: '',
      TAX_YN: '',
      PRC_APLY_GCD: '',
      ITEM_ALIAS: '',
      STK_PER: 0,
      ORD_PER: 0,
      PUR_PER: 0,
      EXP_PER: 0,
      SAL_STOP_YN: 'N',
      OUT_MRGN_RT: 0,
      DC_MRGN_RT: 0,
      SAL_MRGN_RT: 0,
      ITEM_GRP_NM: '',
      BARCODE: '',
      BARCODE_SUB: '',
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

  // 품목코드 조회
  const fetchItemCodes = useCallback(async () => {
    // API 호출 로직 (실제 구현 필요)
    console.log('품목코드 조회:', itemCdSearch);

    // 품목코드 조회조건 유효성 체크
    const isValid = validateFields('itemCdSearch', validationRules.itemCdSearch, itemCdSearch);
    if (!isValid) {
      return; // 오류 시 여기서 종료
    }

    setLoading(true);
    setError(null);
    try {
      itemCdSearch._DATA_ID = "ITEM_CD_LIST";
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "ItemCdMgmt.selectList",
        userInfo: userInfo,
        params: {
          ...itemCdSearch,
//          OFFSET: page * limit,
//          LIMIT: limit
        }
      }]
//      console.log('품목코드 조회 값 ::: ', arrReqData);

      // apiService의 callPostApi 함수 호출
      const resData = await callPostApi(arrReqData);
//      console.log('품목코드 조회 결과 :::', resData);
      setItemCodes(resData.find(item => item.ITEM_CD_LIST)?.ITEM_CD_LIST || []);
      setSelectedItem(null);
      setNewItem({
        ITEM_NO: '',
        ITEM_NM: '',
        ITEM_ABBR: '',
        LAST_PUR_DT: '',
        UNIT_GCD: '',
        BOX_QTY: 0,
        CUST_CD: '',
        PUR_PRC: 0,
        OUT_PRC: 0,
        SAL_PRC: 0,
        ITEM_LOC_CD: '',
        STK_QTY: 0,
        STK_YN: 'Y',
        STK_ADJ_DT: '',
        TAX_YN: '',
        PRC_APLY_GCD: '',
        ITEM_ALIAS: '',
        STK_PER: 0,
        ORD_PER: 0,
        PUR_PER: 0,
        EXP_PER: 0,
        SAL_STOP_YN: 'N',
        OUT_MRGN_RT: 0,
        DC_MRGN_RT: 0,
        SAL_MRGN_RT: 0,
        ITEM_GRP_NM: '',
        BARCODE: '',
        BARCODE_SUB: '',
      });

    } catch (err) {
      console.error('품목코드 조회 실패:', err);
      setError('품목코드를 불러오는 중 오류가 발생했습니다.');
      setItemCodes([]);
    } finally {
      setLoading(false);
    }
  }, [itemCdSearch, userInfo, validateFields, validationRules.itemCdSearch, callPostApi]);

  // 품목코드 저장
  const handleSaveItemCode = async () => {
//    if (selectedItem) {
//      // 수정 로직
//      console.log('품목코드 수정:', selectedItem);
//    } else {
//      // 신규 등록 로직
//      console.log('품목코드 신규:', newItem);
//    }

    // 품목코드 입력값 유효성 체크
    const isValid = validateFields('itemCdInfo', validationRules.itemCdInfo, selectedItem || newItem);
    if (!isValid) {
      return; // 오류 시 여기서 종료
    }

    // Confirm 다이얼로그 추가
    const isConfirmed = await confirmX({
      message: selectedItem
                 ? '품목코드를 수정하시겠습니까?'
                 : '품목코드를 신규 등록하시겠습니까?',
      title: "품목코드 저장",
      confirmText: "저장",
      cancelText: "취소"
    });
    if (!isConfirmed) {
      return; // 사용자가 취소하면 여기서 종료
    }

    const originalData = [...itemCodes];
    const dataToSave = selectedItem || newItem;

    try {
      setLoading(true);

      // 낙관적 업데이트
      if (selectedItem) {
        setItemCodes(itemCodes.map(item =>
          item.LOC_CD === dataToSave.LOC_CD ? dataToSave : item
        ));
      } else {
        setItemCodes([...itemCodes, dataToSave]);
      }

      dataToSave._DATA_ID = (selectedItem ? "ITEM_CD_UPDATE" : "ITEM_CD_INSERT");
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: (selectedItem ? "ItemCdMgmt.updateItemCd" : "ItemCdMgmt.insertItemCd"),
        userInfo: userInfo,
        paramsList: [dataToSave],
      }]
//      console.log('품목코드 저장 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
//      const savedData = await callPostApi(arrReqData);
      await callPostApi(arrReqData);

      setLoading(false);
      await confirmX({
        title: "품목코드 저장",
        message: "저장되었습니다",
        type: "success"
      });

      // 성공 시 정확한 데이터로 업데이트
      if (selectedItem) {
        // 수정 후 리스트 업데이트
        setItemCodes(itemCodes.map(item =>
          item.LOC_CD === dataToSave.LOC_CD ? dataToSave : item
        ));
      } else {
        // 신규 등록 후 리스트 업데이트
        setItemCodes([...itemCodes.filter(item => item.LOC_CD !== dataToSave.LOC_CD), dataToSave]);
        setNewItem({
          ITEM_NO: '',
          ITEM_NM: '',
          ITEM_ABBR: '',
          LAST_PUR_DT: '',
          UNIT_GCD: '',
          BOX_QTY: 0,
          CUST_CD: '',
          PUR_PRC: 0,
          OUT_PRC: 0,
          SAL_PRC: 0,
          ITEM_LOC_CD: '',
          STK_QTY: 0,
          STK_YN: 'Y',
          STK_ADJ_DT: '',
          TAX_YN: '',
          PRC_APLY_GCD: '',
          ITEM_ALIAS: '',
          STK_PER: 0,
          ORD_PER: 0,
          PUR_PER: 0,
          EXP_PER: 0,
          SAL_STOP_YN: 'N',
          OUT_MRGN_RT: 0,
          DC_MRGN_RT: 0,
          SAL_MRGN_RT: 0,
          ITEM_GRP_NM: '',
          BARCODE: '',
          BARCODE_SUB: '',
        });

        // 저장 후 리스트 재조회
        fetchItemCodes();
      }

    } catch (err) {
      // 실패 시 롤백
      setItemCodes(originalData);
      console.error('품목코드 저장 실패:', err);
      setError('품목코드 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 품목코드 삭제
  const handleDeleteItemCode = async () => {
    if (!selectedItem) return;
//    console.log('품목코드 삭제:', selectedItem);

    // Confirm 다이얼로그 추가
    const isConfirmed = await confirmX({
      message: '품목코드를 삭제하시겠습니까?',
      title: "품목코드 삭제",
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
        sqlId: "ItemCdMgmt.deleteItem",
        userInfo: userInfo,
        params: selectedItem
      }]
//      console.log('품목코드 삭제 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
      await callPostApi(arrReqData);

      setLoading(false);
      await confirmX({
        title: "품목코드 삭제",
        message: "삭제되었습니다",
        type: "success"
      });

      // 삭제 후 리스트 업데이트
//      setItemCodes(itemCodes.filter(item => item.LOC_CD !== selectedItem.LOC_CD));
      setSelectedItem(null);
      setNewItem({
        ITEM_NO: '',
        ITEM_NM: '',
        ITEM_ABBR: '',
        LAST_PUR_DT: '',
        UNIT_GCD: '',
        BOX_QTY: 0,
        CUST_CD: '',
        PUR_PRC: 0,
        OUT_PRC: 0,
        SAL_PRC: 0,
        ITEM_LOC_CD: '',
        STK_QTY: 0,
        STK_YN: 'Y',
        STK_ADJ_DT: '',
        TAX_YN: '',
        PRC_APLY_GCD: '',
        ITEM_ALIAS: '',
        STK_PER: 0,
        ORD_PER: 0,
        PUR_PER: 0,
        EXP_PER: 0,
        SAL_STOP_YN: 'N',
        OUT_MRGN_RT: 0,
        DC_MRGN_RT: 0,
        SAL_MRGN_RT: 0,
        ITEM_GRP_NM: '',
        BARCODE: '',
        BARCODE_SUB: '',
      });

      // 삭제 후 리스트 재조회
      fetchItemCodes();

    } catch (err) {
      console.error('품목코드 삭제 실패:', err);
      setError('품목코드 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
    <div className="full-width-container">
      {/* 로딩 및 오류 표시 다이얼로그 팝업 */}
      {/*<StatusPopup loading={loading} error={error} onClose={handleClosePopup} />*/}

      <h5 className="main-title">품목관리</h5>

      <div className="management-container">
        {/* 좌측 영역 - 품목코드 관리 */}
        <div className="section-fullWidth">
          <div className="paper" style={{ height: 'calc(100% - 12px)' }}>
            {/* 상단 - 조회조건 영역 */}
            <div className="search-section">
              <h6 className="section-title">품목코드 조회</h6>

              <div className="search-container">
                {/* 첫 번째 행 */}
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>품목명</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdSearch.ITEM_NM}
                        type="text"
                        value={itemCdSearch.ITEM_NM}
                        onChange={(e) => setItemSearch({ ...itemCdSearch, ITEM_NM: e.target.value })}
                        onKeyPress={(e) => {
                          const charCode = e.charCode;
                          if ( charCode === 13 ) { // 엔터 이벤트
                            e.preventDefault();
                            fetchItemCodes();
                          }
                        }}
                        maxLength="30"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>품목약어</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdSearch.ITEM_ABBR}
                        type="text"
                        value={itemCdSearch.ITEM_ABBR}
                        onChange={(e) => setItemSearch({ ...itemCdSearch, ITEM_ABBR: e.target.value })}
                        onKeyPress={(e) => {
                          const charCode = e.charCode;
                          if ( charCode === 13 ) { // 엔터 이벤트
                            e.preventDefault();
                            fetchItemCodes();
                          }
                        }}
                        maxLength="30"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>매입처명</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdSearch.CUST_NM}
                        type="text"
                        value={itemCdSearch.CUST_NM}
                        onChange={(e) => setItemSearch({ ...itemCdSearch, CUST_NM: e.target.value })}
                        onKeyPress={(e) => {
                          const charCode = e.charCode;
                          if ( charCode === 13 ) { // 엔터 이벤트
                            e.preventDefault();
                            fetchItemCodes();
                          }
                        }}
                        maxLength="30"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>판매구분</label>
                    </div>
                    <div className="form-group-input">
                      <select
                        ref={fieldRefs.itemCdSearch.SAL_STOP_YN}
                        value={itemCdSearch.SAL_STOP_YN}
                        onChange={(e) => setItemSearch({ ...itemCdSearch, SAL_STOP_YN: e.target.value })}
                        className="form-select"
                      >
                        {(commonCodes.find(item => item.SAL_STOP_YN_A)?.SAL_STOP_YN_A || []).map((option) => (
                          <option key={option.SML_CD} value={option.SML_CD}>
                            {option.SML_NM}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 투 번째 행 */}
                {/*
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>항목1</label>
                    </div>
                    <div className="form-group-input">
                      <input type="text" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>항목2</label>
                    </div>
                    <div className="form-group-input">
                      <input type="text" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>항목3</label>
                    </div>
                    <div className="form-group-input">
                      <input type="text" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>항목4</label>
                    </div>
                    <div className="form-group-input">
                      <input type="text" />
                    </div>
                  </div>
                </div>
                */}

                {/* 버튼 행 - 오른쪽 정렬 */}
                <div className="search-row-button" style={{ justifyContent: 'flex-end' }}>
                  <div className="search-buttons">
                    <button
                      onClick={(e) => {
                        setIsDisabled(false);
                        resetItemArea();
                      }}
                      className="reset-btn"
                    >
                      초기화
                    </button>
                    <button
                      onClick={(e) => {
                        setIsDisabled(false);
                        fetchItemCodes();
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
                rowData={itemCodes}
                columnDefs={[
                  {
                    field: 'ITEM_NO',
                    headerName: '품목코드',
                    width: 120,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'ITEM_NM',
                    headerName: '품목명',
                    width: 250,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'ITEM_ABBR',
                    headerName: '약어',
                    width: 80,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'UNIT_GCD',
                    headerName: '단위',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'center' },
                    cellDataType : 'object',
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                      values: setGridComboVal(commonCodes, 'UNIT_GCD_A').map((opt) => opt.name), // 셀렉트 박스에 표시할 label 목록
                    },
                    valueFormatter: (params) => getLabelFromId(setGridComboVal(commonCodes, 'UNIT_GCD_A'), params.value), // id → name 표시
                    valueParser: (name) => getIdFromLabel(setGridComboVal(commonCodes, 'UNIT_GCD_A'), name), // name → id 저장
                    options: [...setGridComboVal(commonCodes, 'UNIT_GCD_A')],    // 사용자정의로 셋팅
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'BOX_QTY',
                    headerName: 'B수량',
                    width: 80,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'currency'),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'ITEM_LOC_CD',
                    headerName: '창고위치',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'PUR_PRC',
                    headerName: '구매단가',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'currency', { currencySymbol: '₩', minimumFractionDigits: 2 } ),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'OUT_PRC',
                    headerName: '출고단가',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'currency', { currencySymbol: '₩', minimumFractionDigits: 2 } ),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'SAL_PRC',
                    headerName: '판매단가',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'currency', { currencySymbol: '₩', minimumFractionDigits: 2 } ),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'CUST_NM',
                    headerName: '매입처',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'CUST_CD',
                    headerName: '거래처코드',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'TAX_YN',
                    headerName: '과세',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'center' },
                    cellDataType : 'object',
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                      values: setGridComboVal(commonCodes, 'TAX_YN_A').map((opt) => opt.name), // 셀렉트 박스에 표시할 label 목록
                    },
                    valueFormatter: (params) => getLabelFromId(setGridComboVal(commonCodes, 'TAX_YN_A'), params.value), // id → name 표시
                    valueParser: (name) => getIdFromLabel(setGridComboVal(commonCodes, 'TAX_YN_A'), name), // name → id 저장
                    options: [...setGridComboVal(commonCodes, 'TAX_YN_A')],    // 사용자정의로 셋팅
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'PRC_APLY_GCD',
                    headerName: '단가적용',
                    width: 120,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'center' },
                    cellDataType : 'object',
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                      values: setGridComboVal(commonCodes, 'PRC_APLY_GCD_A').map((opt) => opt.name), // 셀렉트 박스에 표시할 label 목록
                    },
                    valueFormatter: (params) => getLabelFromId(setGridComboVal(commonCodes, 'PRC_APLY_GCD_A'), params.value), // id → name 표시
                    valueParser: (name) => getIdFromLabel(setGridComboVal(commonCodes, 'PRC_APLY_GCD_A'), name), // name → id 저장
                    options: [...setGridComboVal(commonCodes, 'PRC_APLY_GCD_A')],    // 사용자정의로 셋팅
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'SAL_STOP_YN',
                    headerName: '사용',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'center' },
                    cellDataType : 'object',
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                      values: setGridComboVal(commonCodes, 'SAL_STOP_YN_A').map((opt) => opt.name), // 셀렉트 박스에 표시할 label 목록
                    },
                    valueFormatter: (params) => getLabelFromId(setGridComboVal(commonCodes, 'SAL_STOP_YN_A'), params.value), // id → name 표시
                    valueParser: (name) => getIdFromLabel(setGridComboVal(commonCodes, 'SAL_STOP_YN_A'), name), // name → id 저장
                    options: [...setGridComboVal(commonCodes, 'SAL_STOP_YN_A')],    // 사용자정의로 셋팅
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'ITEM_ALIAS',
                    headerName: '별칭',
                    width: 250,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'STK_PER',
                    headerName: '재고기간',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'per'),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'ORD_PER',
                    headerName: '발주기간',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'per'),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'PUR_PER',
                    headerName: '매입기간',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'per'),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'EXP_PER',
                    headerName: '유통기한',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'per'),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'OUT_MRGN_RT',
                    headerName: '출고마진',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'percent', { multiply: false, includeSymbol: true }),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'DC_MRGN_RT',
                    headerName: '할인마진',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'percent', { multiply: false, includeSymbol: true }),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'SAL_MRGN_RT',
                    headerName: '판매마진',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'percent', { multiply: false, includeSymbol: true }),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'ITEM_GRP_NM',
                    headerName: '품목그룹명',
                    width: 150,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'STK_QTY',
                    headerName: '현재고량',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'right' },
                    cellDataType : 'number',
                    valueFormatter: (params) => formatByType(params.value, 'currency'),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'BARCODE',
                    headerName: '바코드',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'left' },
                    cellDataType : 'text',
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'LAST_PUR_DT',
                    headerName: '최종매입일',
                    width: 100,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'center' },
                    cellDataType : 'text',
                    valueFormatter: (params) => formatByType(params.value, 'dateStr'),
                    /*editable: true,*/
                    /*singleClickEdit: true,*/
                  },
                  {
                    field: 'SAL_STOP_DTM',
                    headerName: '판매중지일시',
                    width: 160,
                    headerClass: 'ag-header-center', // 가운데 정렬
                    cellStyle: { textAlign: 'center' },
                    cellDataType : 'text',
                    valueFormatter: (params) => formatByType(params.value, 'datetime'),
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
                        setSelectedItem(null);
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
        {/* 좌측 영역 - 품목코드 관리 */}



        {/* MUI 모달 팝업 */}
        {/*<Modal open={open} onClose={handleClose}>*/}
        <Modal open={open}>
          <Box
            sx={{
              p: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              width: 1200,
              mx: "auto",
              mt: "15%",
              boxShadow: 24,
            }}
          >
            {/* 로딩 및 오류 표시 다이얼로그 팝업 */}
            <StatusPopup loading={loading} error={error} onClose={handleClosePopup} />

            {/* 레이어팝업 - 상세정보 영역 */}
            <div className="detail-section">
              <h6 className="section-title">품목 상세정보</h6>

              <div className="data-container">
                {/* 첫 번째 행 */}
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>품목코드</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.ITEM_NO}
                        type="text"
                        value={selectedItem ? selectedItem.ITEM_NO : newItem.ITEM_NO}
                        onChange={(e) => {
                          const value = e.target.value;
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, ITEM_NO: value })
                            : setNewItem({ ...newItem, ITEM_NO: value });
                        }}
                        maxLength="15"
                        className="form-input"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>품목명 <span className="required-mark">*</span></label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.ITEM_NM}
                        type="text"
                        value={selectedItem ? selectedItem.ITEM_NM : newItem.ITEM_NM}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, ITEM_NM: e.target.value })
                            : setNewItem({ ...newItem, ITEM_NM: e.target.value })
                        }
                        maxLength="30"
                        className="form-input required"
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>품목약어</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.ITEM_ABBR}
                        type="text"
                        value={selectedItem ? selectedItem.ITEM_ABBR : newItem.ITEM_ABBR}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, ITEM_ABBR: e.target.value })
                            : setNewItem({ ...newItem, ITEM_ABBR: e.target.value })
                        }
                        maxLength="30"
                        className="form-input"
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>최종매입일</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.LAST_PUR_DT}
                        type="text"
                        value={selectedItem ? selectedItem.LAST_PUR_DT : newItem.LAST_PUR_DT}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, LAST_PUR_DT: e.target.value })
                            : setNewItem({ ...newItem, LAST_PUR_DT: e.target.value })
                        }
                        maxLength="8"
                        className="form-input"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* 투 번째 행 */}
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>단위구분</label>
                    </div>
                    <div className="form-group-input">
                      <select
                        ref={fieldRefs.itemCdInfo.UNIT_GCD}
                        value={selectedItem ? selectedItem.UNIT_GCD : newItem.UNIT_GCD}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, UNIT_GCD: e.target.value })
                            : setNewItem({ ...newItem, UNIT_GCD: e.target.value })
                        }
                        className="form-select"
                        disabled={!isDisabled}
                      >
                        {(commonCodes.find(item => item.UNIT_GCD_B)?.UNIT_GCD_B || []).map((option) => (
                          <option key={option.SML_CD} value={option.SML_CD}>
                            {option.SML_NM}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>박스수량</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.BOX_QTY}
                        type="number"
                        value={selectedItem ? selectedItem.BOX_QTY : newItem.BOX_QTY}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, BOX_QTY: e.target.value })
                            : setNewItem({ ...newItem, BOX_QTY: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>거래처코드</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.CUST_CD}
                        type="text"
                        value={selectedItem ? selectedItem.CUST_CD : newItem.CUST_CD}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, CUST_CD: e.target.value })
                            : setNewItem({ ...newItem, CUST_CD: e.target.value })
                        }
                        maxLength="10"
                        /*className="form-input required"*/
                        className="form-input"
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>창고위치</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.ITEM_LOC_CD}
                        type="text"
                        value={selectedItem ? selectedItem.ITEM_LOC_CD : newItem.ITEM_LOC_CD}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, ITEM_LOC_CD: e.target.value })
                            : setNewItem({ ...newItem, ITEM_LOC_CD: e.target.value })
                        }
                        maxLength="10"
                        /*className="form-input required"*/
                        className="form-input"
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                </div>

                {/* 세 번째 행 */}
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>매입단가</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.PUR_PRC}
                        type="number"
                        value={selectedItem ? selectedItem.PUR_PRC : newItem.PUR_PRC}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, PUR_PRC: e.target.value })
                            : setNewItem({ ...newItem, PUR_PRC: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>출고단가</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.OUT_PRC}
                        type="number"
                        value={selectedItem ? selectedItem.OUT_PRC : newItem.OUT_PRC}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, OUT_PRC: e.target.value })
                            : setNewItem({ ...newItem, OUT_PRC: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>판매단가</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.SAL_PRC}
                        type="number"
                        value={selectedItem ? selectedItem.SAL_PRC : newItem.SAL_PRC}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, SAL_PRC: e.target.value })
                            : setNewItem({ ...newItem, SAL_PRC: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>과세여부</label>
                    </div>
                    <div className="form-group-input">
                      <select
                        ref={fieldRefs.itemCdInfo.TAX_YN}
                        value={selectedItem ? selectedItem.TAX_YN : newItem.TAX_YN}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, TAX_YN: e.target.value })
                            : setNewItem({ ...newItem, TAX_YN: e.target.value })
                        }
                        className="form-select required"
                        disabled={!isDisabled}
                      >
                        {(commonCodes.find(item => item.TAX_YN_N)?.TAX_YN_N || []).map((option) => (
                          <option key={option.SML_CD} value={option.SML_CD}>
                            {option.SML_NM}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 네 번째 행 */}
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>재고수량</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.STK_QTY}
                        type="number"
                        value={selectedItem ? selectedItem.STK_QTY : newItem.STK_QTY}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, STK_QTY: e.target.value })
                            : setNewItem({ ...newItem, STK_QTY: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>재고여부</label>
                    </div>
                    <div className="form-group-input">
                      <select
                        ref={fieldRefs.itemCdInfo.STK_YN}
                        value={selectedItem ? selectedItem.STK_YN : newItem.STK_YN}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, STK_YN: e.target.value })
                            : setNewItem({ ...newItem, STK_YN: e.target.value })
                        }
                        className="form-select required"
                        disabled={!isDisabled}
                      >
                        {(commonCodes.find(item => item.STK_YN_N)?.STK_YN_N || []).map((option) => (
                          <option key={option.SML_CD} value={option.SML_CD}>
                            {option.SML_NM}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>재고조정일자</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.STK_ADJ_DT}
                        type="text"
                        value={selectedItem ? selectedItem.STK_ADJ_DT : newItem.STK_ADJ_DT}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, STK_ADJ_DT: e.target.value })
                            : setNewItem({ ...newItem, STK_ADJ_DT: e.target.value })
                        }
                        maxLength="10"
                        /*className="form-input required"*/
                        className="form-input"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>단가적용구분</label>
                    </div>
                    <div className="form-group-input">
                      <select
                        ref={fieldRefs.itemCdInfo.PRC_APLY_GCD}
                        value={selectedItem ? selectedItem.PRC_APLY_GCD : newItem.PRC_APLY_GCD}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, PRC_APLY_GCD: e.target.value })
                            : setNewItem({ ...newItem, PRC_APLY_GCD: e.target.value })
                        }
                        className="form-select required"
                        disabled={!isDisabled}
                      >
                        {(commonCodes.find(item => item.PRC_APLY_GCD_S)?.PRC_APLY_GCD_S || []).map((option) => (
                          <option key={option.SML_CD} value={option.SML_CD}>
                            {option.SML_NM}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 다섯 번째 행 */}
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>재고기간</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.STK_PER}
                        type="number"
                        value={selectedItem ? selectedItem.STK_PER : newItem.STK_PER}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, STK_PER: e.target.value })
                            : setNewItem({ ...newItem, STK_PER: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>발주기간</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.ORD_PER}
                        type="number"
                        value={selectedItem ? selectedItem.ORD_PER : newItem.ORD_PER}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, ORD_PER: e.target.value })
                            : setNewItem({ ...newItem, ORD_PER: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>매입기간</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.PUR_PER}
                        type="number"
                        value={selectedItem ? selectedItem.PUR_PER : newItem.PUR_PER}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, PUR_PER: e.target.value })
                            : setNewItem({ ...newItem, PUR_PER: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>유통기한</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.EXP_PER}
                        type="number"
                        value={selectedItem ? selectedItem.EXP_PER : newItem.EXP_PER}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, EXP_PER: e.target.value })
                            : setNewItem({ ...newItem, EXP_PER: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                </div>

                {/* 여섯 번째 행 */}
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>품목별칭</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.ITEM_ALIAS}
                        type="text"
                        value={selectedItem ? selectedItem.ITEM_ALIAS : newItem.ITEM_ALIAS}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, ITEM_ALIAS: e.target.value })
                            : setNewItem({ ...newItem, ITEM_ALIAS: e.target.value })
                        }
                        maxLength="50"
                        /*className="form-input required"*/
                        className="form-input"
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>품목그룹명</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.ITEM_GRP_NM}
                        type="text"
                        value={selectedItem ? selectedItem.ITEM_GRP_NM : newItem.ITEM_GRP_NM}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, ITEM_GRP_NM: e.target.value })
                            : setNewItem({ ...newItem, ITEM_GRP_NM: e.target.value })
                        }
                        maxLength="50"
                        /*className="form-input required"*/
                        className="form-input"
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>판매중지여부</label>
                    </div>
                    <div className="form-group-input">
                      <select
                        ref={fieldRefs.itemCdInfo.SAL_STOP_YN}
                        value={selectedItem ? selectedItem.SAL_STOP_YN : newItem.SAL_STOP_YN}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, SAL_STOP_YN: e.target.value })
                            : setNewItem({ ...newItem, SAL_STOP_YN: e.target.value })
                        }
                        className="form-select"
                        disabled
                      >
                        {(commonCodes.find(item => item.SAL_STOP_YN_N)?.SAL_STOP_YN_N || []).map((option) => (
                          <option key={option.SML_CD} value={option.SML_CD}>
                            {option.SML_NM}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>판매중지일시</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.SAL_STOP_DTM}
                        type="text"
                        value={selectedItem ? selectedItem.SAL_STOP_DTM : newItem.SAL_STOP_DTM}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, SAL_STOP_DTM: e.target.value })
                            : setNewItem({ ...newItem, SAL_STOP_DTM: e.target.value })
                        }
                        maxLength="50"
                        /*className="form-input required"*/
                        className="form-input"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* 일곱 번째 행 */}
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>출고마진율</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.OUT_MRGN_RT}
                        type="number"
                        value={selectedItem ? selectedItem.OUT_MRGN_RT : newItem.BOX_QTY}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, OUT_MRGN_RT: e.target.value })
                            : setNewItem({ ...newItem, OUT_MRGN_RT: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>할인마진율</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.DC_MRGN_RT}
                        type="number"
                        value={selectedItem ? selectedItem.DC_MRGN_RT : newItem.BOX_QTY}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, DC_MRGN_RT: e.target.value })
                            : setNewItem({ ...newItem, DC_MRGN_RT: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>판매마진율</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.SAL_MRGN_RT}
                        type="number"
                        value={selectedItem ? selectedItem.SAL_MRGN_RT : newItem.SAL_MRGN_RT}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, SAL_MRGN_RT: e.target.value })
                            : setNewItem({ ...newItem, SAL_MRGN_RT: e.target.value })
                        }
                        maxLength="5"
                        /*className="form-input required"*/
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>바코드</label>
                    </div>
                    <div className="form-group-input">
                      <input
                        ref={fieldRefs.itemCdInfo.BARCODE}
                        type="text"
                        value={selectedItem ? selectedItem.BARCODE : newItem.BARCODE}
                        onChange={(e) =>
                          selectedItem
                            ? setSelectedItem({ ...selectedItem, BARCODE: e.target.value })
                            : setNewItem({ ...newItem, BARCODE: e.target.value })
                        }
                        maxLength="20"
                        /*className="form-input required"*/
                        className="form-input"
                        disabled={!isDisabled}
                      />
                    </div>
                  </div>
                </div>

                {/* 세 번째 행 */}
                {/*
                <div className="form-row">
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>항목1</label>
                    </div>
                    <div className="form-group-input">
                      <input type="text" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>항목2</label>
                    </div>
                    <div className="form-group-input">
                      <input type="text" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>항목3</label>
                    </div>
                    <div className="form-group-input">
                      <input type="text" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-group-title">
                      <label>항목4</label>
                    </div>
                    <div className="form-group-input">
                      <input type="text" />
                    </div>
                  </div>
                </div>
                */}


                {/* 버튼 행 - 오른쪽 정렬 */}
                <div className="detail-row-button" style={{ justifyContent: 'flex-end' }}>
                  <div className="action-buttons">
                    <button
                      onClick={handleSaveItemCode}
                      disabled={loading}
                      className="save-btn"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleDeleteItemCode}
                      disabled={loading || !selectedItem}
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

export default ItemMgmt;
