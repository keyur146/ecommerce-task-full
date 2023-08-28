import React from 'react'
import { useState, useEffect } from 'react';
import { useAuthLoginMutation } from '../../store/services/authService';
import { setAdminToken } from '../../store/reducers/authReducer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    
    const navigate = useNavigate();

    const[state, setState] = useState({
        email: '',
        password: ''
    })

    const handleInputs = e => {
        setState({...state, [e.target.name]: e.target.value})
    }

    const [login, response] = useAuthLoginMutation();
    console.log('my response', response);

    const errors = response?.error?.data?.errors ? response?.error?.data?.errors : [];

    const AdminLoginFunction = e => {
        e.preventDefault();
        login(state);
    }

    const dispatch = useDispatch();

    useEffect(() => {
        if (response.isSuccess) {
            localStorage.setItem('admin-token', response?.data?.token);
            dispatch(setAdminToken(response?.data?.token));
            navigate('/dashboard/products');
        }
    }, [response.isSuccess])

    return (
        <div className='bg-black1 h-screen flex justify-center items-center rounded' onSubmit={AdminLoginFunction}>
            <form className='bg-black2 p-5 w-10/12 sm:w-8/12 md:w-6/12 lg:w-3/12'>
                <h3 className='mb-4 text-white capitalize font-semibold text-lg'>dashboard login</h3>
                {errors.length > 0 && errors.map((error, key) => (
                   <div key={key}>
                       <p className="alert-danger">{error.msg}</p>
                   </div>
                )) }
                <div className='mb-4 mt-4'>
                    <input type='email' name='email' className='w-full bg-black1 p-4 rounded outline-none text-white'
                        placeholder='Enter email...' onChange={handleInputs} value={state.email} />
                </div>
                <div className='mb-4'>
                    <input type='password' name='password' className='w-full bg-black1 p-4 rounded outline-none text-white'
                        placeholder='Enter password...' onChange={handleInputs} value={state.password} />
                </div>
                <div className='mb-4'>
                    <input type='submit' value={response.isLoading ? 'loading...' : 'Sign in'} className='bg-indigo-600 w-full p-4 rounded
                 text-white uppercase font-semibold cursor-pointer' />
                </div>
            </form>
        </div>
    )
}

export default AdminLogin;