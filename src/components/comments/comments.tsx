"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import styles from './comments.module.css';
import pfp from '../../../public/pfp.png';
import editIcon from '../../../public/edit.png';
import deleteIcon from '../../../public/delete.png';
import { Textarea } from '../ui/textarea';
import { useUser } from '@/app/context/userContext';
import { Button } from '../ui/button';

interface CommentType {
  id: number;
  user_id: number;
  event_id: number;
  email: string;
  timestamp: string;
  comment: string;
  rating: number;
}

interface CommentsProps {
  eventId: number | undefined;
}

export default function Comments({ eventId }: CommentsProps) {
  const { user } = useUser();

  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentState, setCommentState] = useState<'Add' | 'Edit'>('Add');
  const [addCommentText, setAddCommentText] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  // Fetch comments when the component is mounted or when eventId changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!eventId) return;
      try {
        const response = await fetch(`/api/comments?event_id=${eventId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
            // Get current user's email (though this might not be needed for all comments)
            const userResponse = await fetch(`/api/users/${user?.id}`);
            const userData = await userResponse.json();
            
            // Map through comments and set them
            setComments(data);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, [eventId]);

  // Add a new comment
  const addComment = async () => {

    if (!user?.id || !eventId) {
        console.error('Missing user ID or event ID');
        return;
    }

    const formattedDate = new Date().toISOString();

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: formattedDate, 
          user_id: user?.id,
          event_id: eventId,
          rating: 2, // default rating or update as required
          comment: addCommentText,
        }),
      });

      const newComment = await response.json();
      console.log('New comment added:', newComment);
      setComments([newComment, ...comments,]);
      setAddCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // Start editing a comment
  const startEditComment = (commentId: number, prevCommentText: string) => {
    setCommentState('Edit');
    setEditCommentText(prevCommentText);
    setAddCommentText('');
    setEditingCommentId(commentId);
  };

  // Edit an existing comment
  const editComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/comments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            comment_id: commentId,
            new_comment: editCommentText,
        }),
      });
      const updatedComment = await response.json();
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, comment: updatedComment.comment } : comment
        )
      );
      setCommentState('Add');
      setEditCommentText('');
      setEditingCommentId(null);
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: number) => {
    try {
      await fetch(`/api/comments?comment_id=${commentId}`, { method: 'DELETE' });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <Image src={pfp} alt="User" width={50} height={50} className={styles.userImage} />
            <div className={styles.commentHeader}>
              <div className={styles.commentInfo}>
                <h3 className={styles.commentEmail}>{comment.email}</h3>
                <p className={styles.commentDate}>{new Date(comment.timestamp).toLocaleString()}</p>
              </div>
              <p className={styles.commentText}>{comment.comment}</p>
            </div>
            {Number(user?.id) === comment.user_id && (
              <div className={styles.commentActions}>
                <Image
                  onClick={() => startEditComment(comment.id, comment.comment)}
                  src={editIcon}
                  alt="Edit"
                  width={25}
                  height={25}
                  className={styles.actionIcon}
                />
                <Image
                  onClick={() => deleteComment(comment.id)}
                  src={deleteIcon}
                  alt="Delete"
                  width={25}
                  height={25}
                  className={styles.actionIcon}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.commentInputContainer}>
        <Textarea
          value={commentState === 'Add' ? addCommentText : editCommentText}
          onChange={(e) =>
            commentState === 'Add'
              ? setAddCommentText(e.target.value)
              : setEditCommentText(e.target.value)
          }
          className={styles.commentInput}
          placeholder="Leave a comment..."
        />
        <Button
            onClick={() => {
                console.log("Button clicked"); // Add logging here to check if it's firing
                if (commentState === 'Add') {
                    console.log("Adding comment"); // Log when adding a comment
                    addComment(); // Should call addComment if in 'Add' state
                } else if (editingCommentId !== null) {
                    console.log("Editing comment"); // Log when editing a comment
                    editComment(editingCommentId); // Should call editComment if editing
                }
            }}
            variant="outline"
            className={styles.commentSubmitButton}
            >
            {commentState} Comment
        </Button>
      </div>
    </div>
  );
}
