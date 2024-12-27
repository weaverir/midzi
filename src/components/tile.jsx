import React from 'react';

const Tile = () => {
    return (
        <div className="flex flex-col gap-8 my-2">
            <div className="  flex flex-row w-[100%] justify-between px-3">
                <div
                    className="2xl:h-[350px] 2xl:w-[20%]  xl:h-[350px] xl:w-[20%] lg:h-[350px] lg:w-[25%] md:h-[320px] md:w-[25%] sm:h-[270px] sm:w-[25%] w-[27%] h-[170px]   bg-myblue rounded-2xl"></div>
                <div
                    className="2xl:h-[350px] 2xl:w-[20%] xl:h-[350px] xl:w-[20%] lg:h-[350px] lg:w-[25%] md:h-[320px] md:w-[25%] sm:h-[270px] sm:w-[25%] w-[27%] h-[170px]  bg-mypurple rounded-2xl"></div>
                <div
                    className="2xl:h-[350px] 2xl:w-[20%] xl:h-[350px] xl:w-[20%] lg:h-[350px] lg:w-[25%] md:h-[320px] md:w-[25%] sm:h-[270px] sm:w-[25%]  w-[27%] h-[170px] bg-mygblue rounded-2xl "></div>
            </div>
            <div className="  flex flex-row w-[100%] justify-between px-3">
                <div
                    className="2xl:h-[350px] 2xl:w-[20%]  xl:h-[350px] xl:w-[20%] lg:h-[350px] lg:w-[25%] md:h-[320px] md:w-[25%] sm:h-[270px] sm:w-[25%] w-[27%] h-[170px]   bg-myblue rounded-2xl"></div>
                <div
                    className="2xl:h-[350px] 2xl:w-[20%] xl:h-[350px] xl:w-[20%] lg:h-[350px] lg:w-[25%] md:h-[320px] md:w-[25%] sm:h-[270px] sm:w-[25%] w-[27%] h-[170px]  bg-mypurple rounded-2xl"></div>
                <div
                    className="2xl:h-[350px] 2xl:w-[20%] xl:h-[350px] xl:w-[20%] lg:h-[350px] lg:w-[25%] md:h-[320px] md:w-[25%] sm:h-[270px] sm:w-[25%]  w-[27%] h-[170px] bg-mygblue rounded-2xl "></div>
            </div>
        </div>
    );
};

export default Tile;