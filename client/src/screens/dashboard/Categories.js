import React from 'react'
import Wrapper from './Wrapper'
import ScreenHeader from '../../components/ScreenHeader'
import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSuccess, clearMessage } from '../../store/reducers/globalReducer'
import { useGetQuery, useDeleteCategoryMutation } from '../../store/services/categoryService'
import Spinner from '../../components/Spinner'
import Pagination from '../../components/Pagination'

const Categories = () => {

    let {page} = useParams();
    if (!page) {
        page = 1;  // if the value of page is not clear it will take 1.
    }

    const {success} = useSelector(state => state.globalReducer);
    
    const dispatch = useDispatch();

    const {data = [], isFetching} = useGetQuery(page);

    const [removeCategory, response] = useDeleteCategoryMutation();
    console.log(response)

    const deleteCat = id => {                // function to delete the category with a confirmation message on window.
        if (window.confirm('Are you really want to delete this category')) {
            removeCategory(id);
        } 
    }

    useEffect(() => {
        if (response.isSuccess) {
            dispatch(setSuccess(response?.data?.message));
        }
       }, [response?.data?.message])  // it will dispatch a message.

    useEffect(() => {
        dispatch(setSuccess(success))
        return () => {
           dispatch(clearMessage())
        }
       }, [])

    return (
        <Wrapper>
            <ScreenHeader>
                <Link to={"/dashboard/create-category"} className='btn-dark'>add categories  <i className='bi bi-plus'></i></Link>
            </ScreenHeader>
            {success && <div className='alert-success'>{success}</div> }
            {!isFetching ? data?.categories?.length > 0 && <><div className=''>
                <table className='w-full bg-gray-900 rounded-md'>
                    <thead>
                        <tr className='border-b border-gray-800 text-left'>
                            <th className='p-3 uppercase text-sm font-medium text-gray-500'>name</th>
                            <th className='p-3 uppercase text-sm font-medium text-gray-500'>edit</th>
                            <th className='p-3 uppercase text-sm font-medium text-gray-500'>delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.categories.map(category => (
                            <tr key={category._id} className='odd:bg-gray-800'>
                                <td className='p-3 capitalize text-sm font-normal text-gray-400'>{category.name}</td>
                                <td className='p-3 capitalize text-sm font-normal text-gray-400'>
                                    <Link className="btn btn-warning" to={`/dashboard/update-category/${category._id}`}>
                                    edit</Link></td>
                                <td className='p-3 capitalize text-sm font-normal text-gray-400'>
                                    <button className='btn btn-danger' onClick={() => deleteCat(category._id)}>delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div><Pagination page={parseInt(page)} perPage={data.perPage} count={data.count}
            path="dashboard/categories" /></> : <Spinner />}    
        </Wrapper>    // if the category is available it will create a table otherwise the spinner will be shown as a loading.
    )
}

export default Categories