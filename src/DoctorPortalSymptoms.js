import React from 'react';
import {  Breadcrumb, Layout, Menu, theme, Button,Card, Divider} from 'antd';
import { useState,useEffect } from 'react';
import MyModal from './modal';

import MyDrawer from './MyDrawer';
import client from './api/auth';
import MyHeader from './myHeader';
import MyFooter from './myFooter';
const { Content, Sider } = Layout;

const DoctorPortalSymptoms = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [menuItems,setMenuItems]=useState([])
  const [buckets,setBuckets] = useState([])
  const [card,setCard]=useState(false)
  const [cardContent,setCardContent] =useState({})
  const [questionContent,setQuestionContent] = useState("")
  const token = localStorage.getItem("token")
  
  const handleQuestion = (value) =>{
    client.put(`/symptoms/update/${cardContent._id}`,{_id:cardContent._id,bucket_name:cardContent.bucket_name,symptom_groups:cardContent.symptom_groups,question_id:value.key},{headers:{"x-api-key":token}})
    .then((response) =>{
        //console.log(response.data)
    })
    .catch((err)=>{
        console.error(err)
    })
  }
  
  const deleteBucket = (_id) =>{
    client.delete(`/symptoms/delete/${_id}`,{headers:{"x-api-key":token}})
    .then((response)=>{
        console.log(response.data)
    })
    .catch((err)=>{
        console.error(err)
    })
  }

  const handleDelete = () =>{
    console.log(cardContent)
    const to_be_deleted_bucket = buckets.find(item=> item._id == cardContent?._id)
    var index = buckets.indexOf(to_be_deleted_bucket)
    // /console.log(index)
    deleteBucket(to_be_deleted_bucket._id)
    buckets.splice(index,1)
    setBuckets(buckets)
    setCardContent({})
    setCard(false)
    setMenuItems(buckets.map((key) => ({
        key: key._id,
        label: `${key.bucket_name}`
      })))

  }

  const handleMenuItem = ({key}) =>{
    setCard(true)
    setCardContent(buckets.find(item => item._id == key))
  }

  const updateBucket = (bucket) =>{
    client.put(`/symptoms/update/${bucket._id}`,{_id:bucket._id,bucket_name:bucket.bucket_name,symptom_groups:bucket.symptom_groups,question_id:bucket.question_id},{headers:{"x-api-key":token}})
    .then((response) =>{
        console.log(response.data)
        setCardContent(response.data)
    })
    .catch((err)=>{
        console.error(err)
    })
  }
  
  const handleBucket = (current_bucket,bucket,edit)=>{
    if (edit){
        //console.log(bucket)
        const bucket_with_id = buckets.find(item=> item.bucket_name == current_bucket.bucket_name)
        bucket_with_id.bucket_name = bucket.bucket_name
        bucket_with_id.symptom_groups= bucket.symptom_groups
        updateBucket(bucket_with_id)
       
    }
    else{
    buckets.push(bucket)
    setBuckets(buckets)
    setMenuItems(buckets.map((key) => ({
            key: key._id,
            label: `${key.bucket_name}`
          })))
        }
  }

    // calls
    useEffect(()=>{
        client.get('/symptoms/get-all',{headers:{"x-api-key":token}})
        .then((response)=>{
            console.log(response.data)
            setBuckets(response.data)
            setMenuItems(response.data.map((key) => ({
            key: key._id,
            label: `${key.bucket_name}`
          })))

        })
        .catch((err)=>{
            console.error(err)
          })
        }
    ,[cardContent])
  
  return (
    <>
    <MyHeader/>
    <Layout>
        <Content
        style={{
          padding: '0 50px',
        }}
      >
        <MyDrawer handleBuckets={handleBucket} edit={false}/>

        <Breadcrumb
          style={{
            margin: '10px 0',
          }}
        >
          <Breadcrumb.Item>Symptoms</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{
            padding: '24px 0',
            background: colorBgContainer,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              mode="vertical"
              style={{
                width:"100%"
              }}
              items={menuItems}
              onClick={handleMenuItem}
            />
            
          </Sider>
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >{ card &&
            <Card
            title={cardContent.bucket_name}
            bordered={false}
            style={{
            width: 300,
            }}
            >
            {
            (cardContent.symptom_groups)?.map((key)=>( 
                <> 
                <div key={key}>
                    {key.map((new_key,index)=>(
                        <div style={{display: "inline" }}>{new_key}
                        { index < key.length-1 &&
                            <span>,</span>
                        }
                        </div>

                    ))}
                </div>
                <Divider/>
                {/* <div key={questionContent.key}>{questionContent.value}</div> */}
                </>
            ))
            }   
            <>
            <MyDrawer edit={true} content={cardContent} handleBuckets={handleBucket} ></MyDrawer>
            <Button type="primary" style={{margin:"20px 5px 0"}} onClick={handleDelete}>Delete</Button>
            <MyModal handleQuestion={handleQuestion}/>
            </>
            </Card>}
          </Content>
        </Layout>
      </Content>
    </Layout>
    <MyFooter/>
    </>
  );
};

export default DoctorPortalSymptoms;
