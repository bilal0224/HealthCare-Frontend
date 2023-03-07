import React, { useEffect } from "react"
import {Modal,Button,Radio,Input,Space} from 'antd'
import { useState } from "react";
import client from "./api/auth";


const MyModal = ({handleQuestion}) =>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState(1);
    const [rootQuestions,setRootQuestions] = useState([])
    const token = localStorage.getItem("token")

    useEffect(()=>{
      client.get('/questions/get-all-root', { headers: { "x-api-key": token } })
          .then((response) => {
            setRootQuestions(response.data.map((item)=>{
              return {key:item._id,value:item.statement}
            }))
          })
    },[])
    
    const onChange = (e) => {
        console.log('radio checked',e.target.value);
        setValue(e.target.value);
    }
    const showModal = () => {
        setIsModalOpen(true);
      };
      const handleOk = () => {
        setIsModalOpen(false);
        console.log(rootQuestions.find(item => item.key ==value))
        handleQuestion(rootQuestions.find(item => item.key == value))

      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
    return(
        <>
        <Button type="primary" onClick={showModal}>
                Link
            </Button>
            <Modal title="Link a Question" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Radio.Group onChange={onChange} value={value}>
                <Space direction="vertical">
                    {rootQuestions.map((item)=>(
                        <Radio value={item.key}>{item.value}</Radio>
                    ))}
                </Space>
              </Radio.Group>
            </Modal>
        </>
    )
}


export default MyModal;