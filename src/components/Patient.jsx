import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Base from "./Base";

const Patient = () => {
    const { id } = useParams();

    useEffect(() => {
        const medical_records_list = document.getElementById('medical_records_list');

        function render(datas, patient_id) {
            medical_records_list.innerHTML = datas.map(data => {
                return `
                    <tr>
                        <td>${data.id}</td>
                        <td>${data.time}</td>
                        <td>${data.doctorid}</td>
                        <td>${data.doctor}</td>
                        <td>${data.cases}</td>
                        <td>${data.medication}</td>
                        <td>${data.notice}</td>
                        <td>${data.hospitalization === true ? '是' : '否'}</td>
                        <td class="col-1"><button class="btn btn-primary" onclick="window.location.href='/medical_record/${patient_id}/${data.id}'">查看</button></td>
                    </tr>
                `;
            }).join('');
        }
        const getData = async () => {
            try {
                const response = await fetch(`https://localhost:5000/web/patient/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });
                const data = await response.json();
                if (data.result === 1) {
                    alert('發生錯誤，請稍後再試！');
                    window.location.href = '/patients';
                }
                else {
                    const patient = data.patient;
                    const medical_records = data.medical_records;

                    document.getElementById('patient_id').value = patient.medical_record_number;
                    document.getElementById('patient_name').value = patient.name;
                    document.getElementById('patient_gender').value = patient.gender === 1 ? '男' : '女';
                    document.getElementById('patient_birthday').value = patient.birthday;
                    document.getElementById('patient_height').value = patient.height;
                    document.getElementById('patient_weight').value = patient.weight;

                    render(medical_records, patient.medical_record_number);
                }
            }
            catch (err) {
                console.log('err', err);
                alert('發生錯誤，請稍後再試！');
                window.location.href = '/patients';
            }
        };

        getData();

        // 更新病人資料
        const modifyBtn = document.getElementById('update_patient_data');

        modifyBtn.addEventListener('click', async () => {
            const height = document.getElementById('patient_height').value;
            const weight = document.getElementById('patient_weight').value;

            try {
                const response = await fetch(`https://localhost:5000/web/patient/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        height,
                        weight,
                    }),
                });
                const data = await response.json();
                if (data.result === 1) {
                    alert('發生錯誤，請稍後再試！');
                }
                else {
                    alert('更新成功！');
                    window.location.href = `/patient/${id}`;
                }
            }
            catch (err) {
                console.log('err', err);
                alert('發生錯誤，請稍後再試！');
            }
        });

        // 新增病歷
        const addBtn = document.getElementById('add_medical_record');

        addBtn.addEventListener('click', async () => {
            window.location.href = `/medical_record/${id}/add`;
        });
    }, [id]);

    return (
        <Base>
            <div>
                <label htmlFor="patient_id">病歷號：</label>
                <input type="text" id="patient_id" name="patient_id" disabled />
                <label htmlFor="patient_name">姓名：</label>
                <input type="text" id="patient_name" name="patient_name" disabled />
                <br /><br />
                <label htmlFor="patient_gender">性別：</label>
                <input type="text" id="patient_gender" name="patient_gender" disabled />
                <label htmlFor="patient_birthday">生日：</label>
                <input type="text" id="patient_birthday" name="patient_birthday" disabled />
                <br /><br />
                <label htmlFor="patient_height">病人身高：</label>
                <input type="text" id="patient_height" name="patient_height" />
                <label htmlFor="patient_weight">病人體重：</label>
                <input type="text" id="patient_weight" name="patient_weight" />
                <br /><br />
                <button id="update_patient_data">更新病人資料</button>
                <button id="add_medical_record">新增病歷</button>
            </div>
            <br /><br />
            <div>
                <h2>病歷紀錄</h2>
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>病歷歷史編號</th>
                        <th>病歷日期</th>
                        <th>醫師編號</th>
                        <th>主治醫師</th>
                        <th>病歷內容</th>
                        <th>用藥</th>
                        <th>備註</th>
                        <th>住院</th>
                    </tr>
                    </thead>
                    <tbody id="medical_records_list"></tbody>
                </table>
            </div>
        </Base>
    );
};

export default Patient;
