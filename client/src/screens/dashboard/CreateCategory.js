import React from 'react'
import Wrapper from './Wrapper'
import ScreenHeader from '../../components/ScreenHeader'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateMutation } from '../../store/services/categoryService'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSuccess } from '../../store/reducers/globalReducer'

const CreateCategory = () => {

    const [state, setState] = useState('');

    const [saveCategory, data] = useCreateMutation();

    console.log(data)

    const errors = data?.error?.data?.errors ? data?.error?.data?.errors : [];

    const submitCategory = e => {
        e.preventDefault();
        saveCategory({name: state});
    }

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (data?.isSuccess) {
            dispatch(setSuccess(data?.data?.message));
            navigate('/dashboard/categories');
        } else {
            
        }
    }, [data?.isSuccess])

    return (
        <Wrapper>
            <ScreenHeader>
                <Link to={"/dashboard/categories"} className='btn-dark'>
                <i className='bi bi-arrow-left'></i>  categories list</Link>
            </ScreenHeader>
            <form className='w-full md:w-8/12' onSubmit={submitCategory}>
                <h3 className='text-lg capitalize mb-3'>Create Category</h3>
                {errors.length > 0 && errors.map((error, key) => (
                       <p className="alert-danger" key={key}>{error.msg}</p>
                ))}
                <div className='mb-3'>
                    <input type='text' className='form-control' placeholder='Category Name...' value={state} 
                    onChange={(e) => setState(e.target.value)} />
                </div>
                <div className='mb-3'>
                    <input type='submit' value={data.isLoading ? 'loading...' : 'create category'} className='btn-indigo' />
                </div>
            </form>
        </Wrapper>
    )
}

export default CreateCategory;









//  const submitCategory = e => {
//     e.preventDefault();
//     saveCategory({name: state});
// }

// this function is used to handle the form submitions related to category creation when the form is submitted, 
// it prevents the default form submission behavior and then calls the saveCategory function, 
// passing an object containing the category name from the state variable to be saved or processed further.