import React from 'react';
import './App.css';
import Layout from "./components/Layout";
import ConnectButton from './components/ConnectButton';
import { ChakraProvider, extendTheme  } from "@chakra-ui/react";

function App() {

  const theme= extendTheme({
    fonts: {
      body: `'Poppins', sans-serif`,
    },
    fontSizes: {
      md: '14px',
    }
  })
  
  return (
    <ChakraProvider theme={theme} >
      <Layout>
        <ConnectButton />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
