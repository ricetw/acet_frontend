import React, { useEffect, useState } from "react";
import Base from "./Base";
import "../styles/btn.css";

const Medications = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize] = React.useState(50);
    const [totalPage, setTotalPage] = React.useState(0);
    const [medications, setMedications] = useState([]);
    const blueBtn = "blue-button";
    const redBtn = "red-button";

    const renderBtns = () => {
        return Array.from({ length: totalPage }, (_, index) => index +1).map((page) => (
            <button 
                key={page} 
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? blueBtn : redBtn}
            >
                {page}
            </button>
        ));
    };

    useEffect(() => {
        const medical_list = document.getElementById('medical-list');

        // 渲染藥物列表
        function renderMedicalList(data) {
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            const currentData = data.slice(start, end);
            medical_list.innerHTML = '';
            currentData.forEach((medical) => {
                const tr = document.createElement('tr');
                const medicalClass = medical['drug_class'] === 0 ? '注射' : medical['drug_class'] === 1 ? '口服' : medical['drug_class'] === 2 ? '外用' : '其他';
                tr.innerHTML = `
                    <td class="col-1"><input type="checkbox" name="medical" value="${medical['id']}"></td>
                    <td class="col-2">${medicalClass}</td>
                    <td>${medical['name']}</td>
                    <td class="col-1"><button class="detailbtn" data-id="${medical['id']}">詳細</button></td>
                    <td class="col-1"><button class="editbtn" data-id="${medical['id']}">編輯</button></td>
                    <td class="col-1"><button class="deletebtn" data-id="${medical['id']}">刪除</button></td>
                `;  
                medical_list.appendChild(tr);
            });
        }

        // 取得藥物列表
        const getData = async () => {
            try {
                const response = await fetch('https://localhost:5000/web/medications', {
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
                else {
                    setTotalPage(Math.ceil(data.data.length / pageSize));
                    setMedications(data.data);
                    renderMedicalList(data.data);
                }
            }
            catch (err) {
                console.log('err', err);
            }
        };

        getData();

        // 搜尋藥物
        const medical_class = document.getElementById('medical-class');
        const medical_name_input = document.getElementById('medical-name');

        function searchMedical(data) {
            console.log(data);
            fetch('https://localhost:5000/web/medications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.result === 0) {
                    setTotalPage(Math.ceil(data.data.length / pageSize));
                    setMedications(data.data);
                    renderMedicalList(data.data);
                }
                else {
                    console.log(data.message);
                    alert('搜尋藥物失敗');
                }
            })
            .catch((err) => {
                console.log('err', err);
                alert('搜尋藥物失敗');
            });
        }

        medical_class.addEventListener('change', function() {
            const select_class = document.getElementById('medical-class').value;
            const select_name = document.getElementById('medical-name').value;
            const data = {
                'class': select_class,
                'name': select_name,
            };
            searchMedical(data);
        });

        medical_name_input.addEventListener('input', function() {
            const select_class = document.getElementById('medical-class').value;
            const select_name = document.getElementById('medical-name').value;
            const data = {
                'class': select_class,
                'name': select_name,
            };
            searchMedical(data);
        });

        // 新增藥物
        const addModal = document.getElementById('addModal');
        const addbtn = document.getElementById('add-medical');
        const closebtn = document.getElementsByClassName('add-close')[0];

        addbtn.addEventListener('click', function() {
            addModal.style.display = 'block';
        });

        closebtn.addEventListener('click', function() {
            addModal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === addModal) {
                addModal.style.display = 'none';
            }
        });

        const addForm = document.getElementById('addForm');
        addForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let add_medical_class = document.getElementById('add-medical-class').value;
            let add_medical_name = document.getElementById('add-medical-name').value;
            let add_medical_effect = document.getElementById('add-medical-effect').value;
            let add_medical_side_effect = document.getElementById('add-medical-side-effect').value;

            if (add_medical_class === 'injection')
                add_medical_class = 0;
            else if (add_medical_class === 'oral')
                add_medical_class = 1;
            else if (add_medical_class === 'external')
                add_medical_class = 2;
            else if (add_medical_class === 'other')
                add_medical_class = 3;

            const data = {
                'class': add_medical_class,
                'name': add_medical_name,
                'effect': add_medical_effect,
                'side_effect': add_medical_side_effect,
            };

            fetch('https://localhost:5000/web/medications/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 0) {
                    alert('新增藥物成功');
                    window.location.reload();
                }
                else {
                    console.log(data.message);
                    alert('新增藥物失敗');
                }
            })
            .catch(err => {
                console.log('err', err);
                alert('新增藥物失敗');
            });
        });

        // 藥物詳細資料
        const detailElement = document.getElementById('detail');

        function renderDetail(data) {
            detailElement.innerHTML = '';
            const medical_data = data;
            const medicalClass = medical_data['drug_class'] === 0 ? '注射' : medical_data['drug_class'] === 1 ? '口服' : medical_data['drug_class'] === 2 ? '外用' : '其他';
            const row = document.createElement('tr');
            row.innerHTML = `
                <p>詳細資料</p>
                <p>藥物類別：${medicalClass}</p>
                <p>藥物名稱：${medical_data['name']}</p>
                <p>臨床用途：${medical_data['effect']}</p>
                <p>副作用：${medical_data['side_effect']}</p>
            `;
            detailElement.appendChild(row);
        };

        const detailModal = document.getElementById('detailModal');
        const closeDetailbtn = document.getElementsByClassName('detail-close')[0];

        medical_list.addEventListener('click', function(event) {
            if (event.target.classList.contains('detailbtn')) {
                const id = event.target.dataset.id;
                fetch('https://localhost:5000/web/medications/detail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        'id': id,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 0) {
                        renderDetail(data.data);
                        detailModal.style.display = 'block';
                    }
                    else {
                        console.log(data.message);
                        alert('取得藥物詳細資料失敗');
                    }
                })
                .catch(err => {
                    console.log('err', err);
                    alert('取得藥物詳細資料失敗');
                });
            }
        });

        closeDetailbtn.addEventListener('click', function() {
            detailModal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === detailModal) {
                detailModal.style.display = 'none';
            }
        });

        // 編輯藥物
        const editModal = document.getElementById('editModal');
        const closeEditbtn = document.getElementsByClassName('edit-close')[0];

        medical_list.addEventListener('click', function(event) {
            if (event.target.classList.contains('editbtn')) {
                const id = event.target.dataset.id;
                fetch('https://localhost:5000/web/medications/detail', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        "id": id
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.result === 0) {
                        console.log(result.data);
                        const medical_data = result.data;
                        const medicalClass = medical_data['drug_class'] === 0 ? 'injection' : medical_data['drug_class'] === 1 ? 'oral' : medical_data['drug_class'] === 2 ? 'external' : 'other';
                        document.getElementById('edit-medical-id').value = medical_data['id'];
                        document.getElementById('edit-medical-class').value = medicalClass;
                        document.getElementById('edit-medical-name').value = medical_data['name'];
                        document.getElementById('edit-medical-effect').value = medical_data['effect'];
                        document.getElementById('edit-medical-side-effect').value = medical_data['side_effect'];
                        editModal.style.display = 'block';
                    }
                    else {
                        console.log(result.message);
                        alert('取得藥物詳細資料失敗');
                    }
                })
                .catch(err => {
                    console.log('err', err);
                    alert('取得藥物詳細資料失敗');
                });
            }
        });

        closeEditbtn.addEventListener('click', function() {
            editModal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === editModal) {
                editModal.style.display = 'none';
            }
        });

        const editForm = document.getElementById('editForm');
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let edit_medical_class = document.getElementById('edit-medical-class').value;

            if (edit_medical_class === 'injection')
                edit_medical_class = 0;
            else if (edit_medical_class === 'oral')
                edit_medical_class = 1;
            else if (edit_medical_class === 'external')
                edit_medical_class = 2;
            else if (edit_medical_class === 'other')
                edit_medical_class = 3;

            const data = {
                'id': document.getElementById('edit-medical-id').value,
                'class': edit_medical_class,
                'name': document.getElementById('edit-medical-name').value,
                'effect': document.getElementById('edit-medical-effect').value,
                'side_effect': document.getElementById('edit-medical-side-effect').value,
            };
            fetch('https://localhost:5000/web/medications', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result['result'] === 0)
                    window.location.reload();
                else{
                    console.log(result['message']);
                    alert('更新失敗');
                }
            })
            .catch(error => {
                console.log('Error:', error);
                alert('錯誤');
            });
        });

        // 刪除藥物
        function deleteMedical(data){
            fetch('https://localhost:5000/web/medications', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result['result'] === 0)
                    window.location.reload();
                else{
                    console.log(result['message']);
                    alert('刪除失敗');
                }
            })
            .catch(error => {
                console.log('Error:', error);
                alert('錯誤');
            });
        }

        const deletebtn = document.getElementById('delete-medical');
        deletebtn.addEventListener('click', function() {
            const selectCheckBoxes = document.querySelectorAll('input[name="medical"]:checked');
            const medical_ids = Array.from(selectCheckBoxes).map(checkbox => checkbox.value);
            deleteMedical({
                "id": medical_ids
            });
        });
        medical_list.addEventListener('click', function(event) {
            if (event.target.classList.contains('deletebtn')) {
                const id = event.target.dataset.id;
                deleteMedical({
                    "id": [id]
                });
            }
        });
    }, [currentPage, pageSize]);

    return(
        <Base welcomeText="藥物管理">
            <br />
            <div>
                <div>
                    <label htmlFor="medical-class">藥物類別</label>
                    <select name="medical-class" id="medical-class">
                        <option value="0">全部</option>
                        <option value="injection">注射藥物</option>
                        <option value="oral">口服藥物</option>
                        <option value="external">外用藥物</option>
                        <option value="other">其他藥物</option>
                    </select>
                </div>
                <br />
                <div>
                    <label htmlFor="medical-name">藥物名稱</label>
                    <input type="text" name="medical-name" id="medical-name" />
                    <br /><br />
                    <button id="add-medical">新增藥物</button>
                </div>
            </div>
            <br /><br /><br />

            <div>
                <h2>藥物列表</h2>
                <div id="pageBtn">
                    {renderBtns()}
                </div>
                <button id="delete-medical">刪除藥物</button>
                <br /><br />
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>勾選</th>
                            <th>藥物類別</th>
                            <th>藥物名稱</th>
                        </tr>
                    </thead>
                    <tbody id="medical-list"></tbody>
                </table>
            </div>

            <div id="addModal" className="add-modal">
                <div className="add-modal-content">
                    <span className="add-close">&times;</span>
                    <h2>新增藥物</h2>
                    <form id="addForm">
                    <label htmlFor="add-medical-class">藥物類別</label>
                    <select id="add-medical-class" name="add-medical-class">
                        <option value="injection">注射藥物</option>
                        <option value="oral">口服藥物</option>
                        <option value="external">外用藥物</option>
                        <option value="other">其他藥物</option>
                    </select>
                    <br /><br />
                    <label htmlFor="add-medical-name">藥物名稱：</label>
                    <input
                        id="add-medical-name"
                        name="add-medical-name"
                        type="text"
                        required
                    />
                    <br /><br />
                    <label htmlFor="add-medical-effect">藥物效果：</label>
                    <input
                        id="add-medical-effect"
                        name="add-medical-effect"
                        type="text"
                        required
                    />
                    <br /><br />
                    <label htmlFor="add-medical-side-effect">藥物副作用：</label>
                    <input
                        id="add-medical-side-effect"
                        name="add-medical-side-effect"
                        type="text"
                        required
                    />
                    <br /><br />
                    <button type="submit">新增</button>
                    </form>
                </div>
            </div>
            
            <div id="detailModal" className="detail-modal">
                <div className="detail-modal-content">
                    <span className="detail-close">&times;</span>
                    <h2>藥物詳細資料</h2>
                    <div id="detail"></div>
                </div>
            </div>
            
            <div id="editModal" className="edit-modal">
                <div className="edit-modal-content">
                    <span className="edit-close">&times;</span>
                    <form id="editForm">
                    <h2>編輯藥物</h2>
                    <input id="edit-medical-id" name="edit-medical-id" type="hidden" />
                    <label htmlFor="edit-medical-class">藥物類別</label>
                    <select id="edit-medical-class" name="edit-medical-class">
                        <option value="injection">注射藥物</option>
                        <option value="oral">口服藥物</option>
                        <option value="external">外用藥物</option>
                        <option value="other">其他藥物</option></select
                    ><br /><br />
                    <label htmlFor="edit-medical-name">藥物名稱：</label>
                    <input
                        id="edit-medical-name"
                        name="edit-medical-name"
                        type="text"
                        className="w-auto h-auto"
                        required
                    />
                    <br /><br />
                    <label htmlFor="edit-medical-effect">藥物效果：</label>
                    <input
                        id="edit-medical-effect"
                        name="edit-medical-effect"
                        type="text"
                        required
                    />
                    <br /><br />
                    <label htmlFor="edit-medical-side-effect">藥物副作用：</label>
                    <input
                        id="edit-medical-side-effect"
                        name="edit-medical-side-effect"
                        type="text"
                        required
                    />
                    <br /><br />
                    <button type="submit">修改</button>
                    </form>
                </div>
            </div>
        </Base>
    );
};

export default Medications;