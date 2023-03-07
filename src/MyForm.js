import React, { useState } from 'react';
import { useEffect } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd'; 

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const MyForm = ({handleQuestion,formValues,editt}) => {

  const [form] = Form.useForm();
  const [currentNodeId, setCurrentNodeId] = useState("")
  useEffect(()=>{
    if(editt){
      //console.log(formValues)
      setCurrentNodeId(formValues.key)
      const data = {statement:formValues.title,options:formValues.children.map(item=>item.title)}
      form.setFieldsValue(data)
    }
  },[])
  

  const onFinish = (values) => {
    form.validateFields()
    console.log(values)
    handleQuestion(values,currentNodeId)
    form.resetFields()
  }


  return (
    <Form form={form}
      name="dynamic_form_item"
      {...formItemLayout}
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item label="Statement" name="statement">
          <Input placeholder='Enter Question' required= {true}
          style={{
            width: '60%',
          }}/>
      </Form.Item>
      <Form.List
        name="options"
      > 
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(formItemLayout)}
                label={`${index+1}`}
                required={true}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please add input or delete this field",
                    },
                  ]}
                  noStyle
                >
                  <Input
                    placeholder="Enter Answer Option"
                    style={{
                      width: '60%',
                    }}
                  />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
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
                Add field
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}  
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit" > 
          Save Question
        </Button>
      </Form.Item>
    </Form>
  );
};
export default MyForm;
