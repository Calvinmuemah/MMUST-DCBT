--
-- PostgreSQL database dump
--


-- Dumped from database version 17.12 (14c6cec)
-- Dumped by pg_dump version 17.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: update_daily_assessments_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_daily_assessments_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$;


--
-- Name: update_journal_entries_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_journal_entries_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    sender character varying(20) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT chat_messages_sender_check CHECK (((sender)::text = ANY ((ARRAY['user'::character varying, 'ai'::character varying])::text[])))
);


--
-- Name: chat_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    topic character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    public_id uuid
);


--
-- Name: daily_assessments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    stress_level text NOT NULL,
    main_challenge text NOT NULL,
    overwhelm_frequency text NOT NULL,
    answers jsonb,
    total_score integer,
    risk_level text,
    assessment_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journal_entries (
    id bigint NOT NULL,
    public_id uuid,
    user_id uuid NOT NULL,
    title text,
    content text NOT NULL,
    mood character varying(50) NOT NULL,
    insight text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT journal_entries_content_not_empty CHECK ((length(TRIM(BOTH FROM content)) > 0))
);


--
-- Name: journal_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.journal_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: journal_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.journal_entries_id_seq OWNED BY public.journal_entries.id;


--
-- Name: newsletter_broadcasts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_broadcasts (
    id integer NOT NULL,
    subject character varying(255) NOT NULL,
    body text NOT NULL,
    recipient_count integer DEFAULT 0,
    sender_email character varying(255),
    created_by uuid,
    sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'sent'::character varying
);


--
-- Name: newsletter_broadcasts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletter_broadcasts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletter_broadcasts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletter_broadcasts_id_seq OWNED BY public.newsletter_broadcasts.id;


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'active'::character varying,
    source character varying(100) DEFAULT 'website_footer'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at timestamp with time zone
);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletter_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletter_subscribers_id_seq OWNED BY public.newsletter_subscribers.id;


--
-- Name: referral_redemptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referral_redemptions (
    id bigint NOT NULL,
    referrer_user_id uuid NOT NULL,
    referred_user_id uuid NOT NULL,
    referral_code text NOT NULL,
    reward_points integer DEFAULT 10 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT referral_redemptions_self_referral_check CHECK ((referrer_user_id <> referred_user_id))
);


--
-- Name: referral_redemptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.referral_redemptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referral_redemptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.referral_redemptions_id_seq OWNED BY public.referral_redemptions.id;


