"use client"
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/navbar/navbar";

import { useUser } from "../context/userContext"; 

import styles from './page.module.css';


export default function Dashboard() {

    const { user } = useUser();

    console.log("User in Dashboard:", user);

    // fetch events from the server
    const [events, setEvents] = useState([]);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/events?role=${user?.role}&rso=${user?.rso}&university=${user?.university}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };
        fetchEvents();
    }, [user]);

    return (
        <div className={styles.dashboard}>
            <Navbar />
        </div>
    )
}