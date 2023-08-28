import React from 'react'
import { FiSearch } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { toggleSearchBar } from '../../store/reducers/globalReducer';

const Search = () => {

    const [state, setState] = useState("");
    const navgiate = useNavigate();
    const { searchBar } = useSelector((state) => state.globalReducer);
    const dispatch = useDispatch();
    
    const closeSearch = (e) => {
        const id = e.target.getAttribute("id");
        id === "search" && dispatch(toggleSearchBar());
    };
    const searchProducts = () => {
        if (state === "") {
            return;
        }
        navgiate(`/search-products/${state}/1`);
        dispatch(toggleSearchBar());
    };

    return searchBar && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='fixed inset-0 w-full h-full bg-black/50 z-[300]'
            id="search"
            onClick={closeSearch}
        >
            <div className='flex -mx-8 justify-center'>
                <div className='w-full sm:w-10/12 md:w-8/12 lg:w-6/12 px-8 mt-10 relative'>
                    <input
                        type="text"
                        name=""
                        id=""
                        className="w-full bg-white h-[50px] rounded outline-none pl-5 pr-14"
                        placeholder="Search products...."
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    <FiSearch
                        className="absolute top-[13px] right-12 text-2xl text-gray-500 cursor-pointer"
                        onClick={searchProducts}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default Search