CREATE TABLE posts (
    id bigserial primary key,
    post_name varchar(255) NOT NULL,
    post_summary text NOT NULL,
    post_content text NOT NULL,
    date_added timestamp default CURRENT_TIMESTAMP
);

-- Create 250,000 records
DO
$do$
BEGIN 
   FOR i IN 1..250000 LOOP
      INSERT INTO posts(post_name, post_summary, post_content) VALUES(
    'A good blog post', 
    'This is the summary about the blog post', 
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum'
);
   END LOOP;
END
$do$;