import {  PlusOutlined ,MinusCircleOutlined } from '@ant-design/icons';
import {  Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space  } from 'antd';
import {  useState  } from 'react';
import React from 'react';
import client from './api/auth';

const { Option } = Select;
const buckets = []

const MyDrawer = ({handleBuckets, edit, content}) => {

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formContent,setFormContent] = useState({})
  const token = localStorage.getItem("token")

  const showDrawer = () => {
    setOpen(true);
    form.setFieldsValue(content)
    //console.log(content)
    setFormContent(content)
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields()
  };

  const handleChange = (value) => {
  }

  const addBucket= async (bucket)=>{
    await client.post('/symptoms/add',{bucket_name:bucket.bucket_name,symptom_groups:bucket.symptom_groups},{headers:{"x-api-key":token}})
    .then((response)=>{
      console.log(response.data)
      handleBuckets(null,response.data,edit) 
    })
    .catch((err)=>{
      console.error(err)
    })
  }

  const handleFormSubmit = ()=>{
    form.validateFields()
    .then((bucket)=>{
        if(edit){
          handleBuckets(formContent,bucket,edit) 
          setOpen(false)
        }
        else{
        addBucket(bucket)
        setOpen(false)
        form.resetFields()
        }
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  return (
    <>
      { edit ?
      <Button onClick={showDrawer} type="primary">Edit</Button>:
      <Button type="primary" style={{margin:'16px 0 5px 0'}}onClick={showDrawer} icon={<PlusOutlined />}>
      Add Symptom Bucket
      </Button>
      }
    
      <Drawer
        title={edit ? "Edit Symptoms Bucket": "Create Symtpoms Bucket"}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose} htmlType="reset">Cancel</Button>
            <Button type="primary" htmlType='submit' onClick={handleFormSubmit}>
              {edit?"Edit":"Submit"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bucket_name"
                label="Bucket Name"
                //validateTrigger={OnFinish}
                rules={[
                  {
                    required: true,
                    message: "Please enter bucket name",
                  },
                  {
                    validator: !edit ? (_,value) =>{
                    if (buckets.find(item => item.bucket_name == value) == null){
                      return Promise.resolve(); 
                    }
                    return Promise.reject(new Error('this bucket name already exist'));
                    }:null
                  }

                ]}
              >
                <Input placeholder="Please enter bucket name" 
                />
             </Form.Item>
             <Form.List
                name="symptom_groups"
              > 
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        required={true}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              message: "Please add input or delete this field",
                            },
                          ]}
                          noStyle
                        >
                           <Select
                              mode="tags"
                              style={{
                                width: '60%',
                              }}
                              placeholder="Add Symptoms List"
                              onChange={handleChange}
                            />
                        </Form.Item>
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{
                          width: '60%',
                        }}
                        icon={<PlusOutlined />}
                      >
                        New Symptoms List
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
      </Form.List>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default MyDrawer;
