import React, { useRef, useEffect, useState, } from 'react'
import "../../Fonts/RetroGaming.ttf"
import ModifyStatCard from './ModifyStatCard'

export default function BetweenRound() {
    //This will take in player and modify their data based on what the person has chosen

    return (
        <div>
            <h1 id="betweenRound">UPGRADE </h1>
            <div className='StatCard'></div>
            <ModifyStatCard />
        </div>
    )
}