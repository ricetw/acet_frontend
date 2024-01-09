import React, { useEffect } from "react";
import Base from "./Base";

const Index = () => {
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch('https://localhost:5000/web/index', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });
                const data = await response.json();
                if (data.result === 1) {
                    window.location.href = '/login';
                }
            }
            catch (err) {
                console.log('err', err);
            }
        };

        fetchData();
    }, []);

    return (
        <Base>
            <div className="text-center mt-5">
                <p className="fs-1">歡迎使用醫護系統管理中心</p>
            </div>
        </Base>
    );
};

export default Index;
