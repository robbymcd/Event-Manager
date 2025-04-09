"use client"
import React, { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

import Navbar from '@/components/navbar/navbar';
import Event from '@/components/event/event';
import { EventType } from '@/app/interfaces/event';
import Commments from '@/components/comments/comments';
import Ratings from '@/components/ratings/ratings';

import styles from './page.module.css';
import { Button } from '@/components/ui/button';


type PageParams = {
    id: string;
};

export default function EventPage({ params }: { params: PageParams | Promise<PageParams> }) {

    const id = params instanceof Promise ? use(params).id : params.id;
    const numericId = parseInt(id, 10);

    const [event, setEvent] = useState<EventType | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${id}`);
                if (!response.ok) {
                    throw new Error('Event not found');
                }
                const data: EventType = await response.json();
                setEvent(data);

            } catch (error) {
                console.error("Failed to fetch event:", error);
                notFound(); // This will trigger a 404 page
            }
        };
        fetchEvent();
        initMap();
    }, [id]);

    let map: google.maps.Map;
    async function initMap(): Promise<void> {
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        map = new Map(document.getElementById("map") as HTMLElement, {
            center: { lat: 28.6024, lng: -81.2001 },
            zoom: 16,
        });
    }

    const addToGoogleCalendar = () => {

    }
    
    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.content}>
                <div className={styles.row}>
                    {event && <Event 
                                id={event.id} 
                                name={event.name} 
                                category={event.category} 
                                event_time={event.event_time} 
                                location={event.location} 
                                contact_phone={event.contact_phone} 
                                contact_email={event.contact_email} 
                                rso={event.rso} 
                    />}
                    {!event && <p className={styles.error}>Event not found.</p>}
                    <div className={styles.map} id="map"></div>
                </div>
                <h1 className={styles.title}>Comments</h1>
                <Commments eventId={event?.id} /> 
                <h1 className={styles.title}>Rating</h1>
                <Ratings />
            </div>
        </div>
    )
}