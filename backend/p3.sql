SELECT US.id, US.nickname, US.avatar
FROM (
	SELECT MS.id_reader As reader, 
	MS.content As content,
    DATEDIFF(NOW(), MS.created_at) AS date_diff,
	TIMEDIFF( MS.created_at,NOW()) As time_diff,
	TIME(MS.created_at) As hour_send
    FROM message As MS
    WHERE MS.id_reader ='1'
    GROUP BY MS.id_author
    ) MS

  INNER JOIN user As US ON US.id = MS.id_author;
  

SELECT 
	id_author,
    content, 
    DATEDIFF(NOW(), message.created_at) AS date_diff,
	TIMEDIFF( message.created_at,NOW()) As time_diff,
	TIME(message.created_at) as hour_send,
    nickname, 
    avatar
FROM 
	message 
	INNER JOIN user ON user.id = message.id_author
WHERE 
	id_reader=1
ORDER BY 
	message.created_at DESC, 
    id_author DESC;

-- User courant: 1
-- Correspondants: N

-- Selectionner tous les messages qui me concernent
SELECT 
    content
FROM 
	message
WHERE
	id_author = 1
    OR id_reader = 1;
    
-- Selectionner tous les messages qui me concernent ET concernent l'user N
SELECT 
    content
FROM 
	message
WHERE
	(id_author = 2 OR id_reader = 2)
    AND (id_author = 1 OR id_reader = 1);
    
-- Selectionner le dernier message d'une conversation entre N et moi-même
SELECT 
    content
FROM 
	message
WHERE
	(id_author = 2 OR id_reader = 2)
    AND (id_author = 1 OR id_reader = 1)
ORDER BY id DESC LIMIT 1;

-- Avoir un ID de conversation (ID de N)
SELECT 
    if(id_author = 1, id_reader, id_author) AS id_otherguy,
    content
FROM 
	message
WHERE
	(id_author = 2 OR id_reader = 2)
    AND (id_author = 1 OR id_reader = 1)
ORDER BY id DESC LIMIT 1;

-- Dernier message de chaque converse
-- XXXXXXXXXX
SELECT 
    if(id_author = 1, id_reader, id_author) AS id_otherguy,
    id as lastmessage
FROM 
	message
WHERE
    (id_author = 1 OR id_reader = 1)
GROUP BY id_otherguy
ORDER BY lastmessage DESC LIMIT 1;

-- Liste des N
SELECT 
	DISTINCT(if(id_author = 1, id_reader, id_author)) AS id_otherguy
FROM message;





-- Reset isLast for every mesage concerned
UPDATE
	message
SET isLast=0
WHERE
	(id_author = 2 OR id_reader = 2)
    AND (id_author = 1 OR id_reader = 1);
-- Add new message, which isLast
INSERT INTO message(id_author,id_reader,content,created_at,isLast) 
VALUES(1,2,"Chevre",NOW(),1);

-- Select all last messages
SELECT *
FROM message
WHERE (id_author=1 OR id_reader=1) AND isLast=1;

