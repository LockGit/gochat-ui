import {Button, Form, Input, Layout, message} from "antd";
import PageHeader from "../common/header";
import PageFooter from "../common/footer";
import React from "react";
import PageTags from "../common/tag";
import {UserAddOutlined} from '@ant-design/icons';
import './register.css';
import {setAuthToken, userRegister} from "../../api/api";

const {Header, Content, Footer} = Layout;

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

const Register = () => {
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        const jsonParams = {userName: values.username, passWord: values.password};
        console.log('post data:', jsonParams);
        const res = userRegister(jsonParams) as any;
        Promise.all([res]).then((ret) => {
            const [response] = ret as any;
            if (response?.code !== 0) {
                message.error(response?.message);
                return
            }
            setAuthToken(response?.data);
            message.success("注册成功");
            setTimeout(function () {
                window.location.href = "/";
            }, 500);
            return
        }).catch((e) => {
            console.log(e);
            message.error(e.message);
            return
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        message.error('注册出错了');
    };

    return (
        <Layout>
            <Header
                style={{
                    position: 'fixed',
                    zIndex: 1,
                    width: '100%',
                }}
            >
                <PageHeader/>
            </Header>
            <Content
                className="site-layout"
                style={{
                    padding: '0 50px',
                    marginTop: 64,
                }}
            >
                <PageTags/>
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 500,
                    }}
                >
                    <div className="register">
                        <div className="register-form">
                            <h1><span><UserAddOutlined/>用户注册</span></h1>
                            <Form
                                form={form}
                                name="register"
                                {...layout}
                                initialValues={{remember: true}}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="用户名"
                                    name="username"
                                    rules={[{required: true, message: 'Please input your username!'}]}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    label="密码"
                                    name="password"
                                    rules={[{required: true, message: 'Please input your password!'}]}
                                >
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                    <Button type="primary" htmlType="submit">
                                        注册
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                <PageFooter/>
            </Footer>
        </Layout>
    )
}

export default Register;