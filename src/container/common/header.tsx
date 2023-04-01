import {TeamOutlined} from "@ant-design/icons";
import {Menu} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {Link} from "react-router-dom";
import {LogoutOutlined} from "@ant-design/icons";
import {checkAuth, clearAuthToken, getAuthToken, userLogout} from "../../api/api";


const allItems = [
    {label: '登录(Login)', key: '/login'}, // 菜单项务必填写 key
    {label: '注册(Register)', key: '/register'},
];

const logoutItems = [
    {label: "退出(Logout)", key: '/logout', icon: <LogoutOutlined/>}, // 菜单项务必填写 key
];


const PageHeader = () => {
    const [userName, setUserName] = useState('');
    const [items, setItems] = useState(allItems) as any;
    const authToken = getAuthToken() as string;
    const renderRef = useRef(true);

    const onMenuClick = ({key}: any) => {
        console.log("--", key);
        if (key === "/logout") {
            const res = userLogout({"authToken": authToken}) as any;
            Promise.all([res]).then((ret) => {
                const [response] = ret;
                if (response?.code === 0 && response !== undefined) {
                    clearAuthToken();
                    setItems(allItems);
                    setUserName('');
                }
            }).catch((e) => {
                console.log("error:", e);
            })
        } else {
            window.location.href = key;
        }
    };

    useEffect(() => {
        if (renderRef.current) {
            renderRef.current = false;
            const res = checkAuth({"authToken": authToken}) as any;
            Promise.all([res]).then((ret) => {
                const [response] = ret;

                if (response?.data?.userName !== '' && response !== undefined) {
                    setUserName(response?.data?.userName);
                    setItems(logoutItems);
                }
            }).catch((e) => {
                console.log("error:", e);
            })
        }
    }, [authToken]);

    return (
        <div>
            <div className="logo"/>
            <div className="header">
                <div className="header_name">
                    <Link to="/"><span><TeamOutlined/>分布式即时通讯系统(gochat)</span></Link>
                </div>
                <div className="menu">
                    {
                        userName !== '' &&
                        <div className="nick_name">您好：{userName}</div>
                    }
                    <Menu theme="dark" mode="horizontal" items={items}
                          onClick={onMenuClick}></Menu>
                </div>
            </div>

        </div>
    );
}

export default PageHeader;