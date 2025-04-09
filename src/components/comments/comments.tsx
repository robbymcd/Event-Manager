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
  email: string;
  date: string;
  comment: string;
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

  // Fetch comments for the specific event
  useEffect(() => {
    const fetchComments = async () => {
      if (!eventId) return;
      try {
        const response = await fetch(`/api/comments?eventId=${eventId}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, [eventId]);

  const addComment = async () => {
    if (!eventId || !user) return;
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment_id: Date.now(), // optional, use UUID or remove this if not needed
          user_id: user.id,
          event_id: eventId,
          rating: 0, // you can update this as needed
          comment: addCommentText,
        }),
      });
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setAddCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const startEditComment = (commentId: number, prevCommentText: string) => {
    setCommentState('Edit');
    setEditCommentText(prevCommentText);
    setAddCommentText('');
    setEditingCommentId(commentId);
  };

  const editComment = async (commentId: number) => {
    // Implement this endpoint in your API
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: editCommentText }),
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

  const deleteComment = async (commentId: number) => {
    // Implement this endpoint in your API
    try {
      await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
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
                <p className={styles.commentDate}>{new Date(comment.date).toLocaleString()}</p>
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
            if (commentState === 'Add') {
              addComment();
            } else if (editingCommentId !== null) {
              editComment(editingCommentId);
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
