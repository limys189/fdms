import React, { useState } from "react";
import { GlobalProvider } from './GlobalContext';
import { MemoryRouter } from 'react-router-dom';
import { TabProvider } from './TabContext';
import TabRouter from './TabRouter';
import Menu from "./Menu";
import './styles.css';

const App = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  const addTab = (newTab) => {
    setTabs(prevTabs => {
      const existingTabIndex = prevTabs.findIndex(tab => tab.path === newTab.path);
      if (existingTabIndex >= 0) {
        setActiveTab(newTab.path);
        return prevTabs;
      }
      return [...prevTabs, newTab];
    });
    setActiveTab(newTab.path);
  };

  const closeTab = (path) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.path !== path);
      return newTabs;
    });
  };

  return (
    <GlobalProvider>
      <MemoryRouter>
        <TabProvider>
          <div className="app-layout">
            <div className="menu-area">
              <Menu addTab={addTab} />
            </div>
            <div className="content-area">
              <TabRouter
                tabs={tabs}
                setTabs={setTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                addTab={addTab}
                closeTab={closeTab}
              />
            </div>
          </div>
        </TabProvider>
      </MemoryRouter>
    </GlobalProvider>
  );
};

export default App;
