-- Table: public.query_log

-- DROP TABLE IF EXISTS public.query_log;

CREATE TABLE IF NOT EXISTS public.query_log
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    user_id character varying(255) COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    bucket character varying(255) COLLATE pg_catalog."default",
    measurement character varying(255) COLLATE pg_catalog."default",
    fields character varying(255) COLLATE pg_catalog."default",
    tags character varying(255) COLLATE pg_catalog."default",
    query_duration character varying(255) COLLATE pg_catalog."default",
    result_status character varying(255) COLLATE pg_catalog."default",
    result_count character varying(255) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.query_log
    OWNER to sep;