import React from 'react';
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import Main from './components/Main'
import './App.css';

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider)
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Main />
    </Web3ReactProvider>
  );
}

export default App;
