'use client'
import MyGraph from './components/graph'
import Nav from './components/Nav'
import { useState } from 'react'
import SideBar from './components/SideBar'
import ActionMenu from './components/ActionMenu'
import cytoscape from 'cytoscape'

export default function Home() {
    const [graphType, setGraphType] = useState('');
    const [cyInstance, setCyInstance] = useState<cytoscape.Core | null>(null)

    const handleGraphTypeFromChild = (graphType: string) => {
        setGraphType(graphType);
    };

    const myStyle = {
        border: "black",
        borderStyle: "solid",
        borderWidth: "thin",
        borderRadius: "8px",
    };
    const anotherStyle = {
        marginLeft: "80px",
        marginRight: "80px",
        marginTop: "20px",
        marginBottom: "20px",
    };
    

    return (
        <>
            <Nav />
            <div className="grid grid-cols-5 gap-2">
                <div className="col-span-5"></div>
                <div className="col-span-5"></div>
                <div className="grid grid-cols-5 gap-2 col-span-5" style={anotherStyle}>
                    <div className="col-span-4 ">
                        <div className="col-span-4 flex justify-center items-center" style={{ ...myStyle, height: '80vh' }}>
                            <MyGraph type={graphType} onCyReadyAction={setCyInstance} />
                        </div>
                        <div className="flex justify-center gap-2 col-span-10 items-center w-full my-6">
                            <ActionMenu />
                        </div>
                    </div>
                    <div className="col-span-1 row-span-3">
                        <SideBar onGraphTypeSet={handleGraphTypeFromChild}
                            cy={cyInstance} />
                    </div>

                </div>

            </div>
        </>
    );
}
