import React from 'react'
import { CircularProgress } from '@material-ui/core'

function CircularLoadingIcon({text}) {
    return (
        <div style={{textAlign:'center'}}>
            <CircularProgress/>
            <p>{text}</p>
        </div>
    )
}

export default CircularLoadingIcon
