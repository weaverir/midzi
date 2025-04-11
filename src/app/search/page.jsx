
import React from 'react';
import FilterSearch from "@/components/filters";
import SearchResults from "@/components/search_results";
export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | جست و جو',
        description: 'جست و جو کردن محصولات',
    };
};

function Page(props) {

    return (
        <div className="max-w-[1440px]  2xl:mx-auto mt-10 ">
            <FilterSearch/>
            <SearchResults/>
        </div>
    );
}

export default Page;