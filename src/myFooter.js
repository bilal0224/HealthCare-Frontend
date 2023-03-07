import { Layout } from 'antd';
const { Footer } = Layout;

const MyFooter = () => {
  return (
      <Footer
        style={{
          textAlign: 'center',
          position:'fixed',
          width: "100%",
          bottom:'0'
        }}
      >
        AI Checkup ©2023
      </Footer>
  );
};

export default MyFooter;