--
-- Name: reflections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reflections (
    id bigint NOT NULL,
    public_id text,
    user_id uuid NOT NULL,
    mood_rating integer,
    text text NOT NULL,
    tags jsonb DEFAULT '[]'::jsonb,
    session_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


--
-- Name: reflections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reflections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reflections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reflections_id_seq OWNED BY public.reflections.id;


--
-- Name: system_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_logs (
    id integer NOT NULL,
    level character varying(20) DEFAULT 'info'::character varying,
    category character varying(50) DEFAULT 'system'::character varying,
    message text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: system_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.system_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.system_logs_id_seq OWNED BY public.system_logs.id;


--
-- Name: user_login_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_login_events (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_login_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_login_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_login_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_login_events_id_seq OWNED BY public.user_login_events.id;


--
-- Name: user_otps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_otps (
    id bigint NOT NULL,
    email character varying(255) NOT NULL,
    otp character varying(6) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_otps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_otps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_otps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_otps_id_seq OWNED BY public.user_otps.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255),
    password text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    public_id uuid,
    notifications_enabled boolean DEFAULT true NOT NULL,
    email_updates boolean DEFAULT true NOT NULL,
    token_version integer DEFAULT 0 NOT NULL,
    referral_code text,
    referred_by_user_id uuid,
    referral_reward_points integer DEFAULT 0 NOT NULL,
    referral_invites_count integer DEFAULT 0 NOT NULL,
    onboarding_answers jsonb,
    onboarding_total_score integer,
    onboarding_risk_level text,
    onboarding_completed boolean DEFAULT false NOT NULL,
    onboarding_completed_at timestamp with time zone,
    is_anonymous boolean DEFAULT false,
    role character varying(20) DEFAULT 'student'::character varying
);


--
-- Name: journal_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_entries ALTER COLUMN id SET DEFAULT nextval('public.journal_entries_id_seq'::regclass);


--
-- Name: newsletter_broadcasts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_broadcasts ALTER COLUMN id SET DEFAULT nextval('public.newsletter_broadcasts_id_seq'::regclass);


--
-- Name: newsletter_subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers ALTER COLUMN id SET DEFAULT nextval('public.newsletter_subscribers_id_seq'::regclass);


--
-- Name: referral_redemptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_redemptions ALTER COLUMN id SET DEFAULT nextval('public.referral_redemptions_id_seq'::regclass);


--
-- Name: reflections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflections ALTER COLUMN id SET DEFAULT nextval('public.reflections_id_seq'::regclass);


--
-- Name: system_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_logs ALTER COLUMN id SET DEFAULT nextval('public.system_logs_id_seq'::regclass);


--
-- Name: user_login_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_login_events ALTER COLUMN id SET DEFAULT nextval('public.user_login_events_id_seq'::regclass);


--
-- Name: user_otps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_otps ALTER COLUMN id SET DEFAULT nextval('public.user_otps_id_seq'::regclass);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: chat_sessions chat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_pkey PRIMARY KEY (id);


--
-- Name: daily_assessments daily_assessments_one_per_day; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_assessments
    ADD CONSTRAINT daily_assessments_one_per_day UNIQUE (user_id, assessment_date);


--
-- Name: daily_assessments daily_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_assessments
    ADD CONSTRAINT daily_assessments_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_public_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_public_id_key UNIQUE (public_id);


--
-- Name: newsletter_broadcasts newsletter_broadcasts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_broadcasts
    ADD CONSTRAINT newsletter_broadcasts_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: referral_redemptions referral_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_redemptions
    ADD CONSTRAINT referral_redemptions_pkey PRIMARY KEY (id);


--
-- Name: referral_redemptions referral_redemptions_unique_referred_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_redemptions
    ADD CONSTRAINT referral_redemptions_unique_referred_user UNIQUE (referred_user_id);


--
-- Name: reflections reflections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflections
    ADD CONSTRAINT reflections_pkey PRIMARY KEY (id);


--
-- Name: reflections reflections_public_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflections
    ADD CONSTRAINT reflections_public_id_key UNIQUE (public_id);


--
-- Name: system_logs system_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_pkey PRIMARY KEY (id);


--
-- Name: user_login_events user_login_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_login_events
    ADD CONSTRAINT user_login_events_pkey PRIMARY KEY (id);


--
-- Name: user_otps user_otps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_otps
    ADD CONSTRAINT user_otps_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_chat_messages_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_created_at ON public.chat_messages USING btree (created_at);


--
-- Name: idx_chat_messages_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_session_id ON public.chat_messages USING btree (session_id);


--
-- Name: idx_chat_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions USING btree (user_id);


--
-- Name: idx_daily_assessments_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_daily_assessments_user_date ON public.daily_assessments USING btree (user_id, assessment_date DESC);


--
-- Name: idx_journal_entries_public_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_journal_entries_public_id ON public.journal_entries USING btree (public_id);


--
-- Name: idx_journal_entries_user_id_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_journal_entries_user_id_created_at ON public.journal_entries USING btree (user_id, created_at DESC);


--
-- Name: idx_referral_redemptions_referral_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_referral_redemptions_referral_code ON public.referral_redemptions USING btree (referral_code);


--
-- Name: idx_referral_redemptions_referrer_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_referral_redemptions_referrer_user_id ON public.referral_redemptions USING btree (referrer_user_id, created_at DESC);


--
-- Name: idx_users_onboarding_completed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_onboarding_completed ON public.users USING btree (onboarding_completed);


--
-- Name: users_email_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_unique_idx ON public.users USING btree (lower((email)::text));


--
-- Name: users_public_id_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_public_id_unique_idx ON public.users USING btree (public_id) WHERE (public_id IS NOT NULL);


--
-- Name: users_referral_code_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_referral_code_unique_idx ON public.users USING btree (referral_code);


--
-- Name: daily_assessments trg_update_daily_assessments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_daily_assessments_updated_at BEFORE UPDATE ON public.daily_assessments FOR EACH ROW EXECUTE FUNCTION public.update_daily_assessments_updated_at();


--
-- Name: journal_entries trg_update_journal_entries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_journal_entries_updated_at();


--
-- Name: chat_messages chat_messages_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.chat_sessions(id) ON DELETE CASCADE;


--
-- Name: chat_sessions chat_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: daily_assessments daily_assessments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_assessments
    ADD CONSTRAINT daily_assessments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: journal_entries journal_entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: referral_redemptions referral_redemptions_referred_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_redemptions
    ADD CONSTRAINT referral_redemptions_referred_user_id_fkey FOREIGN KEY (referred_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: referral_redemptions referral_redemptions_referrer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_redemptions
    ADD CONSTRAINT referral_redemptions_referrer_user_id_fkey FOREIGN KEY (referrer_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reflections reflections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflections
    ADD CONSTRAINT reflections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_login_events user_login_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_login_events
    ADD CONSTRAINT user_login_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_referred_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referred_by_user_id_fkey FOREIGN KEY (referred_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--


