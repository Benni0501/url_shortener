# URL Shortener
## Description
This is just a small application that i wrote. You can shorten long URLs to a simple URL like Bitly can do.
## Used technologies
- PostgreSQL
- ExpressJS
## How to start
### Set up
- Clone the repository
- Execute `npm install`
- Execute `npm run build`
- Run the following SQL script on your PostgreSQL database:
```sql
-- Database Creation
DROP DATABASE IF EXISTS url_shortener;

CREATE DATABASE url_shortener
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
-- Table Creation
DROP TABLE IF EXISTS public.url;

CREATE TABLE IF NOT EXISTS public.url
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    url character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT url_pkey PRIMARY KEY (id)
)
```
### Running the application
- Execute `npm run start`

### For Docker Deployment
- Build a image with the Dockerfile
#### For Development
- Execute `npm run dev`