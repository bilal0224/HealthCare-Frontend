import React from 'react';
import HomePage from './HomePage';
import MyFooter from './myFooter';
import MyHeader from './myHeader';

const contentStyle = {
    height:'100%',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

const Home = () => {
  return (
    <>
    <MyHeader/>
    <HomePage/>
    <MyFooter/>
    </>
  );
};

export default Home;
