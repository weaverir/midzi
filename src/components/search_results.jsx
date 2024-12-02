"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SearchResults = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Extract query parameter from the URL
        const urlQuery = new URLSearchParams(window.location.search).get('name');
        setQuery(urlQuery);
    }, [ [ {} , {} ]] );

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                setLoading(true);
                try {
                    const response = await axios.get('https://midzi.liara.run/search/', {
                        params: { search: query }
                    });
                    console.log(response.data); // Debug: Log the API response
                    setResults(response.data.results.products || []); // Adjust based on API response
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };

            fetchResults();
        }
    }, [query]); // Fetch results whenever the query changes

    return (
        <div className="bg-navblue rounded-2xl flex justify-center mx-2 p-6">
            <div className="bg-white rounded-2xl grid gap-6 justify-center items-center p-4 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    results.length > 0 ? (
                        results.map((item) => (
                            <div key={item.id} className="h-[350px] min-w-56 max-w-56 bg-myblue rounded-xl flex flex-col justify-between">
                                <div className='flex flex-col justify-start'>
                                    <div className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'></div>
                                </div>
                                <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl">{item.name}</div>
                            </div>
                        ))
                    ) : (
                        <div> موردی برای "{query}" یافت نشد </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchResults;
