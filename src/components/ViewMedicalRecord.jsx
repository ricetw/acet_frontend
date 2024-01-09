import React, {useEffect } from "react";
import { useParams } from "react-router-dom";
import Base from "./Base";

const ViewMedicalRecord = () => {
    const { id } = useParams();
    const { medicalRecordNumber } = useParams();

    useEffect(() => {
        console.log('id', id);
        console.log('medicalRecordNumber', medicalRecordNumber);
        function render(data) {
            console.log('data', data);
            document.getElementById('patient_id').value = data.medical_record_number;
            document.getElementById('patient_name').value = data.name;
            document.getElementById('patient_gender').value = data.gender === 1 ? '男' : '女';
            document.getElementById('patient_age').value = data.age;
            document.getElementById('patient_birthday').value = data.birthday;
            document.getElementById('patient_height').value = data.height;
            document.getElementById('patient_weight').value = data.weight;
            document.getElementById('date').value = data.datetime.split(' ')[0];
            document.getElementById('time').value = data.datetime.split(' ')[1];
            document.getElementById('doctor_id').value = data.doctorid;
            const contentInputs = document.getElementById('contentInputs');
            contentInputs.innerHTML = '';
            for (let i = 0; i < data.cases.length; i++) {
                if (i > 0) {
                    const newBr = document.createElement('br');
                    contentInputs.appendChild(newBr);
                }
                const newInput = document.createElement('input');
                newInput.type = 'text';
                newInput.id = `content${i}`;
                newInput.name = `content${i}`;
                newInput.value = data.cases[i];
                newInput.disabled = true;
                contentInputs.appendChild(newInput);
            }
            const medicineInputs = document.getElementById('medicineInputs');
            medicineInputs.innerHTML = '';
            for (let i = 0; i < data.medication.length; i++) {
                if (i > 0) {
                    const newBr = document.createElement('br');
                    medicineInputs.appendChild(newBr);
                }
                const newInput = document.createElement('input');
                newInput.type = 'text';
                newInput.id = `medicine${i}`;
                newInput.name = `medicine${i}`;
                newInput.value = data.medication[i];
                newInput.disabled = true;
                medicineInputs.appendChild(newInput);
            }
            document.getElementById('notice').value = data.notice;
            document.getElementById('hospitalization').value = data.hospitalization === true ? '是' : '否';
            const hospitalization = document.getElementById('hospitalization');
            const hospitalizatonInputs = document.getElementById('hospitalizatonInputs');
            if (hospitalization.value === '是') {
                hospitalizatonInputs.style.display = 'block';
                document.getElementById('room').value = data.ward;
                document.getElementById('bed').value = data.bed;
            }
            else {
                hospitalizatonInputs.style.display = 'none';
            }

            const backBtn = document.getElementById('back');
            backBtn.addEventListener('click', () => {
                window.location.href = `/patient/${medicalRecordNumber}`;
            });
        }
        const getData = async () => {
            try {
                const response = await fetch(`https://localhost:5000/web/medical_record/${medicalRecordNumber}&${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });
                const data = await response.json();
                console.log('data', data);
                if (data.result === 1) {
                    alert('發生錯誤，請稍後再試！');
                    window.location.href = `/patient/${medicalRecordNumber}`;
                }
                else {
                    render(data.data);
                }
            }
            catch (err) {
                console.log('err', err);
            }
        };

        getData();
    }, [id, medicalRecordNumber]);

    return (
        <Base>
            <div>
                <label htmlFor="patient_id">病歷號：</label>
                <input type="text" id="patient_id" name="patient_id" disabled />
                <label htmlFor="patient_name">病人姓名：</label>
                <input type="text" id="patient_name" name="patient_name" disabled />
                <label htmlFor="patient_gender">病人性別：</label>
                <input type="text" id="patient_gender" name="patient_gender" disabled />
                <label htmlFor="patient_age">病人年齡：</label>
                <input type="text" id="patient_age" name="patient_age" disabled />
                <label htmlFor="patient_birthday">病人生日：</label>
                <input type="date" id="patient_birthday" name="patient_birthday" disabled />
                <br /><br />
                <label htmlFor="patient_height">病人身高：</label>
                <input type="text" id="patient_height" name="patient_height" disabled />
                <label htmlFor="patient_weight">病人體重：</label>
                <input type="text" id="patient_weight" name="patient_weight" disabled />
            </div>
            <br />
            <div>
                <h2>檢視病例</h2>
                <button type="submit" id="back">返回</button>
                <form>
                    <label htmlFor="date">病歷日期：</label>
                    <input type="date" id="date" name="date" disabled />
                    <input type="time" id="time" name="time" disabled />
                    <br /><br />
                    <label htmlFor="doctor_id">醫師編號：</label>
                    <input type="text" id="doctor_id" name="doctor_id" disabled />
                    <br /><br />
                    <label htmlFor="content">病歷內容：</label>
                    <div id="contentInputs"></div>
                    <br /><br />
                    <label htmlFor="medicine">用藥：</label>
                    <br />
                    <div id="medicineInputs"></div>
                    <br /><br />
                    <label htmlFor="notice">備註：</label>
                    <input type="text" id="notice" name="notice" disabled />
                    <br /><br />
                    <label htmlFor="hospitalization">住院：</label>
                    <input type="text" id="hospitalization" name="hospitalization" disabled />
                    <br /><br />
                    <div id="hospitalizatonInputs" style={{ display: 'none' }}>
                    <label htmlFor="room">房號：</label>
                    <input type="text" id="room" name="room" disabled />
                    <br /><br />
                    <label htmlFor="bed">床號：</label>
                    <input type="text" id="bed" name="bed" disabled />
                    <br /><br />
                    </div>
                </form>
            </div>
        </Base>
    )
};

export default ViewMedicalRecord;
