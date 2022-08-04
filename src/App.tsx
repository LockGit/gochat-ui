import {Layout} from 'antd';
import React from 'react';
import './App.css';
import Room from "./container/room/room";
import Video from "./container/video/video";
import PageHeader from './container/common/header';
import PageFooter from './container/common/footer';
import PageTags from "./container/common/tag";

const {Header, Content, Footer} = Layout;

const App = () => (
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
                <div className="main">
                    <Video/>
                    <Room/>
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
);

export default App;