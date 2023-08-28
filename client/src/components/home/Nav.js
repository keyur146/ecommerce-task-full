import React from 'react'
import { Link } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import { BsHandbag } from "react-icons/bs";
import { useSelector } from "react-redux"
import Search from './Search';
import { useDispatch } from 'react-redux';
import { toggleSearchBar } from '../../store/reducers/globalReducer';

const Nav = () => {

  const {userToken, user} = useSelector(state => state.authReducer);
  const { searchBar } = useSelector((state) => state.globalReducer);
  const { items, total } = useSelector((state) => state.cartReducer);
  console.log(total);
  const dispatch = useDispatch();

  return (
    <>
    <nav className='nav'>
        <div className='my-container'>
            <div className='flex justify-between items-center'>
                <Link to="/">
                    <img src='/logo.svg' alt='logo' className='h-full object-cover'/>
                </Link>
                <ul className='flex items-center'>
                    <li className='nav-li cursor-pointer'>
                    <FiSearch 
                    size={22}
                    onClick={() => dispatch(toggleSearchBar())}
                    /></li>
                    {userToken ? <li className='nav-li'><Link className='nav-link' to="/user">{user?.name}</Link></li> : <li 
                    className='nav-li'><Link className='nav-link' to="/login">sign in</Link></li>}
                    <li className='nav-li relative'><Link to="/cart">
                        <BsHandbag size={20} />
                        <span className='nav-circle'>{items}</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <Search />
    </>
  )
}

export default Nav