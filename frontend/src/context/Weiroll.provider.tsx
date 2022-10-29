import React, { useEffect, useState, useContext } from "react";
import weiroll from "@weiroll/weiroll.js";
interface Props {
  children: React.ReactNode;
}

const WeirollContext = React.createContext<any>(null);

const useWeirollPlanner = () => {
  const context = useContext(WeirollContext);
  if (context === undefined) {
    throw new Error("useWeirollProvider must be used within a WeirollProvider");
  }
  return context;
};

const WeirollProvider: React.FC<Props> = ({ children }) => {
  const [weirollPlanner, setWeirollPlanner] = useState() as any;

  useEffect(() => {
    const planner = new weiroll.Planner();
    if (!weirollPlanner) setWeirollPlanner(planner);
  }, []);

  return (
    <WeirollContext.Provider value={weiroll}>
      {children}
    </WeirollContext.Provider>
  );
};

export { WeirollProvider, useWeirollPlanner };
