import React from 'react';
import {StoresContext} from './configureStore';

export const useStores = () => React.useContext(StoresContext);
