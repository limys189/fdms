import { createContext, useContext, useState } from 'react';

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  const addTab = (newTab) => {
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(tab => tab.path === newTab.path);
      if (!existingTab) {
        return [...prevTabs, newTab];
      }
      return prevTabs;
    });
    setActiveTab(newTab.path);
  };

  const closeTab = (path) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab.path !== path));
  };

  return (
    <TabContext.Provider value={{ tabs, activeTab, addTab, closeTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => useContext(TabContext);
