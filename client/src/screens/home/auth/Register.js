import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import Header from "../../../components/home/Header";
import Nav from "../../../components/home/Nav";
import { useUserRegisterMutation } from "../../../store/services/authService";
import { setUserToken } from "../../../store/reducers/authReducer";
import { setSuccess } from "../../../store/reducers/globalReducer";
import { useForm } from "../../../hooks/Form";
import { ShowError } from "../../../utils/ShowError";

const Register = () => {

    const [errors, setErrors] = useState([]);

    const {state, onChange} = useForm(
        {
            name: '',
            email: '',
            password: ''
        }
    );

    const [registerUser, response] = useUserRegisterMutation();

    const onSubmit = e => {
        e.preventDefault();
        registerUser(state);
    }

    useEffect(() => {
        if (response.isError) {
            setErrors(response?.error?.data?.errors);
        }
    }, [response?.error?.data])
    
    useEffect(() => {
        if (response.isSuccess) {
            localStorage.setItem('userToken', response?.data?.token);
            dispatch(setUserToken(response?.data?.token))
            dispatch(setSuccess(response?.data?.msg))
            navigate('/user')
        }
    }, [response.isSuccess])

    const dispatch = useDispatch();
    const navigate = useNavigate();

    return(
        <>
        <Nav />
        <div className="mt-[70px] pb-[80px]">
        <Header>
            Sign Up
        </Header>
        <div className="flex flex-wrap justify-center">
            <motion.div
                initial={{opacity: 0, x: "-100vw"}}
                animate={{opacity: 1, x: 0}}
                className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 p-6">
                <form onSubmit={onSubmit} className="bg-white rounded-lg -mt-12 border border-gray-200 p-10">
                <h1 className="heading mb-5">sign up</h1>
                <div className="mb-4">
                    <label htmlFor="name" className="form-label">name</label>
                    <input type="text" name="name" id="name" className=
                    {`form-input ${ShowError(errors, 'name') ? 'border-rose-600 bg-rose-50' : 'border-gray-300 bg-white'}`}
                    placeholder="Name..." value={state.name} onChange={onChange} />
                    {ShowError(errors,'name') && <span className="error">{ShowError(errors, 'name')}</span>}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="form-label">email</label>
                    <input type="email" name="email" id="email" className=
                    {`form-input ${ShowError(errors, 'email') ? 'border-rose-600 bg-rose-50' : 'border-gray-300 bg-white'}`}
                    placeholder="Email..." value={state.email} onChange={onChange} />
                    {ShowError(errors, 'email') && <span className="error">{ShowError(errors, 'email')}</span>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="form-label">password</label>
                    <input type="password" name="password" id="password" className=
                    {`form-input ${ShowError(errors, 'password') ? 'border-rose-600 bg-rose-50' : 'border-gray-300 bg-white'}`}
                    placeholder="Password..." value={state.password} onChange={onChange} />
                    {ShowError(errors, 'password') && <span className="error">{ShowError(errors, 'password')}</span>}
                </div>
                <div className="mb-4">
                    <input type="submit" value={`${response.isLoading ? 'Loading...' : 'sign up'}`} 
                    className="btn btn-indigo w-full" disabled={response.isLoading ? true  : false} />
                </div>
                <div>
                    <p>Already have an account ? <span className="capitalize font-medium text-base text-black">
                    <Link to="/login">Sign in</Link></span></p>
                </div>
                </form>
            </motion.div>
        </div>
        </div>
        </>
    )
}

export default Register;