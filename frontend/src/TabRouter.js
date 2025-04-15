import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from "./pages/Home";


const TabRouter = ({ tabs, setTabs, activeTab, setActiveTab, addTab, closeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabHeaderRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // 초기 홈 탭 설정
  useEffect(() => {
    if (tabs.length === 0 && location.pathname === '/') {
      addTab({
        path: '/home',
        title: 'HOME',
        component: <Home />
      });
    }
  }, []);

  // URL 변경 감지
  useEffect(() => {
    const existingTab = tabs.find(tab => tab.path === location.pathname);
    if (!existingTab && location.pathname !== '/') {
      // 메뉴에서 직접 navigate를 호출하면 addTab이 호출되므로 여기서는 처리하지 않음
    }
    setActiveTab(location.pathname);
  }, [location.pathname]);

  // 탭 최대 10개 제한
  useEffect(() => {
    if (tabs.length > 20) {
      setTabs(prevTabs => prevTabs.slice(0, 20));
    }
  }, [tabs.length, setTabs]);

  // 스크롤 버튼 표시 여부 확인
  useEffect(() => {
    if (tabHeaderRef.current) {
      const { scrollWidth, clientWidth } = tabHeaderRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  }, [tabs]);

  // 전체 탭 닫기 (홈 탭은 유지)
  const closeAllTabs = () => {
    const homeTab = tabs.find(tab => tab.path === '/home');
    setTabs(homeTab ? [homeTab] : []);
    if (homeTab) {
      setActiveTab('/home');
      navigate('/home');
    }
  };

  // 스크롤 이동 함수
  const scrollTabs = (direction) => {
    if (tabHeaderRef.current) {
      const scrollAmount = 200; // 한 번에 스크롤할 양
      const newScrollLeft = direction === 'left'
        ? Math.max(0, tabHeaderRef.current.scrollLeft - scrollAmount)
        : tabHeaderRef.current.scrollLeft + scrollAmount;

      tabHeaderRef.current.scrollLeft = newScrollLeft;
      setScrollLeft(newScrollLeft);
    }
  };

  return (
    <div className="tab-router">
      <div className="tab-header-container">
        <div
          className="tab-header"
          ref={tabHeaderRef}
          onScroll={(e) => setScrollLeft(e.target.scrollLeft)}
        >
          {tabs.map(tab => (
            <div
              key={tab.path}
              className={`tab-item ${activeTab === tab.path ? 'active' : ''}`}
              style={{ fontSize: '0.8rem' }}
              onClick={() => {
                setActiveTab(tab.path);
                navigate(tab.path);
              }}
            >
              {tab.title}
              {tab.path !== '/home' && ( // 홈 탭은 닫기 버튼 제외
                <span
                  className="tab-close"
                  style={{ fontSize: '0.8rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.path);
                  }}
                >
                  ×
                </span>
              )}
            </div>
          ))}
        </div>

        {showScrollButtons && scrollLeft > 0 && (
          <button
            className="scroll-button left"
            onClick={() => scrollTabs('left')}
          >
            ◀
          </button>
        )}
        {showScrollButtons && (
          <button
            className="scroll-button right"
            onClick={() => scrollTabs('right')}
          >
            ▶
          </button>
        )}
        <button
          className="close-all-button"
          onClick={closeAllTabs}
          title="모든 탭 닫기"
        >
          ✕
        </button>
      </div>

      <div className="tab-content">
        {/* 탭 기반 렌더링 */}
        {tabs.map(tab => (
          <div
            key={tab.path}
            className={`tab-pane ${activeTab === tab.path ? 'active' : ''}`}
            style={{
              display: activeTab === tab.path ? 'block' : 'none',
              /*padding: '20px',*/
              height: 'calc(100% - 30px)', // 탭 헤더 높이 고려
              overflow: 'auto'
            }}
          >
            {tab.component}
          </div>
        ))}
        <Routes>
          <Route path="/" element={<div style={{display: 'none'}} />} />
          <Route path="/home" element={<div style={{display: 'none'}} />} />
          <Route path="/whlocmgmt" element={<div style={{display: 'none'}} />} />
          <Route path="/itemcdmgmt" element={<div style={{display: 'none'}} />} />
          <Route path="/commoncodemgmt" element={<div style={{display: 'none'}} />} />
{/*
          <Route path="/submenu11" element={<div style={{display: 'none'}} />} />
          <Route path="/submenu12" element={<div style={{display: 'none'}} />} />
          <Route path="/submenu21" element={<div style={{display: 'none'}} />} />
          <Route path="/submenu22" element={<div style={{display: 'none'}} />} />
          <Route path="/submenu31" element={<div style={{display: 'none'}} />} />
          <Route path="/submenu41" element={<div style={{display: 'none'}} />} />
*/}
        </Routes>
      </div>
    </div>
  );
};

export default TabRouter;
