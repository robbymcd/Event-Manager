import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import styles from './comments.module.css';
import pfp from '../../../public/pfp.png';
import editIcon from '../../../public/edit.png';
import deleteIcon from '../../../public/delete.png';
import { Textarea } from '../ui/textarea';

import { useUser } from '@/app/context/userContext';
import { Button } from '../ui/button';

import { date } from 'zod';

interface CommentType {
    id: number;
    email: string;
    date: string;
    comment: string;
}

interface CommentsProps {
    eventId: number | undefined;
}

export default function Commments({ eventId }: CommentsProps) {

    const { user } = useUser();

    const [comments, setComments] = useState<any[]>([]);

    const [commentState, setCommentState] = useState<string>('Add'); // 'add' or 'edit'
    const [addCommentText, setAddCommentText] = useState<string>('');
    const [editCommentText, setEditCommentText] = useState<string>('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

    useEffect(() => {
        try {
            // fetch comments
            const data = [
                {
                    id: 0,
                    email: 'ro037275@ucf.edu',
                    date: '2023-10-15T10:00:00Z',
                    comment: 'This event was amazing! I learned so much.'
                },
                {
                    id: 1,
                    email: 'testuser@ucf.edu',
                    date: '2023-10-16T12:00:00Z',
                    comment: 'Great event! The speakers were very informative.'
                },
                {
                    id: 2,
                    email: 'testuser2@ucf.edu',
                    date: '2023-10-17T14:00:00Z',
                    comment: 'I really enjoyed the networking opportunities.'
                }
            ]
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    }, []);

    const deleteComment = async (commentId: number) => {
        try {
            // const response = await fetch(`/api/comments/${commentId}`, {
            //     method: 'DELETE',
            // });
            // if (!response.ok) {
            //     throw new Error('Failed to delete comment');
            // }
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    }

    const startEditComment = async (commentId: number, prevCommentText: string) => {
        setCommentState('Edit');
        setEditCommentText(prevCommentText);
        setAddCommentText('');
        setEditingCommentId(commentId);
    }

    const editComment = async (commentId: number) => {
        try {
            // const response = await fetch(`/api/comments/${commentId}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ comment: editCommentText }),
            // });
            // if (!response.ok) {
            //     throw new Error('Failed to edit comment');
            // }
            setComments(comments.map(comment => comment.id === commentId ? { ...comment, comment: editCommentText } : comment));
        } catch (error) {
            console.error("Failed to edit comment:", error);
        }
    }

    const addComment = async () => {
        try {
            // const response = await fetch(`/api/comments`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ comment: addCommentText, eventId }),
            // });
            // if (!response.ok) {
            //     throw new Error('Failed to add comment');
            // }
            // const newComment = await response.json();
            // setComments([...comments, newComment]);
            const newComment = {
                id: comments.length,
                email: user?.email,
                date: new Date().toISOString(),
                comment: addCommentText
            }
            setComments([...comments, newComment]);
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    }

    return (
        <div className={styles.commentsContainer}>
            <div className={styles.commentsList}>
                {comments.map((comment: CommentType) => (
                    <div key={comment.id} className={styles.comment}>
                        <Image src={pfp} alt="User" width={50} height={50} className={styles.userImage} />
                        <div className={styles.commentHeader}>
                            <div className={styles.commentInfo}>
                                <h3 className={styles.commentEmail}>{comment.email}</h3>
                                <p className={styles.commentDate}>{new Date(comment.date).toLocaleString()}</p>
                            </div>
                            <p className={styles.commentText}>{comment.comment}</p>
                        </div>
                        {/* if user.id === comment.user_id (need to fetch in useEffect) */}
                        <div className={styles.commentActions}>
                            <Image onClick={() => startEditComment(comment.id, comment.comment)} src={editIcon} alt="Edit" width={25} height={25} className={styles.actionIcon} />
                            <Image onClick={() => deleteComment(comment.id)} src={deleteIcon} alt="Delete" width={25} height={25} className={styles.actionIcon} />
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.commentInputContainer}>
                <Textarea 
                    value={
                        commentState === 'Add' ? addCommentText : editCommentText
                    }
                    onChange={(e) => {
                        if (commentState === 'Add') {
                            setAddCommentText(e.target.value);
                        } else {
                            setEditCommentText(e.target.value);
                        }
                    }}
                    className={styles.commentInput} 
                    placeholder="Leave a comment..." />
                <Button
                    onClick={() => {
                        if (commentState === 'Add') {
                            // add comment
                            addComment();
                            setAddCommentText('');
                        } else {
                            if (editingCommentId !== null) {
                                editComment(editingCommentId);
                            }
                            // edit comment
                            setCommentState('Add');
                            setEditCommentText('');
                            setEditingCommentId(null);
                        }
                    }}
                    variant="outline" 
                    className={styles.commentSubmitButton}>
                    {commentState} Comment
                </Button>
            </div>
        </div>
    )
}