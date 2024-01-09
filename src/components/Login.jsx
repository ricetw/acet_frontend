import React, { useState } from 'react';
import '../styles/login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        console.log(username);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:5000/web/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();
            const resultDiv = document.getElementById('result');

            if (data.result === 0) {
                sessionStorage.setItem('token', data.token);
                window.location.href = '/';
            }
            else {
                resultDiv.innerHTML = data.message;
            }
        }
        catch (err) {
            console.log('err', err);
        }
    };

    return (
        <div>
            <br /><br /><br /><br />
            <div className="container-fluid-login text-center">
                <br />
                <div className="row ">
                    <h1 className=''>登入</h1>
                </div>
                <br />

                <form id="login-form" className="row login-form" onSubmit={handleSubmit}>
                    <div className="row">
                        <label htmlFor="username" className="col-3 p-3">醫護號：</label>
                        <input
                        type="text"
                        id="username"
                        name="username"
                        value={username} 
                        onChange={handleUsernameChange} 
                        className="col"
                        required
                        />
                    </div>
                    <div className="row"></div><br />
                    <div className="row">
                        <label htmlFor="password" className="col-3 p-3">密碼：</label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        value={password} 
                        onChange={handlePasswordChange}
                        className="col"
                        required
                        />
                    </div>
                    <div className="row"></div><br /><br />
                    <div className="row">
                        <div id="result"></div>
                    </div>
                    <div className="row"></div><br />
                    <div className="row justify-content-center">
                        <button className="w-25" type="submit">登入</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
