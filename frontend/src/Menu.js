import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Menu.css";

import Home from "./pages/Home";
import CommonCodeMgmt from "./pages/admin/CommonCodeMgmt";
import WhLocMgmt from "./pages/md/WhLocMgmt";
import ItemCdMgmt from "./pages/md/ItemCdMgmt";
//import SubMenu11 from "./pages/SubMenu11";
//import SubMenu12 from "./pages/SubMenu12";


const Menu = ({ addTab }) => {  // addTab prop 추가
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [activeMenus, setActiveMenus] = useState([]);

  const menuItems = [
    { title: "HOME", path: "/home", component: <Home />, },
    {
      title: "기초자료",
      submenu: [
        { title: "창고위치관리", path: "/whlocmgmt", component: <WhLocMgmt />, },
        { title: "품목관리", path: "/itemcdmgmt", component: <ItemCdMgmt />, },
      ],
    },
    {
      title: "관리자",
      submenu: [
        { title: "공통코드관리", path: "/commoncodemgmt", component: <CommonCodeMgmt />, },
      ],
    },
/*
    {
      title: "메인메뉴1",
      submenu: [
        {
          title: "서브메뉴1-1",
          submenu: [
            { title: "상세메뉴1-1-1", path: "/submenu11", component: <SubMenu11 />, },
            { title: "상세메뉴1-1-2", path: "/submenu12", component: <SubMenu12 />, }
          ]
        }
      ]
    }
*/
  ];

  // 메뉴 토글 함수 수정
  const toggleMenu = (menuTitle, depth) => {
    setActiveMenus(prev => {
      // 이미 활성화된 메뉴인 경우 제거 (접기)
      if (prev.includes(menuTitle)) {
        return prev.filter(item => item !== menuTitle);
      }

      // 같은 depth의 다른 메뉴들은 닫고 새로운 메뉴 열기
      return [
        ...prev.filter(item => {
          const menuItem = findMenuItem(item, menuItems);
          return getMenuDepth(menuItem, menuItems) !== depth;
        }),
        menuTitle
      ];
    });
  };

  // 메뉴 아이템 찾기 헬퍼 함수
  const findMenuItem = (title, items) => {
    for (let item of items) {
      if (item.title === title) return item;
      if (item.submenu) {
        const found = findMenuItem(title, item.submenu);
        if (found) return found;
      }
    }
    return null;
  };

  // 메뉴 depth 찾기 헬퍼 함수
  const getMenuDepth = (menuItem, items, depth = 0) => {
    for (let item of items) {
      if (item === menuItem) return depth;
      if (item.submenu) {
        const foundDepth = getMenuDepth(menuItem, item.submenu, depth + 1);
        if (foundDepth !== -1) return foundDepth;
      }
    }
    return -1;
  };

  // 메뉴 아이템 클릭 핸들러 수정
  const handleMenuItemClick = (item) => {
    if (item.path) {
      // 새 탭 추가
      addTab({
        path: item.path,
        title: item.title,
        component: item.component
      });
      navigate(item.path);
      // 페이지 이동 시 모든 메뉴 접기
      setActiveMenus([]);
    } else {
      const depth = getMenuDepth(item, menuItems);
      // 이미 열려있는 메뉴를 다시 클릭하면 접기
      if (activeMenus.includes(item.title)) {
        setActiveMenus(prev => prev.filter(menu => menu !== item.title));
      } else {
        toggleMenu(item.title, depth);
      }
    }
  };

  const renderMenu = (items, depth = 0) => {
    return (
      <ul className={`menu-depth-${depth}`} style={{
        display: "flex",
        flexDirection: depth === 0 ? "row" : "column",
        gap: depth === 0 ? "0.5rem" : "0.3rem",
        width: "fit-content",
//        background: depth === 0
//          ? "linear-gradient(135deg, #6e8efb, #a777e3)"
//          : "linear-gradient(135deg, #f0f4ff, #e8e6ff)",
        background: "linear-gradient(135deg, #6e8efb, #a777e3)",
        padding: depth === 0 ? "5px 10px" : "3px",
        borderRadius: "8px",
//        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        {items.map((item, index) => (
          <li key={index} style={{ position: "relative" }}>
            <div
              className={`menu-item ${activeMenus.includes(item.title) ? "active" : ""}`}
              onClick={() => handleMenuItemClick(item)}
              style={{
                whiteSpace: "nowrap",
//                color: depth === 0 ? "#ffffff" : "#666666",
                color: "#ffffff",
                fontWeight: depth === 0 ? "600" : "500",
                padding: "0px 16px",
                borderRadius: "6px",
                transition: "all 0.3s ease",
                background: activeMenus.includes(item.title) ? "rgba(255, 255, 255, 0.1)" : "transparent"
              }}
            >
              {item.title}
              {item.submenu && (
                <span
                  className="arrow"
                  style={{
//                    color: depth === 0 ? "#ffffff" : "#666666"
                    color: "#ffffff",
                  }}
                >▼</span>
              )}
            </div>
            {item.submenu && activeMenus.includes(item.title) && (
              <div
                style={{
                  position: depth === 0 ? "absolute" : "relative",
                  top: depth === 0 ? "100%" : "auto",
                  left: depth === 0 ? "0" : "auto",
                  zIndex: 1000,
                  width: "fit-content",
                  background: "linear-gradient(135deg, #f0f4ff, #e8e6ff)",
//                  borderRadius: "8px",
//                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  padding: "3px",
                  marginTop: depth === 0 ? "3px" : "0",
                }}
              >
                {renderMenu(item.submenu, depth + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenus([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav ref={menuRef} className="menu-container" style={{padding: "0 0"}}>
      {renderMenu(menuItems)}
    </nav>
  );
};

export default Menu;
