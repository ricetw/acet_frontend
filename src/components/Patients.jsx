import React, { useEffect } from "react";
import Base from "./Base";
import "../styles/btn.css";

const Patients = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize] = React.useState(50);
    const [totalPage, setTotalPage] = React.useState(0);
    const [PatientsData, setPatientsData] = React.useState([]);
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
        const patientList = document.getElementById('patient_list');

        // 渲染病人列表
        function render(data) {
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            const currentData = data.slice(start, end);
            patientList.innerHTML = '';
            currentData.forEach((patient) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${patient.medical_record_number}</td>
                    <td>${patient.name}</td>
                    <td>${patient.gender}</td>
                    <td>${patient.age}</td>
                    <td>${patient.birthday}</td>
                    <td class="col-1"><button class="viewbtn btn-sm btn-outline-secondary" type="button" onclick="location.href='/patient/${patient.medical_record_number}'">查看</button></td>
                    <td class="col-1"><button class="editbtn btn-sm btn-outline-secondary" data-id="${patient.medical_record_number}">編輯</button></td>
                `;
                patientList.appendChild(tr);
            });
        }
        
        // 取得病人列表
        const getData = async () => {
            try{
                const response = await fetch('https://localhost:5000/web/patients', {
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
                    setPatientsData(data.data);
                    render(data.data);
                }
            }
            catch (err) {
                console.log('err', err);
            }
        };

        getData();

        // 搜尋病人
        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', function() {
            const search = this.value;
            const data = {
                'medical_record_number': search,
            }
            fetch('https://localhost:5000/web/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.result === 1) {
                    console.log(data.message);
                    alert('搜尋失敗');
                }
                else {
                    setTotalPage(Math.ceil(data.data.length / pageSize));
                    setPatientsData(data.data);
                    render(data.data);
                }
            })
            .catch((err) => {
                console.log('err', err);
                alert('搜尋失敗');
            });
        });

        // 新增病人
        const addModal = document.getElementById('addModal');
        const addBtn = document.getElementById('addbtn');
        const addForm = document.getElementById('addform');
        const closeBtn = document.getElementsByClassName('close')[0];

        addBtn.addEventListener('click', function() {
            addModal.style.display = "block";
        });

        closeBtn.addEventListener('click', function() {
            addModal.style.display = "none";
        });

        window.addEventListener('click', function(event) {
            if (event.target === addModal) {
                addModal.style.display = "none";
            }
        });

        addForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let health_id = document.getElementById('add_health_id').value;
            health_id = health_id.replace(/\s+/g, "");
            const name = document.getElementById('add_name').value;
            let gender = document.getElementById('add_gender').value;
            const birthday = document.getElementById('add_birthday').value;
            const istwelevDigitNumber = /^\d{12}$/.test(health_id);

            if (!istwelevDigitNumber) {
                alert('健保卡號格式錯誤');
                return;
            }

            const data = {
                'health_id': health_id,
                'name': name,
                'gender': gender,
                'birthday': birthday,
            }
            
            fetch('https://localhost:5000/web/patient/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.result === 1) {
                    alert('新增失敗');
                }
                else {
                    alert('新增成功');
                    window.location.reload();
                }
            })
            .catch((err) => {
                console.log('err', err);
                alert('新增失敗');
            });
        });

        // 編輯病人
        const editModal = document.getElementById('editModal');
        const closeEditbtn = document.getElementsByClassName('edit-close')[0];

        patientList.addEventListener('click', function(event) {
            if (event.target.className === 'editbtn btn-sm btn-outline-secondary') {
                const id = event.target.dataset.id;
                console.log(id);

                fetch('https://localhost:5000/web/patients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        'medical_record_number': id,
                    }),
                })
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    if (result.result === 0) {
                        const data = result.data[0]
                        document.getElementById('edit_id').value = data.medical_record_number;
                        document.getElementById('edit_health_id').value = data.health_id;
                        document.getElementById('edit_name').value = data.name;
                        document.getElementById('edit_gender').value = data.gender === '男' ? 1 : 0;
                        document.getElementById('edit_birthday').value = data.birthday;
                        editModal.style.display = "block";
                    }
                    else {
                        console.log(result.message);
                        alert('取得失敗');
                    }
                })
                .catch((err) => {
                    console.log('err', err);
                    alert('取得失敗');
                });
            }
        });

        closeEditbtn.addEventListener('click', function() {
            editModal.style.display = "none";
        });

        window.addEventListener('click', function(event) {
            if (event.target === editModal) {
                editModal.style.display = "none";
            }
        });

        const editForm = document.getElementById('editform');
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let health_id = document.getElementById('edit_health_id').value;
            health_id = health_id.replace(/\s+/g, "");
            const istwelevDigitNumber = /^\d{12}$/.test(health_id);

            if (!istwelevDigitNumber) {
                alert('健保卡號格式錯誤');
                return;
            }

            const data = {
                'medical_record_number': document.getElementById('edit_id').value,
                'health_id': health_id,
                'name': document.getElementById('edit_name').value,
                'gender': document.getElementById('edit_gender').value,
                'birthday': document.getElementById('edit_birthday').value,
            }

            fetch('https://localhost:5000/web/patients', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.result === 1) {
                    alert('修改失敗');
                }
                else {
                    alert('修改成功');
                    window.location.reload();
                }
            })
            .catch((err) => {
                console.log('err', err);
                alert('修改失敗');
            });
        });
    }, [currentPage, pageSize]);

    return (
        <Base>
            <br />
            <div>
                <div>
                    <input id='search' type='text' placeholder='請輸入病歷號' />
                    <br /><br />
                    <button id='addbtn'>新增病人</button>
                </div>
            </div>
            <br />

            <div>
                <h2>病人列表</h2>
                <br />
                <div id="pageBtn">
                    {renderBtns()}
                </div>
                <br />
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>病歷號</th>
                            <th>姓名</th>
                            <th>性別</th>
                            <th>年齡</th>
                            <th>生日</th>
                        </tr>
                    </thead>
                    <tbody id='patient_list'></tbody>
                </table>
            </div>

            <div id="addModal" className="add-modal">
                <div className="add-modal-content">
                    <span className="close">&times;</span>
                    <h2>新增病人</h2>
                    <form id="addform">
                        <label htmlFor="health_id">健保卡號：</label>
                        <input
                            type="text"
                            id="add_health_id"
                            name="add_health_id"
                            placeholder="請輸入健保卡號"
                            required
                        />
                        <br /><br />
                        <label htmlFor="add_name">姓名：</label>
                        <input
                            type="text"
                            id="add_name"
                            name="add_name"
                            placeholder="請輸入姓名"
                            required
                        />
                        <br /><br />
                        <label htmlFor="add_gender">性別：</label>
                        <select id='add_gender' name="add_gender">
                            <option value="1">男</option>
                            <option value="0">女</option>
                        </select>
                        <br /><br />
                        <label htmlFor="add_birthday">生日：</label>
                        <input
                            type="date"
                            id="add_birthday"
                            name="add_birthday"
                            placeholder="請輸入生日"
                            required
                        />
                        <br /><br />
                        <button id='submit'>新增</button>
                    </form>
                </div>
            </div>

            <div id="editModal" className="edit-modal">
                <div className="edit-modal-content">
                    <span className="edit-close">&times;</span>
                    <form id="editform">
                        <h2>編輯病人</h2>
                        <input type="hidden" id="edit_id" name="edit_id" />
                        <label htmlFor="edit_health_id">健保卡號：</label>
                        <input
                            type="text"
                            id="edit_health_id"
                            name="edit_health_id"
                            placeholder="請輸入健保卡號"
                            required
                        />
                        <br /><br />
                        <label htmlFor="edit_name">姓名：</label>
                        <input
                            type="text"
                            id="edit_name"
                            name="edit_name"
                            placeholder="請輸入姓名"
                            required
                        />
                        <br /><br />
                        <select id="edit_gender" name="edit_gender">
                            <option value="1">男</option>
                            <option value="0">女</option>
                        </select>
                        <br /><br />
                        <label htmlFor="edit_birthday">生日：</label>
                        <input
                            type="date"
                            id="edit_birthday"
                            name="edit_birthday"
                            placeholder="請輸入生日"
                            required
                        />
                        <br /><br />
                        <button id='submit'>修改</button>
                    </form>
                </div>
            </div>
        </Base> 
    )
};

export default Patients;
