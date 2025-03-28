import {Button} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import React from "react";


const HeaderContent: React.FC = () => {

    return (
        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            {/* Left side of header: Title, Projects dropdown, Create button */}
            <div
                style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginRight: '16px'
                }}
            >
                Issue Tracker
            </div>

            <Button type="text" style={{marginRight: '16px'}}>
                Projects <DownOutlined/>
            </Button>

            <Button
                type="primary"
                icon={<PlusOutlined/>}
                style={{marginRight: '16px'}}
            >
                Create Project
            </Button>

            {/*This should be over the content*/}

            {/* Right side of header: CV button */}
            <Button>CV</Button>
        </div>
    )
}

export default HeaderContent;