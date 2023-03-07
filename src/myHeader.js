import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'
const { Header } = Layout;

const MyHeader = () => {
  return (
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
        <Menu.Item key='1'>
          <span>Home</span>
          <Link to="/" />
        </Menu.Item>
        <Menu.Item key="2">
          <span>Patient Portal</span>
          <Link to="/patient_portal"  />
        </Menu.Item>
        <Menu.SubMenu title="Doctor Portal" key="3">
          <Menu.Item key="21">
            <span>Symptoms</span>
            <Link to="/doctor_portal/symptoms" />
          </Menu.Item>
          <Menu.Item key="22">
            <span>Questions</span>
            <Link to="/doctor_portal/questions" action="replace"/>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
      </Header>
  );
};

export default MyHeader;