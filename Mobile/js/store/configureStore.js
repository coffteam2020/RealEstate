import { UserStore } from "./UserStore";
import React from "react";
import { HomeStore } from "./HomeStore";

export const StoresContext = React.createContext({
	userStore: new UserStore(),
	homeStore: new HomeStore(),
});

export const MobxProvider = ({children, value}) => <StoresContext.Provider value={value}>{children}</StoresContext.Provider>;
