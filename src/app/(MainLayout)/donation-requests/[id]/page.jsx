import React from 'react';

const ViewDetailsPage =async ({params}) => {
    const {id} = await params
    console.log(id);
    return (
        <div>
            
        </div>
    );
};

export default ViewDetailsPage;