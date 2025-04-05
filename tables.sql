-- Table: public.events

-- DROP TABLE IF EXISTS public.events;

CREATE TABLE IF NOT EXISTS public.events
(
    id integer NOT NULL DEFAULT nextval('events_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    category character varying(50) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    event_time timestamp without time zone NOT NULL,
    location character varying(255) COLLATE pg_catalog."default" NOT NULL,
    contact_phone character varying(20) COLLATE pg_catalog."default",
    contact_email character varying(100) COLLATE pg_catalog."default",
    participants character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT events_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.events
    OWNER to postgres;


-- Table: public.ratings

-- DROP TABLE IF EXISTS public.ratings;

CREATE TABLE IF NOT EXISTS public.ratings
(
    id integer NOT NULL DEFAULT nextval('ratings_id_seq'::regclass),
    user_id integer,
    event_id integer,
    rating integer,
    comment text COLLATE pg_catalog."default",
    CONSTRAINT ratings_pkey PRIMARY KEY (id),
    CONSTRAINT ratings_rating_check CHECK (rating >= 1 AND rating <= 5)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ratings
    OWNER to postgres;



-- Table: public.rsos

-- DROP TABLE IF EXISTS public.rsos;

CREATE TABLE IF NOT EXISTS public.rsos
(
    id integer NOT NULL DEFAULT nextval('rsos_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    university character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description character varying(250) COLLATE pg_catalog."default" NOT NULL,
    category character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT rsos_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.rsos
    OWNER to postgres;


-- Table: public.university

-- DROP TABLE IF EXISTS public.university;

CREATE TABLE IF NOT EXISTS public.university
(
    id integer NOT NULL DEFAULT nextval('university_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    location character varying(100) COLLATE pg_catalog."default" NOT NULL,
    numstudent integer NOT NULL,
    description character varying(250) COLLATE pg_catalog."default",
    CONSTRAINT university_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.university
    OWNER to postgres;


-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role character varying(20) COLLATE pg_catalog."default" NOT NULL,
    university character varying(50) COLLATE pg_catalog."default" DEFAULT 'TEMP_UNIVERSITY'::character varying,
    rso character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;