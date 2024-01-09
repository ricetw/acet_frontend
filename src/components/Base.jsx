import React, { useEffect, useState } from "react";

const Base = ({ children }) => {
    const [permissions, setPermissions] = useState(2);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch('https://localhost:5000/web/getpermissions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });
                const data = await response.json();
                console.log('data', data);
                if (data.result === 1) {
                    alert('請先登入')
                    window.location.href = '/login';
                }
                else {
                    setPermissions(data.permissions);
                }
            }
            catch (err) {
                console.log('err', err);
            }
        };

        getData();
    }, []);

    const hideElements = (ids) => {
        ids.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = "none";
            }
        });
    };

    const showElements = (ids) => {
        ids.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = "block";
            }
        });
    };

    useEffect(() => {
        hideElements(['personnel', 'medications', 'patients', 'medical_records', 'ward_bed', 'database', 'setting']);

        if (permissions === 2) {
            showElements(['medications', 'patients']);
        }
        else if (permissions === 1) {
            showElements(['personnel', 'medications', 'patients']);
        }
        else if (permissions === 0) {
            showElements(['personnel', 'medications', 'patients', 'medical_records', 'ward_bed', 'database', 'setting']);
        }
        else {
            window.location.href = '/login';
        }
    }, [permissions]);

    return (
        <div>
            <div className="container-fluid row menu_color">
                <div className="col-3">
                    <h1 className="justify-content-start p-auto m-auto">
                        醫護系統管理中心
                    </h1>
                </div>
                <div className="col-9">
                    <ul className="nav justify-content-end">
                        <li className="nav-item" id="personnel">
                            <a className="nav-link active" aria-current="page" href="/personnel">人員管理</a>
                        </li>
                        <li className="nav-item" id="medications">
                            <a className="nav-link" href="/medications">藥物管理</a>
                        </li>
                        <li className="nav-item" id="patients">
                            <a className="nav-link" href="/patients">病人管理</a>
                        </li>
                        <li className="nav-item" id="medical_records">
                            <a className="nav-link" href="/medical_records">病歷管理</a>
                        </li>
                        <li className="nae-item" id="ward_bed">
                            <a className="nav-link" href="/ward">病房管理</a>
                        </li>
                        <li className="nav-item" id="database">
                            <a className="nav-link" href="/database">資料庫管理</a>
                        </li>
                        <li className="nav-item" id="setting">
                            <a className="nav-link" href="/settings">設定</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/login">登出</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

export default Base;