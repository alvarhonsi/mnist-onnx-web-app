import React from 'react';
import styled from 'styled-components';


const BarBackdrop = styled.div`
    width: 1.1rem;
    height: 100%;
    background: #F5F7FF;
`

const BarHighlight = styled.div`
    width: 1.1rem;
    height: ${props => Math.round(props.percent*100, 0)}%;
    background: ${props => props.highlight ? '#89D7EB' : '#CFD1D7'};
    position: absolute;
    bottom: 0px;
`


const BarGraph = ({num, fillPercent, height, width, highlight=false}) => {
    return (
        <div className=''>
            <div className='relative h-[85%] w-full'>
                <BarBackdrop />
                <BarHighlight percent={fillPercent} highlight={highlight}/>
            </div>
            <p className='text-slate-400 pt-1'>{num}</p>
        </div>

    )

} 

export default BarGraph
