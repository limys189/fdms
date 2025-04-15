import React, { useState, useEffect, useRef, useCallback } from 'react';
import { callPostApi } from "../../services/apiService";    // REST-API 서비스 호출
import useUserSession from '../../libs/userSession';        // 사용자 세션정보
import StatusPopup from '../../components/StatusPopup';     // 로딩 및 에러 표시 팝업
import { TextField, Button, FormControl, InputLabel, Select, MenuItem} from '@mui/material';

//=========================================
// 그리드 관련 셋트
import { Grid } from 'wx-react-grid';
import "../../css/wxReactGrid.css"
import "wx-react-grid/dist/grid.css";
//=========================================
import "./CommonCodeMgmt.css";


const CommonCodeMgmt = () => {
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

  // 이벤트 정의
  const apiLrgGrid = useRef(null);
  const apiSmlGrid = useRef(null);

  // 공통코드 상태
  const [gridComboUseYnOptions] = useState([]);         // 그리드에서 사용할 사용여부 콤보 옵션
  const [commonCodes, setCommonCodes] = useState([]);
  const [codeSearch, setCodeSearch] = useState([
    {_DATA_ID: 'USE_YN_A', LRG_CD: 'C0001', CODE_NM: '사용여부', _OPTIONS: 'A'},  // 사용여부, 옵션: 전체
    {_DATA_ID: 'USE_YN_N', LRG_CD: 'C0001', CODE_NM: '사용여부', _OPTIONS: ''},  // 사용여부, 옵션: 알수없음
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

  const [loading, setLoading] = useState(false);
  const [error2, setError2] = useState(null);

  const handleClosePopup = () => {
    setError2(null);
    // 로딩은 일반적으로 사용자가 닫을 수 없음
    // 필요시 setLoading(false) 추가
  };

/*
  // 빈 값 필터링
  const applyFilteredParams = (data) => {
    const filteredParams = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '')
    );
    return filteredParams;
  };
*/

  // 공통코드 조회
  const fetchCommonCodes = async () => {
    // API 호출 로직 (실제 구현 필요)
    console.log('공통코드 조회:', codeSearch);

    setLoading(true);
    setError2(null);
    try {
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "BasSmlCd.selectListCode",
        paramsList: codeSearch
      }]

      // apiService의 callPostApi 함수 호출
      const resData = await callPostApi(arrReqData);
      console.log('공통코드 조회 결과 :::', resData);

      // 그리드에서 사용할 사용여부 콤보 옵션 셋팅
      (resData.find(item => item.USE_YN_N)?.USE_YN_N || []).forEach((result)=>{
        var temp = {
          id: result.SML_CD,
          name: result.SML_NM,
        };
        if ( !gridComboUseYnOptions.find(item => item.id === result.SML_CD) ) {
            gridComboUseYnOptions.push(temp);
        }
      });

      setCommonCodes(resData);
    } catch (err) {
      console.error('공통코드 조회 실패:', err);
      setError2('공통코드를 불러오는 중 오류가 발생했습니다.');
      setCommonCodes([]);
    } finally {
      setLoading(false);
    }
  };

  // 대분류코드 조회
  const fetchLargeCodes = useCallback(async () => {
    // API 호출 로직 (실제 구현 필요)
//    console.log('대분류코드 조회:', largeSearch);

    setLoading(true);
    setError2(null);
    try {
      largeSearch._DATA_ID = "LRG_CD_LIST";
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "BasLrgCd.selectList",
        params: largeSearch
      }]

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
      setError2('대분류코드를 불러오는 중 오류가 발생했습니다.');
      setLargeCodes([]);
    } finally {
      setLoading(false);
    }
  }, [largeSearch]);

  // 소분류코드 조회
  const fetchSmallCodes = useCallback(async () => {
    if (!selectedLarge) return;
    // API 호출 로직 (실제 구현 필요)
//    console.log('소분류코드 조회:', selectedLarge, smallSearch);

    setLoading(true);
    setError2(null);
    try {
      smallSearch._DATA_ID = "SML_CD_LIST";
      smallSearch.LRG_CD = selectedLarge.LRG_CD;
      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "BasSmlCd.selectList",
        params: smallSearch
      }]

      // apiService의 callPostApi 함수 호출
      const resData = await callPostApi(arrReqData);
//      console.log('소분류코드 조회 결과 :::', resData);
      setSmallCodes(resData.find(item => item.SML_CD_LIST)?.SML_CD_LIST || []);
    } catch (err) {
      console.error('소분류코드 조회 실패:', err);
      setError2('소분류코드를 불러오는 중 오류가 발생했습니다.');
      setSmallCodes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLarge, smallSearch]);

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
    resetSmallArea();   // 소분류코드 영역 초기화
  };

  // 소분류코드 영역 초기화
  const resetSmallArea = () => {
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
  };

  // 대분류코드 입력값 체크
  const validateLargeCode = (data) => {
    if (!data.LRG_CD) return '대분류코드는 필수 입력 항목입니다.';
    if (!data.LRG_NM) return '대분류명은 필수 입력 항목입니다.';
    if (!data.USE_YN) return '사용여부는 필수 입력 항목입니다.';
    return null;
  };

  // 대분류코드 저장
  const handleSaveLargeCode = async () => {
    if (selectedLarge) {
      // 수정 로직
      console.log('대분류코드 수정:', selectedLarge);
    } else {
      // 신규 등록 로직
      console.log('대분류코드 신규:', newLarge);
    }

    const validationError = validateLargeCode(selectedLarge || newLarge);
    if (validationError) {
      setError2(validationError);
      return;
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
      console.log('대분류코드 저장 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
      const savedData = await callPostApi(arrReqData);

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
      setError2('대분류코드 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 소분류코드 입력값 체크
  const validateSmallCode = (data) => {
    if (!data.LRG_CD) return '대분류코드는 필수 입력 항목입니다.';
    if (!data.SML_CD) return '소분류코드는 필수 입력 항목입니다.';
    if (!data.SML_NM) return '소분류명은 필수 입력 항목입니다.';
    if (!data.USE_YN) return '사용여부는 필수 입력 항목입니다.';
    return null;
  };

  // 소분류코드 저장
  const handleSaveSmallCode = async () => {
    if (selectedSmall) {
      // 수정 로직
      console.log('소분류코드 수정:', selectedSmall);
    } else {
      // 신규 등록 로직
      console.log('소분류코드 신규:', newSmall);
    }

    const validationError = validateSmallCode(selectedSmall || newSmall);
    if (validationError) {
      setError2(validationError);
      return;
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
      console.log('소분류코드 저장 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
      const savedData = await callPostApi(arrReqData);

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
      setError2('소분류코드 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 대분류코드 삭제
  const handleDeleteLargeCode = async () => {
    if (!selectedLarge) return;
    console.log('대분류코드 삭제:', selectedLarge);

    try {
      setLoading(true);

      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "BasLrgCd.delete",
        params: selectedLarge
      }]
      console.log('대분류코드 삭제 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
      await callPostApi(arrReqData);

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
      setError2('대분류코드 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 소분류코드 삭제
  const handleDeleteSmallCode = async () => {
    if (!selectedSmall) return;
    console.log('소분류코드 삭제:', selectedSmall);

    try {
      setLoading(true);

      // 전달 데이터 형식 : Array
      const arrReqData = [{
        sqlId: "BasSmlCd.delete",
        params: selectedSmall
      }]
      console.log('소분류코드 삭제 데이터 :', arrReqData);

      // apiService의 callPostApi 함수 호출
      await callPostApi(arrReqData);

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
      setError2('소분류코드 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await login({ username: 'test', password: '1234' });
      console.log('로그인 성공!');
    } catch (err) {
      console.error('로그인 실패:', err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) handleLogin();

    // 공통코드 조회
    fetchCommonCodes();

    // 대분류코드 그리드 이벤트 처리
    if (apiLrgGrid.current) {
        apiLrgGrid.current.on("select-row", (ev) => {
            // 대분류 상세정보 셋팅
            setSelectedLarge(apiLrgGrid.current.getRow(ev.id));
        });
    }

    // 소분류코드 그리드 이벤트 처리
    if (apiSmlGrid.current) {
        apiSmlGrid.current.on("select-row", (ev) => {
            // 대분류 상세정보 셋팅
            setSelectedSmall(apiSmlGrid.current.getRow(ev.id));
        });
    }

/*
    // 대분류코드 선택 시 소분류코드 조회
    if (selectedLarge) {
      setNewSmall(prev => ({ ...prev, LRG_CD: selectedLarge.LRG_CD }));
      fetchSmallCodes();
    }
*/
  }, [apiLrgGrid, apiSmlGrid]);

  useEffect(() => {
    // 대분류코드 선택 시 소분류코드 조회
    if (selectedLarge) {
      setNewSmall(prev => ({ ...prev, LRG_CD: selectedLarge.LRG_CD }));
      fetchSmallCodes();
    }
  }, [selectedLarge]);



  const sizes = {
    rowHeight: 30,
//    colWidth: 160,
    headerHeight: 30,
    footerHeight: 30,
  };

  return (
    <div className="common-code-container">
      {/* 로딩 상태 표시 */}
      {/*loading && (
        <div className="loading-container">
          <CircularProgress size="0.8rem" />
        </div>
      )*/}

      {/* 에러 메시지 표시 */}
      {/*error2 && (
        <div className="error-alert">
          <Alert severity="error" style={{ fontSize: '0.8rem' }}>{error2}</Alert>
        </div>
      )*/}

      {/* 변경된 팝업 표시 */}
      <StatusPopup loading={loading} error={error2} onClose={handleClosePopup} />

      <h5 className="main-title">공통코드 관리</h5>

      <div className="code-management-container">
        {/* 좌측 영역 - 대분류코드 관리 */}
        <div className="left-section">
          <div className="paper">
            {/* 상단 - 조회조건 영역 */}
            <div className="search-section">
              <h6 className="section-title">대분류코드 조회</h6>
              <div className="search-fields">
                <div className="search-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="대분류코드"
                    value={largeSearch.LRG_CD}
                    onChange={(e) => setLargeSearch({ ...largeSearch, LRG_CD: e.target.value })}
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                <div className="search-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="대분류명"
                    value={largeSearch.LRG_NM}
                    onChange={(e) => setLargeSearch({ ...largeSearch, LRG_NM: e.target.value })}
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                <div className="search-field">
                  <FormControl fullWidth size="small">
                    <InputLabel style={{ fontSize: '0.8rem' }}>사용여부</InputLabel>
                    <Select
                      value={largeSearch.USE_YN}
                      onChange={(e) => setLargeSearch({ ...largeSearch, USE_YN: e.target.value })}
                      label="사용여부"
                      style={{ fontSize: '0.8rem' }}
                    >
                    {(commonCodes.find(item => item.USE_YN_A)?.USE_YN_A || []).map((option) => (
                      <MenuItem
                        key={option.SML_CD === '' ? ' ': option.SML_CD}
                        value={option.SML_CD === '' ? ' ': option.SML_CD}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {option.SML_NM}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="search-buttons">
                  <Button
                    variant="outlined"
                    onClick={resetLargeArea}
                    className="reset-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 12px', marginRight: '8px' }}
                  >
                    초기화
                  </Button>
                  <Button
                    variant="contained"
                    onClick={fetchLargeCodes}
                    className="search-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                  >
                    조회
                  </Button>
                </div>
              </div>
            </div>

            {/* 중간 - 데이터 영역 */}
            <div className="data-section wx-willow-theme">
              <Grid
                data={largeCodes}
                columns={[
                  { id: 'LRG_CD', header: '대분류코드', footer: '대분류코드', editor: 'text', width: 100, },
                  { id: 'LRG_NM', header: '대분류명', footer: '대분류명', editor: 'text', width: 382, },
                  { id: 'USE_YN', header: '사용여부', footer: '사용여부', editor: "combo", options: gridComboUseYnOptions, width: 100, }
                ]}
                sizes={sizes}
                api={apiLrgGrid}
                style={{ fontSize: '0.8rem' }}
              />
            </div>

            {/* 하단 - 상세정보 영역 */}
            <div className="detail-section">
              <h6 className="section-title">상세정보</h6>
              <div className="detail-fields">
                <div className="detail-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="대분류코드"
                    value={selectedLarge ? selectedLarge.LRG_CD : newLarge.LRG_CD}
                    onChange={(e) =>
                      selectedLarge
                        ? setSelectedLarge({ ...selectedLarge, LRG_CD: e.target.value })
                        : setNewLarge({ ...newLarge, LRG_CD: e.target.value })
                    }
                    disabled={selectedLarge}
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                <div className="detail-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="대분류명"
                    value={selectedLarge ? selectedLarge.LRG_NM : newLarge.LRG_NM}
                    onChange={(e) =>
                      selectedLarge
                        ? setSelectedLarge({ ...selectedLarge, LRG_NM: e.target.value })
                        : setNewLarge({ ...newLarge, LRG_NM: e.target.value })
                    }
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                <div className="detail-field">
                  <FormControl fullWidth size="small">
                    <InputLabel style={{ fontSize: '0.8rem' }}>사용여부</InputLabel>
                    <Select
                      value={selectedLarge ? selectedLarge.USE_YN : newLarge.USE_YN}
                      onChange={(e) =>
                        selectedLarge
                          ? setSelectedLarge({ ...selectedLarge, USE_YN: e.target.value })
                          : setNewLarge({ ...newLarge, USE_YN: e.target.value })
                      }
                      label="사용여부"
                      style={{ fontSize: '0.8rem' }}
                    >
                    {(commonCodes.find(item => item.USE_YN_N)?.USE_YN_N || []).map((option) => (
                      <MenuItem
                        key={option.SML_CD === '' ? ' ': option.SML_CD}
                        value={option.SML_CD === '' ? ' ': option.SML_CD}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {option.SML_NM}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="action-buttons">
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedLarge(null)}
                    className="new-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 12px', marginRight: '8px' }}
                  >
                    신규
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveLargeCode}
                    disabled={loading}
                    className="save-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 12px', marginRight: '8px' }}
                  >
                    저장
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteLargeCode}
                    disabled={loading || !selectedLarge}
                    className="delete-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 영역 - 소분류코드 관리 */}
        <div className="right-section">
          <div className="paper">
            {/* 상단 - 조회조건 영역 */}
            <div className="search-section">
              <h6 className="section-title">소분류코드 조회</h6>
              <div className="search-fields">
                <div className="search-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="소분류코드"
                    value={smallSearch.SML_CD}
                    onChange={(e) => setSmallSearch({ ...smallSearch, SML_CD: e.target.value })}
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                <div className="search-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="소분류명"
                    value={smallSearch.SML_NM}
                    onChange={(e) => setSmallSearch({ ...smallSearch, SML_NM: e.target.value })}
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                <div className="search-field">
                  <FormControl fullWidth size="small">
                    <InputLabel style={{ fontSize: '0.8rem' }}>사용여부</InputLabel>
                    <Select
                      value={smallSearch.USE_YN}
                      onChange={(e) =>setSmallSearch({ ...smallSearch, USE_YN: e.target.value })}
                      label="사용여부"
                      style={{ fontSize: '0.8rem' }}
                    >
                    {(commonCodes.find(item => item.USE_YN_A)?.USE_YN_A || []).map((option) => (
                      <MenuItem
                        key={option.SML_CD === '' ? ' ': option.SML_CD}
                        value={option.SML_CD === '' ? ' ': option.SML_CD}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {option.SML_NM}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="search-buttons">
                  <Button
                    variant="outlined"
                    onClick={resetSmallArea}
                    className="reset-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 12px', marginRight: '8px' }}
                  >
                    초기화
                  </Button>
                  <Button
                    variant="contained"
                    onClick={fetchSmallCodes}
                    className="search-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                  >
                    조회
                  </Button>
                </div>
              </div>
            </div>

            {/* 중간 - 데이터 영역 */}
            <div className="data-section wx-willow-theme">
              <Grid
                data={smallCodes}
                columns={[
                  { id: 'LRG_CD', header: '대분류코드',footer: '대분류코드', width: 100, },
                  { id: 'SML_CD', header: '소분류코드',footer: '소분류코드', editor: 'text', width: 120, },
                  { id: 'SML_NM', header: '소분류명', footer: '소분류명', editor: 'text', width: 182, },
                  { id: 'SRT_NO', header: '정렬순서', footer: '정렬순서', editor: 'text', width: 80, },
                  { id: 'USE_YN', header: '사용여부', footer: '사용여부', editor: "combo", options: gridComboUseYnOptions, width: 100, },
                ]}
                sizes={sizes}
                api={apiSmlGrid}
                style={{ fontSize: '0.8rem' }}
              />
            </div>

            {/* 하단 - 상세정보 영역 */}
            <div className="detail-section">
              <h6 className="section-title">상세정보</h6>
              <div className="detail-fields">
                <div className="detail-fields">
                <div className="detail-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="대분류코드"
                    value={selectedSmall ? selectedSmall.LRG_CD : newSmall.LRG_CD}
                    onChange={(e) =>
                      selectedSmall
                        ? setSelectedSmall({ ...selectedSmall, LRG_CD: e.target.value })
                        : setNewSmall({ ...newSmall, LRG_CD: e.target.value })
                    }
                    disabled="true"
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                <div className="detail-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="소분류코드"
                    value={selectedSmall ? selectedSmall.SML_CD : newSmall.SML_CD}
                    onChange={(e) =>
                      selectedSmall
                        ? setSelectedSmall({ ...selectedSmall, SML_CD: e.target.value })
                        : setNewSmall({ ...newSmall, SML_CD: e.target.value })
                    }
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                <div className="detail-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="소분류명"
                    value={selectedSmall ? selectedSmall.SML_NM : newSmall.SML_NM}
                    onChange={(e) =>
                      selectedSmall
                        ? setSelectedSmall({ ...selectedSmall, SML_NM: e.target.value })
                        : setNewSmall({ ...newSmall, SML_NM: e.target.value })
                    }
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                </div>
                <div className="detail-fields">
                <div className="detail-field">
                  <TextField
                    fullWidth
                    size="small"
                    label="정렬순서"
                    type="number"
                    value={selectedSmall ? selectedSmall.SRT_NO : newSmall.SRT_NO}
                    onChange={(e) =>
                      selectedSmall
                        ? setSelectedSmall({ ...selectedSmall, SRT_NO: e.target.value })
                        : setNewSmall({ ...newSmall, SRT_NO: e.target.value })
                    }
                    InputProps={{ style: { fontSize: '0.8rem' } }}
                    InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                  />
                </div>
                <div className="detail-field">
                  <FormControl fullWidth size="small">
                    <InputLabel style={{ fontSize: '0.8rem' }}>사용여부</InputLabel>
                    <Select
                      value={selectedSmall ? selectedSmall.USE_YN : newSmall.USE_YN}
                      onChange={(e) =>
                        selectedSmall
                          ? setSelectedSmall({ ...selectedSmall, USE_YN: e.target.value })
                          : setNewSmall({ ...newSmall, USE_YN: e.target.value })
                      }
                      label="사용여부"
                      style={{ fontSize: '0.8rem' }}
                    >
                    {(commonCodes.find(item => item.USE_YN_N)?.USE_YN_N || []).map((option) => (
                      <MenuItem
                        key={option.SML_CD === '' ? ' ': option.SML_CD}
                        value={option.SML_CD === '' ? ' ': option.SML_CD}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {option.SML_NM}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </div>
                </div>
                <div className="action-buttons">
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedSmall(null)}
                    className="new-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 12px', marginRight: '8px' }}
                  >
                    신규
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveSmallCode}
                    disabled={loading}
                    className="save-btn"
                    style={{ fontSize: '0.8rem',padding: '4px 12px', marginRight: '8px' }}
                  >
                    저장
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteSmallCode}
                    disabled={loading || !selectedSmall}
                    className="delete-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonCodeMgmt;
