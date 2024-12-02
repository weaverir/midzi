"use client"
import React, {useEffect, useState} from 'react';
import FilterSearch from "@/components/filters";
import SearchResults from "@/components/search_results";
import axios from "axios";

function Page(props) {

    return (
        <div className="max-w-[1440px]  2xl:mx-auto mt-10 ">
            <FilterSearch/>
            <SearchResults/>
        </div>
    );
}

export default Page;