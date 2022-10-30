import React, { useEffect, useState, useContext } from "react";
import { Planner } from "@weiroll/weiroll.js";
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
    const planner = new Planner();
    if (!weirollPlanner) setWeirollPlanner(planner);
  }, []);

  return (
    <WeirollContext.Provider value={weirollPlanner}>
      {children}
    </WeirollContext.Provider>
  );
};

export { WeirollProvider, useWeirollPlanner };
