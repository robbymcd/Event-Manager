import { use } from 'react';
import { notFound } from 'next/navigation';

export default function Event({ params }: { params: { id: string}}) {
    
    const { id } = params;

    return (
        <div>
            <h1>Event ID: {id}</h1>
        </div>
    )
}