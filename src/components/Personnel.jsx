import React, { useEffect, useState } from "react";
import Base from "./Base";
import "../styles/btn.css";

const Personnel = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(50);
    const [totalPage, setTotalPage] = useState(1);
    const [personnelData, setPersonnelData] = useState([]);
    const blueBtn = "blue-button"
    const redBtn = "red-button"

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
            const personnel_list = document.getElementById('personnel_list');

            // 渲染人員列表
            function renderPersonnelList(data) {
                const start = (currentPage - 1) * pageSize;
                const end = start + pageSize;
                const currentData = data.slice(start, end);
                personnel_list.innerHTML = '';
                currentData.forEach((personnel) => {
                    const row = document.createElement('tr');
                    const permissions = personnel.permissions === 1 ? '人事主管' : '醫護人員';
                    row.innerHTML = `
                        <td class="col-1 text-center"><input type="checkbox" name="person" value="${personnel.ms_id}"></td>
                        <td class="col-2">${personnel.ms_id}</td>
                        <td>${personnel.name}</td>
                        <td class="col-3">${permissions}</td>
                        <td class="col-1"><button class="detailButton" data-id="${personnel.ms_id}">詳細資料</button></td>
                        <td class="col-1"><button class="editButton" data-id="${personnel.ms_id}">編輯</button></td>
                        <td class="col-1"><button class="deleteButton" data-id="${personnel.ms_id}">删除</button></td>
                    `;
                    personnel_list.appendChild(row);
            });
        }

        // 取得人員列表
        const getData = async () => {
            try{
                const response = await fetch('https://localhost:5000/web/personnel', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });
                const data = await response.json();
                if (data.result === 0) {
                    setTotalPage(Math.ceil(data.data.length / pageSize));
                    setPersonnelData(data.data);
                    renderPersonnelList(data.data);
                }
            }
            catch (err) {
                console.log('err', err);
            }
        };

        getData();

        // 搜尋人員
        const search = document.getElementById('search');

        search.addEventListener('input', async (e) => {
            const searchValue = e.target.value;

            try{
                const response = await fetch('https://localhost:5000/web/personnel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    
                    },
                    body: JSON.stringify({
                        "ms_id": searchValue,
                    }),
                });
                const data = await response.json();
                if (data.result === 0) {
                    setTotalPage(Math.ceil(data.data.length / pageSize));
                    setPersonnelData(data.data);
                    renderPersonnelList(data.data);
                }
                else{
                    alert(data.message);
                }
            }
            catch (err) {
                console.log('err', err);
            }
        });

        // 詳細資料
        const detailElement = document.getElementById("detail");

        function renderDetail(data) {
            detailElement.innerHTML = "";
            const person = data;
            const permissions = person.permissions === 1 ? "人事主管" : "護理師/醫生";
            const row = document.createElement("div");
            row.innerHTML = `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-2 p-3 ">醫護號: </div><div class="col p-3">${person.ms_id}</div>
                </div>
                <div class="row">
                    <div class="col-2 p-3">姓名: </div><div class="col p-3">${person.name}</div>
                </div>
                <div class="row">
                    <div class="col-2 p-3">職位: </div><div class="col p-3">${permissions}</div>
                </div>
            </div>
            `;
            detailElement.appendChild(row);
        }

        const detailModel = document.getElementById("detailModel");
        const closeDetailButton = document.getElementsByClassName("detail-close")[0];

        personnel_list.addEventListener("click", function (e) {
            if (e.target.classList.contains("detailButton")) {
                const personId = e.target.dataset.id;
                fetch("https://localhost:5000/web/personnel/detail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        "ms_id": personId
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.result === 0){
                        renderDetail(result.data);
                        detailModel.style.display = "block";
                    }
                    else
                        alert("查詢失敗");
                })
                .catch(err => {
                    console.log(err);
                    alert("查詢失敗");
                })
            }
        });

        closeDetailButton.addEventListener("click", function () {
            detailModel.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target === detailModel)
                detailModel.style.display = "none";
        });

        // 新增人員
        const addmodal = document.getElementById("addModal");
        const addPersonButton = document.getElementById("addPersonButton");
        const closeAddButton = document.getElementsByClassName("add-close")[0];

        addPersonButton.addEventListener("click", function () {
            addmodal.style.display = "block";
        });

        closeAddButton.addEventListener("click", function () {
            addmodal.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target === addmodal)
                addmodal.style.display = "none";
        });

        const addForm = document.getElementById("personForm");
        addForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let ms_id = document.getElementById("ms_id").value;
            let name = document.getElementById("name").value;
            let password = document.getElementById("password").value;
            let permissions = document.getElementById("permissions-select").value;

            if (permissions === "supervisor")
                permissions = 1;
            else
                permissions = 2;

            fetch("https://localhost:5000/web/personnel/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    "ms_id": ms_id,
                    "name": name,
                    "password": password,
                    "permissions": permissions
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.result === 0){
                    alert("新增成功");
                    window.location.reload();
                }
                else
                    alert("新增失敗");
            })
            .catch(err => {
                console.log(err);
                alert("新增失敗");
            })

            addmodal.style.display = "none";
            addForm.reset();
        })

        // 編輯人員
        const editmodal = document.getElementById("editModal");
        const closeEditButton = document.getElementsByClassName("edit-close")[0];

        personnel_list.addEventListener("click", function (e) {
            if (e.target.classList.contains("editButton")) {
                const personId = e.target.dataset.id;
                fetch("https://localhost:5000/web/personnel/detail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        "ms_id": personId
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.result === 0){
                        document.getElementById("edit_id").value = result.data.ms_id;
                        document.getElementById("edit_ms_id").value = result.data.ms_id;
                        document.getElementById("edit_name").value = result.data.name;
                        document.getElementById("edit_permissions-select").value = result.data.permissions === 1 ? "supervisor" : "nurse";
                        editmodal.style.display = "block";
                    }
                    else
                        alert("查詢失敗");
                })
                .catch(err => {
                    console.log(err);
                    alert("查詢失敗");
                })
            }
        });

        closeEditButton.addEventListener("click", function () {
            editmodal.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target === editmodal)
                editmodal.style.display = "none";
        });

        const editForm = document.getElementById("editForm");
        editForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let id = document.getElementById("edit_id").value;
            let ms_id = document.getElementById("edit_ms_id").value;
            let name = document.getElementById("edit_name").value;
            let permissions = document.getElementById("edit_permissions-select").value;

            if (permissions === "supervisor")
                permissions = 1;
            else
                permissions = 2;

            fetch("https://localhost:5000/web/personnel", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    "id": id,
                    "ms_id": ms_id,
                    "name": name,
                    "permissions": permissions
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.result === 0){
                    alert("更新成功");
                    window.location.reload();
                }
                else
                    alert("更新失敗");
            })
            .catch(err => {
                console.log(err);
                alert("更新失敗");
            })
        })

        // 刪除人員
        personnel_list.addEventListener("click", function (e) {
            if (e.target.classList.contains("deleteButton")) {
                const personId = e.target.dataset.id;
                console.log(personId);

                fetch("https://localhost:5000/web/personnel", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        "ms_id": [personId]
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.result === 0){
                        alert("刪除成功");
                        window.location.reload();
                    }
                    else
                        alert("刪除失敗");
                })
                .catch(err => {
                    console.log(err);
                    alert("刪除失敗");
                })
            }
        });

        const deletebtn = document.getElementById("deletebtn");
        deletebtn.addEventListener("click", function () {
            const selectdCheckBoxes = document.querySelectorAll('input[name="person"]:checked');
            const selectedIds = Array.from(selectdCheckBoxes).map(checkbox => checkbox.value);
            console.log(selectedIds);

            fetch("https://localhost:5000/web/personnel", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                    "ms_id": selectedIds,
                }),
            })
            .then((response) => response.json())
            .then((result) => {
                if (result.result === 0) {
                    alert("刪除成功");
                    window.location.reload();
                } else {
                    alert("刪除失敗");
                }
            })
            .catch((err) => {
                console.log(err);
                alert("刪除失敗");
            });
        });
    }, [currentPage, pageSize]);

    return (
        <Base>
            <br />
            <div>
                <div>
                    <input id="search" type="text" placeholder="請輸入醫護號" />
                    <button id="searchbtn">搜尋</button>
                    <button id="addPersonButton">新增人員</button>
                </div>
            </div>
            <br /><br /><br />

            <div>
                <h2>人員列表</h2><br />
                {/* <button>上一頁</button>
                <button>下一頁</button> */}
                {/* <div id="pageBtn">
                    {Array.from({ length: totalPage }, (_, index) => index +1).map((page) => (
                        <button key={page} onClick={() => setCurrentPage(page)}>{page}</button>
                    ))}
                </div> */}
                <div id="pageBtn">
                    {renderBtns()}
                </div>
                <button id="deletebtn">刪除</button><br /><br />
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th className="text-center">勾選</th>
                        <th>醫護號</th>
                        <th>姓名</th>
                        <th>權限類別</th>
                    </tr>
                    </thead>
                    <tbody id="personnel_list"></tbody>
                </table>
            </div>

            <div id="detailModel" className="detail-modal">
                <div className="detail-modal-content">
                    <span className="detail-close">&times;</span>
                    <h2>人員詳細資料</h2>
                    <div id="detail"></div>
                </div>
            </div>

            <div id="addModal" className="add-modal">
                <div className="add-modal-content">
                    <span className="add-close">&times;</span>
                    <h2>新增人員</h2>
                    <form id="personForm">
                    <label htmlFor="ms_id">醫護號:</label>
                    <input type="text" id="ms_id" name="ms_id" required /><br /><br />

                    <label htmlFor="name">姓名:</label>
                    <input type="text" id="name" name="name" required /><br /><br />

                    <label htmlFor="password">密碼:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                    /><br /><br />

                    <label htmlFor="permissions">權限類別:</label>
                    <select id="permissions-select" name="permissions">
                        <option value="supervisor">主管</option>
                        <option value="nurse">醫護人員</option></select
                    ><br /><br />

                    <button type="submit">新增</button>
                    </form>
                </div>
            </div>

            <div id="editModal" className="edit-modal">
                <div className="edit-modal-content">
                    <span className="edit-close">&times;</span>
                    <form id="editForm">
                    <h2>編輯人員資料</h2>
                    <input type="hidden" id="edit_id" name="id" required /><br /><br />
                    <label htmlFor="ms_id">醫護號:</label>
                    <input type="text" id="edit_ms_id" name="ms_id" required /><br /><br />

                    <label htmlFor="name">姓名:</label>
                    <input type="text" id="edit_name" name="name" required /><br /><br />

                    <label htmlFor="permissions">權限類別:</label>
                    <select id="edit_permissions-select" name="permissions">
                        <option value="supervisor">主管</option>
                        <option value="nurse">醫護人員</option></select
                    ><br /><br />

                    <button type="submit">更新</button>
                    </form>
                </div>
            </div>
        </Base>
    );
}

export default Personnel;
