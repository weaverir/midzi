"use client"
import React from 'react';


const FilterSearch = () => {

    const [filter1, setFilter1] = React.useState(false);
    const [filter2, setFilter2] = React.useState(false);

    return (
        <div className=' flex flex-row mx-3 justify-start gap-8 my-4 w-2/3 '>
            <div className="relative">
                <div className=" w-full relative  cursor-pointer flex flex-row bg-myblue rounded-xl select-none text-text_w gap-3 px-4 py-2" onClick={() => setFilter1(!filter1)}>
                    <p className="font-awsome text-text_w   text-xl">     </p>  فیلترها <p
                    className="font-awsome text-text_w text-xl">  </p>

                </div>
                {filter1 ? (<div className=" absolute flex z-50 top-12 right-0 bg-navblue text-text_b rounded-xl "> sadsad</div>) : ``}

            </div>
            <div className="relative">
                <div
                    className="  w-full  flex flex-row  cursor-pointer bg-myblue select-none rounded-xl text-text_w px-4 py-2"
                    onClick={() => setFilter2(!filter2)}>
                    <p className="font-awsome text-text_wr  text-xl">  </p> مرتب سازی <p
                    className="font-awsome text-text_w text-xl"> </p>

                </div>
                {filter2 ? (<div className=" text-text_b absolute flex flex-col justify-center z-50 top-12 right-0 bg-navblue rounded-xl ">

                    <ul>
                        جدیدترین
                    </ul>
                    <ul>
                        گرانترین
                    </ul>
                    <ul>
                        ارزانترین
                    </ul>
                    <ul>
                        محبوبترین
                    </ul>

                </div>) : ``}
            </div>



        </div>
    );
};

            export default FilterSearch;