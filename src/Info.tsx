import React, {useEffect, useState} from 'react';

// @ts-ignore
function Info(props) {

    return (
        <div>
            <div>{props.info}</div>
        </div>
    )
}

export default React.memo(Info);
