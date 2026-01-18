// src/comtrollers/uiController.js
import db from '../configs/db.js';

export const getFeed = async (userId) => {
  const sql = `
      SELECT 
        p.id,
        p.media_url,
        p.media_type,
        p.caption,
        p.location,
        p.like_count,
        p.comment_count,
        p.created,

        u.id AS user_id,
        u.name,
        u.avatar,
        pr.username,

        EXISTS (
          SELECT 1 FROM likes l
          WHERE l.post_id = p.id AND l.user_id = ?
        ) AS liked

      FROM posts p
      JOIN users u ON u.id = p.user_id
      JOIN profiles pr ON pr.user_id = u.id

      JOIN friends f 
        ON (
            (f.user1_id = ? AND f.user2_id = p.user_id)
         OR (f.user2_id = ? AND f.user1_id = p.user_id)
        )
       AND f.status = TRUE

      WHERE p.created >= DATE_SUB(NOW(), INTERVAL 120 DAY)

      ORDER BY p.created DESC
      LIMIT 50
    `;

  const [rows] = await db.execute(sql, [userId, userId, userId]);
  return rows;
};

export const getExploreContent = async (userId) => {
  const sql = `
      SELECT 
        p.id,
        p.media_url,
        p.media_type,
        p.caption,
        p.location,
        p.like_count,
        p.comment_count,
        p.created,

        u.id AS user_id,
        u.name,
        u.avatar,
        pr.username,

        EXISTS (
          SELECT 1 FROM likes l
          WHERE l.post_id = p.id AND l.user_id = ?
        ) AS liked

      FROM posts p
      JOIN users u ON u.id = p.user_id
      JOIN profiles pr ON pr.user_id = u.id

      WHERE p.user_id != ?
        AND NOT EXISTS (
          SELECT 1 FROM friends f
          WHERE f.status = TRUE
            AND (
                (f.user1_id = ? AND f.user2_id = p.user_id)
             OR (f.user2_id = ? AND f.user1_id = p.user_id)
            )
        )

      ORDER BY p.like_count DESC, p.created DESC
      LIMIT 40
    `;

  const [rows] = await db.execute(sql, [userId, userId, userId, userId]);
  return rows;
};

export const getReels = async (userId) => {
  const sql = `
      SELECT 
        p.id,
        p.media_url,
        p.media_type,
        p.caption,
        p.like_count,
        p.comment_count,
        p.created,

        u.id AS user_id,
        u.name,
        u.avatar,
        pr.username,

        EXISTS (
          SELECT 1 FROM likes l
          WHERE l.post_id = p.id AND l.user_id = ?
        ) AS liked

      FROM posts p
      JOIN users u ON u.id = p.user_id
      JOIN profiles pr ON pr.user_id = u.id

      WHERE p.media_type = 'video'

      ORDER BY p.like_count DESC, p.created DESC
      LIMIT 25
    `;

  const [rows] = await db.execute(sql, [userId]);
  return rows;
};
