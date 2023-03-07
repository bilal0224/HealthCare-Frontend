import React, { useEffect, useState } from 'react';
import MyHeader from './myHeader';
import MyFooter from './myFooter';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button, Card, Divider } from 'antd';
import { Tree } from 'antd';
import MyForm from './MyForm'
import client from './api/auth';
import { createRoutesFromElements } from 'react-router-dom';
import { TreeNode } from 'antd/es/tree-select';
const { Content, Sider } = Layout;

const DoctorPortal = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [treeData, setTreeData] = useState([])
  const [card, setCard] = useState(false)
  const [cardContent, setCardContent] = useState({})
  const [edit,setEdit] = useState(false)
  const [event, setEvent] = useState(null)
  const [rootNode, setRootNode] = useState(false)
  const [del,setDelete] = useState(false)
  const [update,setUpdate] = useState(false)
  const token = localStorage.getItem("token")
  const fetchResult = (url) =>{
    return client.get(url, { headers: { "x-api-key": token } })
    .then(response => response.data)
  }

  const getResult= async (id)=>{
    return fetchResult(`/questions/get/${id}`)
    .then(async (data)=>{return{key:data._id,title:data.statement,children:await Promise.all(data.options.map(function(item){return getResultAux(item,data.statement)}))}} )
  }
  const getResultAux = async ( t = {}, statement) =>
    (t.next_question_id ? {key:Math.floor(Math.random() * (10000 - 1) + 1),title:t.option,children:  [(await getResult(t.next_question_id))]}:{key:Math.floor(Math.random() * (10000 - 1) + 1),title:t.option})
  

  useEffect(() => {
    client.get('/questions/get-all-root', { headers: { "x-api-key": token } })
      .then(async (response) => {

        const result = Promise.all(response.data.map(async (item1)=>{return {key:item1._id,title:item1.statement,children: await Promise.all(item1.options.map(async (item)=>{
         return item.next_question_id ? {key:Math.floor(Math.random() * (10000 - 1) + 1),title:item.option,children:[(await getResult(item.next_question_id))]} : {key: Math.floor(Math.random() * (10000 - 1) + 1),title: item.option}
        })).then(function(data){
          return data
        })
      }}))
        const tree = (await result)
        console.log(tree)
        setTreeData(tree)
      
      }
      )
      .catch((err) => {
        console.error(err)
      })
  }, [del,update])

  const handleDelete = () => {
    console.log(cardContent)
    client.delete(`/questions/delete/${cardContent.key}`,{headers:{"x-api-key":token}}).then(
      response => setDelete(true)

    )
    setCard(false)
  }

  const handleEdit = () => {
    setEdit(true)
  }

  const onSelect = (selectedKeys, info) => {
    //console.log(info)
    setEdit(false)
    setEvent(info)
    if (info.selected == true) {
      setCard(true)
      setCardContent(info.selectedNodes[0])
    }
    else {
      setCard(false)
    }
  };
  const handleRootNode = () => {
    setCard(true)
    setCardContent({})
    setRootNode(true)
  }

  const updatePropertyById = (key, data, property, value) => {
    if (data.key == key) {
      data[property] = value;
    }
    if (data.children !== undefined && data.children.length > 0) {
      for (let i = 0; i < data.children.length; i++) {
        data.children[i] = updatePropertyById(key, data.children[i], property, value);
      }
    }
    return data;
  }

  const pathTo = (array, target) => {
    var result;
    array.some(({ key, children = [] }) => {
      if (key === target) return result = key;
      var temp = pathTo(children, target)
      if (temp) return result = key + '.' + temp;
    });
    return result;
  };

  function searchTree(element, matchingTitle) {
    if (element.key == matchingTitle) {
      return element;
    } else if (element.children != null) {
      var i;
      var result = null;
      for (let i = 0; result == null && i < element.children.length; i++) {
        result = searchTree(element.children[i], matchingTitle);
      }
      return result;
    }
    return null;
  }

  const childIndex = (parent_node_childs) => {
    for (let i = 0; i < parent_node_childs.length; i++) {
      if (parent_node_childs[i].key == event.selectedNodes[0].key) {
        return i
      }
    }
    return null
  }

  const findRootIdx = (root_id) => {
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].key == root_id) {
        return i
      }
    }
  }

  const handleQuestion = (values,Id) => {
    const options = values.options.map((item) => { return { "option": item } })
    if (edit){
      client.put(`/questions/update/${Id}`, { statement: values.statement, options: options }, { headers: { "x-api-key": token } }).then(
        (response) => {
          setEdit(false)
          const res_data = {
            key: response.data._id,
            title: response.data.statement,
            children: response.data.options.map((item) => { return { "key": Math.floor(Math.random() * (10000 - 1) + 1), "title": item.option } })
          }
          setUpdate(true)
          setCard(true)
          setCardContent(res_data) 
        }
      )
    }
    else if (rootNode) {
      client.post('/questions/add-root', { statement: values.statement, options: options }, { headers: { "x-api-key": token } })
        .then((response) => {
          //console.log(response)
          const root_data = {
            key: response.data._id,
            title: response.data.statement,
            children: response.data.options.map((item) => { return { "key": Math.floor(Math.random() * (10000 - 1) + 1), "title": item.option } })
          }
          setTreeData(treeData.concat(root_data))
          setCardContent(root_data)
          setRootNode(false)
        })
        .catch((err) => {
          console.error(err)
        })
    }
    else {
      //console.log(treeData)
      const path = pathTo(treeData, event.selectedNodes[0].key)
      const path_lst = path.split(".")
      const parent_id = path_lst.at(-2)
      //console.log(parent_id)
      const root_id = path_lst.at(0)
      //console.log(root_id)
      const root_idx = findRootIdx(root_id)
      //console.log(root_idx)

      const parent_node = searchTree(treeData[root_idx], parent_id)
      const parent_node_childs = parent_node.children

      const option_idx = childIndex(parent_node_childs)
      //console.log(option_idx)

      const options = values.options.map((item) => { return { "option": item } })
      const data = {
        parent_id: parent_id,
        option_idx: option_idx,
        statement: values.statement,
        options: options
      }
      client.post('/questions/add', data, { headers: { "x-api-key": token } })
        .then((response) => {
          //console.log(response)
          const res_data = {
            key: response.data._id,
            title: response.data.statement,
            children: response.data.options.map((item) => { return { "key": Math.floor(Math.random() * (10000 - 1) + 1), "title": item.option } })
          }
          treeData[root_idx] = updatePropertyById(event.selectedNodes[0].key, treeData[root_idx], "children", [res_data]);

          setTreeData(treeData.map((item) => { return item }))
          setCardContent(res_data)
          //console.log(treeData)
        })
        
        .catch((err) => {
          console.error(err)
        })
    }
  }

  return (
    <>
      <MyHeader />
      <Layout>
        <Content
          style={{
            padding: '0 50px',
          }}
        >
          <Button type="primary" style={{ margin: '16px 0 5px 0' }} icon={<PlusOutlined />} onClick={handleRootNode}>
            Make a Root Poll
          </Button>
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Questions</Breadcrumb.Item>
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
              <Tree
                showLine
                allowDrop={true}
                switcherIcon={<DownOutlined />}
                onSelect={onSelect}
                treeData={treeData}
              />
            </Sider>
            <Content
              style={{
                padding: '0 24px',
                minHeight: 280,
              }}
            >
              {card && < Card
                title={cardContent.title}
                bordered={false}
                style={{
                  width: 500,
                }}
              >
                {cardContent.children && !edit?
                  cardContent.children.map((key) => (
                    <>
                      <div key={key}>
                        {key.title}
                      </div>
                      <Divider />
                    </>
                  ))
                  :
                  <MyForm handleQuestion={handleQuestion} formValues = {cardContent} editt={edit}/>
                }
                {cardContent.children && typeof cardContent.key=="string" && !edit?
                  <>
                    <Button type="primary" style={{ margin: "20px 5px 0" }} onClick={handleDelete}>Delete</Button>
                    <Button type="primary" style={{ margin: "20px 5px 0" }} onClick={handleEdit}>Edit</Button>
                  </>
                  : null
                }

              </Card>}
            </Content>
          </Layout>
        </Content>
      </Layout>
      <MyFooter />
    </>


  );
};

export default DoctorPortal;
