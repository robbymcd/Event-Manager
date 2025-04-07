"use client"
import React, { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

import Navbar from '@/components/navbar/navbar';
import Event from '@/components/event/event';
import { EventType } from '@/app/interfaces/event';

import styles from './page.module.css';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
                //const response = await fetch(`/api/events/${id}`);
                //if (!response.ok) {
                //    throw new Error('Event not found');
                //}
                //const data: EventType = await response.json();
                const data : EventType = {
                    id: 1,
                    name: "Sample Event",
                    category: "rso",
                    event_time: "2023-10-15T10:00:00Z",
                    location: "Main Auditorium, Tech University",
                    contact_phone: "(123) 456-7890",
                    contact_email: "testadmin@ucf.edu",
                    rso: "Tech Club"
                }
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

    const addToCalendar = () => {
        if (!event) return;

        const eventDate = new Date(event.event_time);
        const formattedDate = eventDate.toISOString().replace(/-|:|\.\d+/g, "");

        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${formattedDate}/${formattedDate}&details=${encodeURIComponent("Event at " + event.location)}&location=${encodeURIComponent(event.location)}&trp=false`;

        window.open(calendarUrl, "_blank");
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
                {/* Comments */}
                {/* Rating */}
                <Button variant="outline" className={styles.button} onSubmit={addToCalendar}>Add to calendar</Button>
            </div>
        </div>
    )
}