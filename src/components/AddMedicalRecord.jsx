import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Base from "./Base";

const AddMedicalRecord = () => {
    const { id } = useParams();

    useEffect(() => {
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

                    document.getElementById('patient_id').value = patient.medical_record_number;
                    document.getElementById('patient_name').value = patient.name;
                    document.getElementById('patient_gender').value = patient.gender === 1 ? '男' : '女';
                    document.getElementById('patient_birthday').value = patient.birthday;
                    document.getElementById('patient_height').value = patient.height;
                    document.getElementById('patient_weight').value = patient.weight;
                }
            }
            catch (err) {
                console.log('err', err);
                alert('發生錯誤，請稍後再試！');
                window.location.href = '/patients';
            }
        };

        getData();

        // 新增病歷
        const today = document.getElementById('today_button');

        today.addEventListener('click', function () {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const date = String(today.getDate()).padStart(2, '0');
            const hour = String(today.getHours()).padStart(2, '0');
            const minute = String(today.getMinutes()).padStart(2, '0');

            document.getElementById('add_date').value = `${year}-${month}-${date}`;
            document.getElementById('add_time').value = `${hour}:${minute}`;
        });

        const addContentBtn = document.getElementById('add_content_button');
        const contentInputs = document.getElementById('contentInputs');
        let contentCount = 1;

        function handleAddContent() {
            contentCount++;
            const newBr = document.createElement('br');
            contentInputs.appendChild(newBr);
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.id = `add_content_${contentCount}`;
            newInput.name = `add_content_${contentCount}`;
            contentInputs.appendChild(newInput);
        }

        addContentBtn.addEventListener('click', handleAddContent);

        function bindInputEventListeners(input) {
            input.addEventListener('input', function () {
                const medicine = input.value.trim();
                if (medicine.length > 0) {
                    fetch('https://localhost:5000/web/medications', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        },
                        body: JSON.stringify({
                            "name": medicine,
                            "class": document.getElementById('drug_class').value,
                        }),
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.result === 0) {
                            const medicineList = document.getElementById(`medicineList_${input.id.split('_')[2]}`);
                            medicineList.innerHTML = '';
                            result.data.forEach(medicine => {
                                const option = document.createElement('option');
                                option.value = medicine.name;
                                medicineList.appendChild(option);
                            });
                        }
                        else {
                            alert('發生錯誤，請稍後再試！');
                        }
                    })
                    .catch (err => {
                        console.log('err', err);
                        alert('發生錯誤，請稍後再試！');
                    });
                }
            });
        }

        bindInputEventListeners(document.getElementById('add_medicine_1'));

        const addMedicineBtn = document.getElementById('add_medicine_button');
        const medicineInputs = document.getElementById('medicineInputs');
        let medicineCount = 1;

        function handleAddMedicine() {
            medicineCount++;
            const newBr = document.createElement('br');
            medicineInputs.appendChild(newBr);
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.id = `add_medicine_${medicineCount}`;
            newInput.name = `add_medicine_${medicineCount}`;
            medicineInputs.appendChild(newInput);
            document.getElementById(`add_medicine_${medicineCount}`).setAttribute('list', `medicineList_${medicineCount}`);
            const newDatalist = document.createElement('datalist');
            newDatalist.id = `medicineList_${medicineCount}`;
            medicineInputs.appendChild(newDatalist);
            bindInputEventListeners(newInput);
        }

        addMedicineBtn.addEventListener('click', handleAddMedicine);

        const hospitalizationCheckbox = document.getElementById('add_hospitalization');
        const hospitalizatonInputs = document.getElementById('hospitalizatonInputs');

        
        hospitalizationCheckbox.addEventListener('change', function () {
            if (hospitalizationCheckbox.checked) {
                hospitalizatonInputs.style.display = 'block';
            }
            else {
                hospitalizatonInputs.style.display = 'none';
            }
        });

        const addForm = document.getElementById('addForm');

        addForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const contentList = [];
            for (let i = 1; i <= contentCount; i++) {
                const content = document.getElementById(`add_content_${i}`).value.trim();
                if (content.length > 0) {
                    contentList.push(content);
                }
            }

            const medicineList = [];
            for (let i = 1; i <= medicineCount; i++) {
                const medicine = document.getElementById(`add_medicine_${i}`).value.trim();
                if (medicine.length > 0) {
                    medicineList.push(medicine);
                }
            }

            const data = {
                "medical_record_number": document.getElementById('patient_id').value,
                "name": document.getElementById('patient_name').value,
                "doctorid": document.getElementById('add_doctor_id').value.trim(),
                "content": contentList,
                "medicine": medicineList,
                "notice": document.getElementById('add_notice').value.trim(),
                "hospitalization": hospitalizationCheckbox.checked,
                "ward": document.getElementById('add_room').value.trim(),
                "bed": document.getElementById('add_bed').value.trim(),
                "datetime": `${document.getElementById('add_date').value} ${document.getElementById('add_time').value}`,
            };

            fetch(`https://localhost:5000/web/medical_record/${id}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                if (result.result === 0) {
                    alert('新增成功！');
                    window.location.href = `/patient/${id}`;
                }
                else {
                    alert('發生錯誤，請稍後再試！');
                }
            })
            .catch (err => {
                console.log('err', err);
                alert('發生錯誤，請稍後再試！');
            });
        });

        return () => {
            addContentBtn.removeEventListener('click', handleAddContent);
            addMedicineBtn.removeEventListener('click', handleAddMedicine);
        };
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
                <label htmlForfor="patient_age">病人年齡：</label>
                <input type="text" id="patient_age" name="patient_age" disabled />
                <label htmlFor="patient_birthday">生日：</label>
                <input type="text" id="patient_birthday" name="patient_birthday" disabled />
                <br /><br />
                <label htmlFor="patient_height">病人身高：</label>
                <input type="text" id="patient_height" name="patient_height" />
                <label htmlFor="patient_weight">病人體重：</label>
                <input type="text" id="patient_weight" name="patient_weight" />
                <br /><br />
            </div>
            <br /><br />
            <div>
                <h2>新增病歷</h2>
                <form id="addForm">
                    <label htmlFor="add_date">病歷日期：</label>
                    <input type="date" id="add_date" name="add_date" />
                    <input type="time" id="add_time" name="add_time" />
                    <button type="button" id="today_button">今天</button>
                    <br /><br />
                    <label htmlFor="add_doctor_id">醫師編號：</label>
                    <input type="text" id="add_doctor_id" name="add_doctor_id" />
                    <br /><br />
                    <label htmlFor="add_content">病歷內容：</label>
                    <div id="contentInputs">
                    <input type="text" id="add_content_1" name="add_content_1" />
                    </div>
                    <button type="button" id="add_content_button">+</button>
                    <br /><br />
                    <label htmlFor="add_medicine">用藥：</label>
                    <br />
                    <label htmlFor="drug_class">藥品類別：</label>
                    <select id="drug_class" name="drug_class">
                    <option value="0">全部</option>
                    <option value="injection">注射</option>
                    <option value="oral">口服</option>
                    <option value="external">外用</option>
                    <option value="other">其他</option>
                    </select>
                    <div id="medicineInputs">
                    <input
                        type="text"
                        id="add_medicine_1"
                        name="add_medicine_1"
                        list="medicineList_1"
                    />
                    <datalist id="medicineList_1"></datalist>
                    </div>
                    <button type="button" id="add_medicine_button">+</button>
                    <br /><br />
                    <label htmlFor="add_notice">備註：</label>
                    <input type="text" id="add_notice" name="add_notice" />
                    <br /><br />
                    <label htmlFor="add_hospitalization">住院：</label>
                    <input
                    type="checkbox"
                    id="add_hospitalization"
                    name="add_hospitalization"
                    />
                    <br /><br />
                    <div id="hospitalizatonInputs" style={{ display: 'none' }}>
                        <label htmlFor="add_room">房號：</label>
                        <input type="text" id="add_room" name="add_room" />
                        <br /><br />
                        <label htmlFor="add_bed">床號：</label>
                        <input type="text" id="add_bed" name="add_bed" />
                        <br /><br />
                    </div>
                    <button type="submit" id="add_submit">新增</button>
                </form>
            </div>
        </Base>
    )
};

export default AddMedicalRecord;
