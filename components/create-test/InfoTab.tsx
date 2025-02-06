import React from 'react'

const InfoTab = ({ title, color, image }: {
    title: string,
    color: string,
    image: string
}) => {
    return (
        <div className={`bg-[#${color}] flex p-4 font-laila rounded-md items-center w-full mx-auto`}>
            <img className='rounded-full w-6 h-6 mr-4' src={`/${image}.png`} alt='question-mark' />
            <span>{title}</span>
        </div >
    )
}

export default InfoTab
