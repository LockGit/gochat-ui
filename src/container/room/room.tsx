import TextArea from "antd/es/input/TextArea";
import {Button, Descriptions, Tabs, Form, message} from "antd";
import React, {useEffect, useState, useRef} from "react";
import './room.css';
import {GithubOutlined, UserOutlined} from "@ant-design/icons";
import {SocketUrl} from "../../api/env";
import {getAuthToken, getRoomInfo, pushRoom} from "../../api/api";

let websocket = new WebSocket(SocketUrl);

const Room = () => {
    const {TabPane} = Tabs;
    const [form] = Form.useForm();
    const [msgList, setMsgList] = React.useState<string[]>([]);
    const [userOnlineCnt, setUserOnlineCnt] = useState(0);
    const [onlineUserList, setOnlineUserList] = useState([]) as any;
    const [active, setActive] = useState('room');

    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    const scrollToBottom = () => {
        messagesEndRef?.current?.scrollTo(0, messagesEndRef?.current?.scrollHeight as number);
    }

    const onChangeGetRoomInfo = (e:string) => {
        setActive(e);
        getRoomInfo({"authToken": getAuthToken(), "roomId": 1});
    };

    useEffect(() => {
        scrollToBottom();
        const authData = {"authToken": getAuthToken(), "roomId": 1} //默认加入房间id=1
        websocket.onopen = function (evt) {
            console.log("ws onopen evt:", evt);
            websocket.send(JSON.stringify(authData));
            const roomInfo = getRoomInfo(authData);
            Promise.all([roomInfo]).then((ret) => {
                const [response] = ret;
                console.log("ws roomInfo response:", response);
            })
        };

        websocket.onmessage = function (evt) {
            console.log("ws onmessage evt:", evt);
            let data = JSON.parse(evt.data) as any;
            console.log("ws onmessage:", data);
            if (data.op === 3) {
                const msgItem = data.fromUserName + '(' + data.createTime + '):' + data.msg;
                let historyMsgList = msgList.slice();
                historyMsgList.push(msgItem);
                if (historyMsgList.length > 20000) {
                    window.location.reload()
                    return
                }
                setMsgList(historyMsgList);
            } else if (data.op === 4) {
                setUserOnlineCnt(data.count);
            } else if (data.op === 5) {
                setUserOnlineCnt(data.count);
                // get room user list
                let userNameList = [];
                for (let k in data.roomUserInfo) {
                    let userName = data.roomUserInfo[k];
                    userNameList.push(userName)
                }
                setOnlineUserList(userNameList);
            }
        }
    }, [msgList,setActive]);

    const clearText = () => {
        form.resetFields();
    };


    const sendText = () => {
        setActive("room");
        const validate = form?.validateFields();
        Promise.all([validate]).then((ret) => {
            const [v] = ret;
            console.log("validate:", v);
            const msg = form.getFieldsValue().msg;
            const params = {
                op: 5,
                roomId: 1,
                authToken: getAuthToken() as string,
                msg: msg,
            }
            console.log("params:", params);
            const res = pushRoom(params) as any;
            Promise.all([res]).then((ret) => {
                const [response] = ret;
                console.log("response:", response);
                if (response?.code !== 0) {
                    message.error("发送失败,登录已失效，请重新登录刷新页面重试");
                }
                form.resetFields();
            }).catch(e => {
                console.log("inner e:", e);
                message.error('发送失败,登录已失效，请重新登录刷新页面重试');
            });
        }).catch(e => {
            console.log("e:", e);
            message.error('发送消息不能为空');
        });
    }

    // @ts-ignore
    return (
        <div className="room">
            <div className="info">
                <Descriptions title=""
                              size="small"
                              bordered
                              column={{xxl: 4, xl: 3, lg: 3, md: 4, sm: 2, xs: 1}}
                >
                    <Descriptions.Item label="房间名:">gochat</Descriptions.Item>
                    <Descriptions.Item label="在线人数:">{userOnlineCnt}</Descriptions.Item>
                    <Descriptions.Item label="Github:">
                        <a href="https://github.com/LockGit/gochat" target="_blank">
                            <GithubOutlined/>
                        </a>
                    </Descriptions.Item>
                </Descriptions>
                <div className="card-container">
                    <Tabs type="card" onChange={onChangeGetRoomInfo} activeKey={active}>
                        <TabPane tab="聊天室" key="room">
                            <div className="message-container" ref={messagesEndRef}>
                                <div className="msg" id="msg">
                                    {
                                        msgList.length > 0 && msgList.map((item, index) => {
                                            return <p key={index}>{item}</p>;
                                        })
                                    }
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="在线成员" key="member">
                            {
                                onlineUserList.length > 0 && onlineUserList.map((name: string, index: number) => {
                                    return <p key={index}><UserOutlined/>{name}</p>
                                })
                            }
                        </TabPane>
                    </Tabs>
                </div>
            </div>
            <div style={{margin: "1px 0 0 0", height: "55px"}}>
                <Form name="send" form={form} onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        sendText();
                    }
                }}>
                    <Form.Item name="msg" rules={[{required: true, message: '消息长度1~255', max: 255}]}>
                        <TextArea ref={(input) => {
                            if (input != null) {
                                input.focus();
                            }
                        }} style={{background: "azure"}} placeholder="请输入您要发送的消息"/>
                    </Form.Item>
                </Form>
            </div>
            <div className="send">
                <Button style={{margin: "5px 5px 0 0"}} type="primary" onClick={clearText}>清空</Button>
                <Button style={{margin: "5px 0 0 0"}} type="primary" onClick={sendText}>发送</Button>
            </div>
        </div>
    )
};

export default Room;