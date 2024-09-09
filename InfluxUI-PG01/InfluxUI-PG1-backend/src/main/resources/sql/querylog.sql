-- Table: public.query_log

-- DROP TABLE IF EXISTS public.query_log;

CREATE TABLE IF NOT EXISTS public.query_log
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT nextval('query_log_id_seq'::regclass),
    user_id character varying(255) COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    bucket character varying(255) COLLATE pg_catalog."default",
    measurement character varying(255) COLLATE pg_catalog."default",
    fields character varying(255) COLLATE pg_catalog."default",
    tags character varying(255) COLLATE pg_catalog."default",
    query_duration character varying(255) COLLATE pg_catalog."default",
    result_status character varying(255) COLLATE pg_catalog."default",
    result_count character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT query_log_pkey PRIMARY KEY (id),
    CONSTRAINT query_log_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.app_user (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.query_log
    OWNER to postgres;