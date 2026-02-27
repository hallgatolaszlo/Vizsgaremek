--
-- PostgreSQL database dump
--

\restrict 8F8UuwnnUsqeNDJkCIHi6m1GdU54ONdRdMiCXA6hagkxNB2oTIDN1p3YrFjKwzd

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-02-27 12:10:26

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16737)
-- Name: CalendarEntries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CalendarEntries" (
    "Id" uuid NOT NULL,
    "EntryCategory" integer NOT NULL,
    "Name" character varying(32) NOT NULL,
    "Description" character varying(1024),
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone DEFAULT '-infinity'::timestamp with time zone NOT NULL,
    "Location" text,
    "NotificationTime" timestamp with time zone,
    "Color" integer,
    "IsCompleted" boolean,
    "CalendarId" uuid NOT NULL,
    "CreatedBy" uuid NOT NULL,
    "IsAllDay" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."CalendarEntries" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16698)
-- Name: Calendars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Calendars" (
    "Id" uuid NOT NULL,
    "Name" character varying(32) NOT NULL,
    "Color" integer DEFAULT 1 NOT NULL,
    "ProfileId" uuid NOT NULL
);


ALTER TABLE public."Calendars" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16780)
-- Name: EventContributors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EventContributors" (
    "ProfileId" uuid NOT NULL,
    "CalendarEntryId" uuid NOT NULL,
    "Status" integer NOT NULL
);


ALTER TABLE public."EventContributors" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16709)
-- Name: Friends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Friends" (
    "User1ProfileId" uuid NOT NULL,
    "User2ProfileId" uuid NOT NULL,
    "Status" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone
);


ALTER TABLE public."Friends" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16770)
-- Name: HabitLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HabitLogs" (
    "Id" uuid NOT NULL,
    "Date" timestamp with time zone NOT NULL,
    "Value" real,
    "IsCompleted" boolean,
    "HabitId" uuid NOT NULL
);


ALTER TABLE public."HabitLogs" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16724)
-- Name: Habits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Habits" (
    "Id" uuid NOT NULL,
    "Name" character varying(64) NOT NULL,
    "Description" character varying(1024),
    "HabitCategory" integer NOT NULL,
    "Unit" integer NOT NULL,
    "Goal" real,
    "Color" integer NOT NULL,
    "Days" integer,
    "ProfileId" uuid NOT NULL
);


ALTER TABLE public."Habits" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16685)
-- Name: Profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Profiles" (
    "Id" uuid NOT NULL,
    "Username" character varying(64) NOT NULL,
    "Avatar" text NOT NULL,
    "IsPrivate" boolean DEFAULT true NOT NULL,
    "FirstName" character varying(128),
    "LastName" character varying(128),
    "BirthDate" date,
    "UserId" uuid NOT NULL
);


ALTER TABLE public."Profiles" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16755)
-- Name: SharedCalendars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SharedCalendars" (
    "ProfileId" uuid NOT NULL,
    "CalendarId" uuid NOT NULL,
    "Role" integer NOT NULL
);


ALTER TABLE public."SharedCalendars" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16678)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    "Id" uuid NOT NULL,
    "Email" text NOT NULL,
    "PasswordHash" text NOT NULL,
    "RefreshToken" text,
    "RefreshTokenExpiryTime" timestamp with time zone,
    "CreatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16673)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 16737)
-- Dependencies: 223
-- Data for Name: CalendarEntries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CalendarEntries" ("Id", "EntryCategory", "Name", "Description", "StartDate", "EndDate", "Location", "NotificationTime", "Color", "IsCompleted", "CalendarId", "CreatedBy", "IsAllDay") FROM stdin;
dff795bb-b3b4-45dd-8316-5665b324f7ec	0	alma	\N	2026-01-23 09:42:38.593+01	-infinity	\N	\N	1	\N	d95faf01-e1e5-4c5a-b7e1-c68a5f930b3f	f7f37951-e0c2-474c-ba29-7cdbdced9503	f
3d9a4917-0945-4ecb-87e7-3987fb4ba24b	0	string	string	2027-01-28 09:59:20.865+01	2027-01-28 09:59:20.865+01	\N	\N	1	\N	d95faf01-e1e5-4c5a-b7e1-c68a5f930b3f	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
b2783678-84ac-48d3-98dd-dae94d49d758	0	string	string	2027-01-28 09:59:20.865+01	2027-01-28 09:59:20.865+01	\N	\N	1	\N	ab4bab5d-10eb-4a06-b3b8-278fd42c5ee4	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
2a9e5acb-e307-44bb-a615-05ef092df13b	0	string	string	2027-01-28 09:59:20.865+01	2027-01-28 09:59:20.865+01	\N	\N	1	\N	0ea29a61-b9ab-4319-beb5-b65db83d2682	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
053a3fd9-9680-4768-a064-1c6aae2e42e3	0	string	string	2026-01-28 11:21:07.295+01	2026-01-28 11:21:07.295+01	string	2026-01-28 11:21:07.295+01	7	\N	8bb68ebb-d7e7-4822-9886-3384671026cc	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
2750c30f-e491-4ab0-a364-320f371c9c23	0	teeeeeeeeeeeest	string	2026-01-28 11:21:07.295+01	2026-01-28 11:21:07.295+01	string	2026-01-28 11:21:07.295+01	7	\N	8bb68ebb-d7e7-4822-9886-3384671026cc	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
357a7ed4-740a-47c9-acc7-8cafd1ca176a	0	colorrr	string	2026-01-28 11:21:07.295+01	2026-01-28 11:21:07.295+01	string	2026-01-28 11:21:07.295+01	7	\N	8bb68ebb-d7e7-4822-9886-3384671026cc	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
861c17ce-02ff-4b6f-b900-8c4f5709ba61	0	colorrr	string	2026-01-28 11:21:07.295+01	2026-01-28 11:21:07.295+01	string	2026-01-28 11:21:07.295+01	1	\N	d95faf01-e1e5-4c5a-b7e1-c68a5f930b3f	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
90a32e29-e40e-497e-b5b5-ceeabb3c1b24	0	string	string	2026-01-29 11:48:58.442+01	2026-01-29 11:48:58.442+01	string	2026-01-29 11:48:58.442+01	\N	\N	2f89af16-8edd-4b33-84f4-094ea274a09c	952f7a4e-758b-4157-835e-a37b9e466507	t
0fad1a1e-bf36-4f31-b4ea-06a1468d1c5b	0	string	string	2026-01-29 11:48:58.442+01	2026-01-29 11:48:58.442+01	string	2026-01-29 11:48:58.442+01	\N	\N	2f89af16-8edd-4b33-84f4-094ea274a09c	952f7a4e-758b-4157-835e-a37b9e466507	t
343781f8-2e62-43d8-9052-f76dc36904ae	0	string	string	2026-01-29 11:53:16.041+01	2026-01-29 11:53:16.041+01	string	2026-01-29 11:53:16.041+01	\N	\N	2f89af16-8edd-4b33-84f4-094ea274a09c	952f7a4e-758b-4157-835e-a37b9e466507	t
e452bf30-7de5-4852-aab3-15e8f715b0b3	0	string	string	2026-01-29 11:53:16.041+01	2026-01-29 11:53:16.041+01	string	2026-01-29 11:53:16.041+01	\N	\N	2f89af16-8edd-4b33-84f4-094ea274a09c	952f7a4e-758b-4157-835e-a37b9e466507	t
85c6b139-186c-4e36-bdc4-fe97350254de	0	string	string	2026-01-29 11:53:16.041+01	2026-01-29 11:53:16.041+01	string	2026-01-29 11:53:16.041+01	\N	\N	2a2ff72e-e61d-4403-bed8-8ee184ace835	952f7a4e-758b-4157-835e-a37b9e466507	t
af468208-c967-458f-9770-3db7a495ff4a	0	string	string	2026-01-29 11:53:16.041+01	2026-01-29 11:53:16.041+01	string	2026-01-29 11:53:16.041+01	3	\N	2a2ff72e-e61d-4403-bed8-8ee184ace835	952f7a4e-758b-4157-835e-a37b9e466507	t
5c6f6f8c-7a1e-46d5-abd8-6bb15f99cd76	0	string	string	2026-01-29 12:57:27.188+01	2026-01-29 12:57:27.188+01	string	2026-01-29 12:57:27.188+01	\N	\N	91b8428b-978f-413c-bb1a-18fea0d2f5ef	d248a3fd-14de-4ab1-a085-25685dfad703	t
b0eab9cf-f00a-48c7-bccc-314b6e3a771c	0	dsadas	gvdfgr	2025-11-05 00:00:00+01	2025-11-05 00:00:00+01	\N	\N	3	\N	f10259ee-7b66-4f0f-b18d-0d93f63ddc58	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
dc61e542-6e7d-4d0c-a08e-06f0bfa0e221	0	dfs		2026-01-28 11:00:00+01	2026-01-29 12:00:00+01	\N	\N	1	\N	0ea29a61-b9ab-4319-beb5-b65db83d2682	f7f37951-e0c2-474c-ba29-7cdbdced9503	f
9a41f644-3f01-4c38-8c14-63e8e2f137ed	2	ads	das	2026-01-01 11:00:00+01	2026-01-01 12:00:00+01	\N	\N	4	\N	0ea29a61-b9ab-4319-beb5-b65db83d2682	f7f37951-e0c2-474c-ba29-7cdbdced9503	f
6d810062-5110-48df-bfe9-cce36a039371	2	asd	asd	2026-01-08 11:00:00+01	2026-01-28 12:00:00+01	\N	\N	6	\N	8bb68ebb-d7e7-4822-9886-3384671026cc	f7f37951-e0c2-474c-ba29-7cdbdced9503	f
d20d5d8c-9e18-43ab-b282-ded5f8191f75	2	facebook		2026-01-14 08:00:00+01	2026-01-15 09:00:00+01	\N	\N	\N	\N	0ea29a61-b9ab-4319-beb5-b65db83d2682	f7f37951-e0c2-474c-ba29-7cdbdced9503	f
86cc47f4-2c58-40f6-96e0-1d0d34af9222	2	ads		2026-01-15 00:00:00+01	2026-01-15 23:59:59.999+01	\N	\N	\N	\N	0ea29a61-b9ab-4319-beb5-b65db83d2682	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
1aa8b610-d0ce-49fb-971a-152d49b185ee	0	asd		2026-01-28 00:00:00+01	2026-01-28 23:59:59.999+01	\N	\N	\N	\N	0ea29a61-b9ab-4319-beb5-b65db83d2682	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
426dd749-9ba9-463f-9ce4-7b5db4e48295	3	dsadsa	dsadas	2026-01-04 11:00:00+01	2026-01-04 12:00:00+01	\N	\N	10	\N	8bb68ebb-d7e7-4822-9886-3384671026cc	f7f37951-e0c2-474c-ba29-7cdbdced9503	f
7339b4a5-a2a5-489f-9a66-e624aaa3332e	0	dsa		2026-01-28 00:00:00+01	2026-01-28 23:59:59.999+01	\N	\N	\N	\N	0ea29a61-b9ab-4319-beb5-b65db83d2682	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
1b2e0bdf-9595-44b9-b627-a27ad2f3b96d	0	asd		2026-02-04 00:00:00+01	2026-02-04 23:59:59.999+01	\N	\N	12	\N	8bb68ebb-d7e7-4822-9886-3384671026cc	f7f37951-e0c2-474c-ba29-7cdbdced9503	t
c3a8612f-8403-4e71-bc8c-7b476230e416	0	very long name to test whether i		2026-02-18 00:00:00+01	2026-02-18 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
3fcfa042-0499-4fc2-a13a-2c91fda39735	0	asd	fdgsdfgbbv bbdfbdfbdgfgr	2026-02-11 00:00:00+01	2026-02-11 23:59:59.999+01	\N	\N	4	\N	91b8428b-978f-413c-bb1a-18fea0d2f5ef	7633f8f5-8cc3-4695-9708-f944f60b3139	t
e662f19c-0f8a-49c5-912b-6dc3af5190d8	0	fasdg		2026-02-11 00:00:00+01	2026-02-11 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
07e0de35-7782-433d-8c61-61862ef040e7	0	fdafdagfd		2026-02-11 00:00:00+01	2026-02-11 23:59:59.999+01	\N	\N	4	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
1ee0ad00-221b-402e-bc3c-316e48526c8a	0	dsa		2026-02-11 00:00:00+01	2026-02-11 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
6e8bab36-f837-4889-8bfc-5253648f56e3	0	DASFD	bvddfasdc	2026-02-07 00:00:00+01	2026-02-07 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
a0110cb6-62d0-429c-9780-ebf7cbb4dc41	1	whatt		2026-02-17 12:00:00+01	2026-02-17 13:00:00+01	\N	\N	\N	\N	91b8428b-978f-413c-bb1a-18fea0d2f5ef	7633f8f5-8cc3-4695-9708-f944f60b3139	f
b4646d42-ccdd-44f6-971c-74351e6c9890	2	NotAllDay		2026-02-13 09:00:00+01	2026-02-13 19:00:00+01	\N	\N	\N	\N	91b8428b-978f-413c-bb1a-18fea0d2f5ef	7633f8f5-8cc3-4695-9708-f944f60b3139	f
4e3873db-8bb7-4a07-84cf-6555da1c6837	0	dfsafads		2026-02-11 00:00:00+01	2026-02-11 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
123506a5-8be7-403e-8a5d-119875edb58e	4	vjfdads	fdsdfassa	2026-02-12 00:00:00+01	2026-02-12 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
9d3e4439-1adf-4252-ab67-63c4749d5f20	0	dsa		2026-02-11 00:00:00+01	2026-02-11 23:59:59.999+01	\N	\N	7	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
4b4aa19e-f5c3-434f-b3a4-eb8ab8e6c981	3	Alza PONT HÚÚÚÚÚÚ	what is your opinion	2026-02-05 00:00:00+01	2026-02-05 23:59:59.999+01	\N	\N	7	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
8aab6444-66dd-4217-a708-29b6688a20e5	0	dsa		2026-02-13 00:00:00+01	2026-02-13 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
a4f33d04-f644-4a8e-834e-0e096419999d	0	asd		2026-02-13 00:00:00+01	2026-02-13 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
616f66e6-d795-4a6d-ba34-e889c47c90cf	0	fasa		2026-02-13 00:00:00+01	2026-02-13 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
35382124-2b33-493c-b23b-cef37fa51f09	0	hgdfd		2026-02-13 00:00:00+01	2026-02-13 23:59:59.999+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
b396c005-931b-4f28-8984-eb630f542d84	0	asd		2026-02-12 12:00:00+01	2026-02-12 13:00:00+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	f
31bc10e5-996c-4436-ae39-d13dbbf151ec	0	ASd		2026-02-17 12:00:00+01	2026-02-17 13:00:00+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	f
7925498c-e393-45da-b921-a2e013a88dc4	0	dsadas		2026-02-16 12:20:00+01	2026-02-16 15:20:00+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	f
e0c01627-bff3-48b0-b04a-4487bfe397ae	2	faddfsa		2026-02-16 11:00:00+01	2026-02-16 17:00:00+01	\N	\N	\N	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	f
0d7554e6-d557-4de5-bf6a-f5d04101c715	3	vgvuvziuoo		2026-02-16 12:03:00+01	2026-02-16 13:03:00+01	\N	\N	\N	\N	91b8428b-978f-413c-bb1a-18fea0d2f5ef	7633f8f5-8cc3-4695-9708-f944f60b3139	f
7bf9249c-aef7-4a73-89e9-7ba098edf963	0	nniniopopn		2026-02-16 00:00:00+01	2026-02-16 23:59:59.999+01	\N	\N	8	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
dbceae29-b763-4051-8ea5-6f33b019122f	0	bivzxdtíwrruzhuo		2026-02-16 00:00:00+01	2026-02-16 23:59:59.999+01	\N	\N	4	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	t
cedd9f6f-1800-4a11-8a72-a5a3116217f9	0	casdfadfdssf		2026-02-16 13:00:00+01	2026-02-16 14:00:00+01	\N	\N	6	\N	5cb10c0a-4516-485b-852b-03dd33680b10	7633f8f5-8cc3-4695-9708-f944f60b3139	f
\.


--
-- TOC entry 4974 (class 0 OID 16698)
-- Dependencies: 220
-- Data for Name: Calendars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Calendars" ("Id", "Name", "Color", "ProfileId") FROM stdin;
d95faf01-e1e5-4c5a-b7e1-c68a5f930b3f	asd@asd.asd	1	f7f37951-e0c2-474c-ba29-7cdbdced9503
91b8428b-978f-413c-bb1a-18fea0d2f5ef	test@test.test	1	7633f8f5-8cc3-4695-9708-f944f60b3139
9d9e6112-7342-4a75-a066-d4f7d62beccb	test2@test.test	1	d248a3fd-14de-4ab1-a085-25685dfad703
ab4bab5d-10eb-4a06-b3b8-278fd42c5ee4	nemtom	1	f7f37951-e0c2-474c-ba29-7cdbdced9503
0ea29a61-b9ab-4319-beb5-b65db83d2682	nemtom	1	f7f37951-e0c2-474c-ba29-7cdbdced9503
eff4ec2a-0880-4b1b-8d8d-12b063aab828	tom@tom	1	45f5cd44-fece-4495-b26a-a687657488bb
9eb45349-ed30-44ba-bd99-921e2a585bea	test@-asd.asd	1	3b6d654c-26f3-4adb-a8f8-7e8f3f7aa241
f00ac403-ba47-4d75-8fa6-6230d662eff9	hallgatolaszlo@gmail.com	1	365d0e94-9288-472a-9645-0a26b4a29771
dcb3d195-af29-4f2f-9eea-f41d4f91675c	hallgatolaszlo@gmaiaaaaaal.com	1	92dbd5bd-308a-4c95-aaea-24c462be8b0c
8bb68ebb-d7e7-4822-9886-3384671026cc	colorteszt	7	f7f37951-e0c2-474c-ba29-7cdbdced9503
2f89af16-8edd-4b33-84f4-094ea274a09c	dsa@dsa.dsa	1	952f7a4e-758b-4157-835e-a37b9e466507
2a2ff72e-e61d-4403-bed8-8ee184ace835	teszt	7	952f7a4e-758b-4157-835e-a37b9e466507
f10259ee-7b66-4f0f-b18d-0d93f63ddc58	fdsad	6	f7f37951-e0c2-474c-ba29-7cdbdced9503
890a0c1e-8789-45fb-bfc3-508695321d83	ASD@asd.asd	1	6d367f61-1062-4bcc-9a36-4f09de60a44a
5cb10c0a-4516-485b-852b-03dd33680b10	asd	5	7633f8f5-8cc3-4695-9708-f944f60b3139
\.


--
-- TOC entry 4980 (class 0 OID 16780)
-- Dependencies: 226
-- Data for Name: EventContributors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EventContributors" ("ProfileId", "CalendarEntryId", "Status") FROM stdin;
\.


--
-- TOC entry 4975 (class 0 OID 16709)
-- Dependencies: 221
-- Data for Name: Friends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Friends" ("User1ProfileId", "User2ProfileId", "Status", "CreatedAt", "UpdatedAt") FROM stdin;
\.


--
-- TOC entry 4979 (class 0 OID 16770)
-- Dependencies: 225
-- Data for Name: HabitLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."HabitLogs" ("Id", "Date", "Value", "IsCompleted", "HabitId") FROM stdin;
\.


--
-- TOC entry 4976 (class 0 OID 16724)
-- Dependencies: 222
-- Data for Name: Habits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Habits" ("Id", "Name", "Description", "HabitCategory", "Unit", "Goal", "Color", "Days", "ProfileId") FROM stdin;
\.


--
-- TOC entry 4973 (class 0 OID 16685)
-- Dependencies: 219
-- Data for Name: Profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Profiles" ("Id", "Username", "Avatar", "IsPrivate", "FirstName", "LastName", "BirthDate", "UserId") FROM stdin;
f7f37951-e0c2-474c-ba29-7cdbdced9503	asd@asd.asd	placeholder	f	\N	\N	\N	f12f5199-fa52-4e61-be8e-c831d571fa8f
7633f8f5-8cc3-4695-9708-f944f60b3139	test@test.test	placeholder	f	\N	\N	\N	68a7c02d-3e81-4f5e-8747-6d8cb893898d
d248a3fd-14de-4ab1-a085-25685dfad703	test2@test.test	placeholder	f	\N	\N	\N	8f68b87f-770b-4577-b6ae-d487ce229487
45f5cd44-fece-4495-b26a-a687657488bb	string	string	t	string	string	\N	f1d67003-eaf7-44c6-b319-3526fac45f5e
3b6d654c-26f3-4adb-a8f8-7e8f3f7aa241	test@-asd.asd	placeholder	f	\N	\N	\N	3a5200cc-dc62-4ffe-8957-831532217a32
365d0e94-9288-472a-9645-0a26b4a29771	hallgatolaszlo	placeholder	f	\N	\N	\N	ddb123ba-b171-4121-9bad-6dce97e070e7
92dbd5bd-308a-4c95-aaea-24c462be8b0c	hallgatolaszloPuQN	placeholder	f	\N	\N	\N	0929969a-98d1-48f3-a96e-9a865ec9eea1
952f7a4e-758b-4157-835e-a37b9e466507	dsa	placeholder	f	\N	\N	\N	8f5d5253-d0af-48df-a885-b163a72a59d3
6d367f61-1062-4bcc-9a36-4f09de60a44a	ASD	placeholder	f	\N	\N	\N	48f783aa-a049-4961-863f-b18e635b9c1f
\.


--
-- TOC entry 4978 (class 0 OID 16755)
-- Dependencies: 224
-- Data for Name: SharedCalendars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SharedCalendars" ("ProfileId", "CalendarId", "Role") FROM stdin;
952f7a4e-758b-4157-835e-a37b9e466507	91b8428b-978f-413c-bb1a-18fea0d2f5ef	0
d248a3fd-14de-4ab1-a085-25685dfad703	91b8428b-978f-413c-bb1a-18fea0d2f5ef	1
\.


--
-- TOC entry 4972 (class 0 OID 16678)
-- Dependencies: 218
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" ("Id", "Email", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "CreatedAt") FROM stdin;
f12f5199-fa52-4e61-be8e-c831d571fa8f	asd@asd.asd	AQAAAAIAAYagAAAAECDPjTVuCGtrAqIxps8Pd0J2EupNeudGESwLGWBHAv2IVE81Vy4B4l+oaPSyaPUePw==	UwActZNTP58A1Kc2EahXw0Bhq5Sh0N9Tx6NZ7Y4w9RM=	2026-03-06 11:13:57.702951+01	2026-01-21 13:13:54.801715+01
f1d67003-eaf7-44c6-b319-3526fac45f5e	tom@tom	AQAAAAIAAYagAAAAENIdJXBo5ANzCm2j2Q3oMnExEee13L+ZbXyrUVm6MYI8Is1kkfJijPjjXwhlHq+43w==	W8jmlg5sqbjH7MoNXQTGBQD5z2NA6qfH2Igor+N7u2s=	2026-02-03 09:14:34.070827+01	2026-01-27 09:06:22.246476+01
3a5200cc-dc62-4ffe-8957-831532217a32	test@-asd.asd	AQAAAAIAAYagAAAAECEnpYPNIwHzOPf1ZzFbDLKfqMsx9NEcGSg0+rpI7axOiIMbU7f8709r6se8/B8YeA==	\N	\N	2026-01-27 12:11:03.286703+01
ddb123ba-b171-4121-9bad-6dce97e070e7	hallgatolaszlo@gmail.com	AQAAAAIAAYagAAAAEB+InL3tTVDdgLFIC/Bk8Ji8swRpdp+/3VxqVPxuK8Q001B8TpirVHR4iHavtDNfVQ==	\N	\N	2026-01-27 13:27:45.270411+01
0929969a-98d1-48f3-a96e-9a865ec9eea1	hallgatolaszlo@gmaiaaaaaal.com	AQAAAAIAAYagAAAAEDNuCJvm3YTwCwTm+0G3Vowpoy2Q0V0OcRnwkDCfFXkO0xfFZ13vEdnb8WZG92uSyA==	\N	\N	2026-01-27 13:32:10.005857+01
8f5d5253-d0af-48df-a885-b163a72a59d3	dsa@dsa.dsa	AQAAAAIAAYagAAAAEB0hEoR7p7voUChH1eWuhwFFCPpOGdNpVfczusUkaDLBKfFrqv4/ro7Bda6bJfJ2wg==	AgLEKJJgwERoP9lanJZ0t3BcNwB7Ni5dkNbNDIUjjsg=	2026-02-05 11:35:38.263361+01	2026-01-29 11:35:26.746895+01
8f68b87f-770b-4577-b6ae-d487ce229487	test2@test.test	AQAAAAIAAYagAAAAEBw8UOxVaVGHuDrXtDBD7vR8akzcW/mMtEdEulFRhPlMedSf7s9K9JRG67zuxz3Cvg==	4nQkkCM5xzgp4gsR4CeBLqA4ywjhXk/8GHlvqNwPQ1o=	2026-02-07 10:43:36.794479+01	2026-01-22 14:08:46.438731+01
48f783aa-a049-4961-863f-b18e635b9c1f	ASD@asd.asd	AQAAAAIAAYagAAAAEEE/DGjuSYFQ6PSIIBk8SykJk0k3PACHJr5J5+ei1PhNqDEXAbEAT1C7U0l/IUdMKA==	O7Hnu8tThv7QJb8WCbYb8td6vrn6J3fyPXyH0MJ6sq0=	2026-02-27 12:34:29.032697+01	2026-02-20 12:34:28.630853+01
68a7c02d-3e81-4f5e-8747-6d8cb893898d	test@test.test	AQAAAAIAAYagAAAAECCpozAgJFo0bfXE53pJx4LjzxdXS8sh+Va7M89Y26pC8ngUcMefGtGY4N8Xtbi5yw==	V0pIdcDHCDvQZfpfgQzzKVMz1YRCGEMoAU8zIe8GfoA=	2026-03-05 10:56:52.201019+01	2026-01-22 13:45:24.13699+01
\.


--
-- TOC entry 4971 (class 0 OID 16673)
-- Dependencies: 217
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20260115084622_Initial	8.0.22
20260123111429_MinorFixes	8.0.22
20260123112012_SecondMinorFixes	8.0.22
20260128081603_ThirdMinorFixes	8.0.22
20260129104052_NullableCalendarEntryColor	8.0.22
\.


--
-- TOC entry 4803 (class 2606 OID 16744)
-- Name: CalendarEntries PK_CalendarEntries; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CalendarEntries"
    ADD CONSTRAINT "PK_CalendarEntries" PRIMARY KEY ("Id");


--
-- TOC entry 4792 (class 2606 OID 16703)
-- Name: Calendars PK_Calendars; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Calendars"
    ADD CONSTRAINT "PK_Calendars" PRIMARY KEY ("Id");


--
-- TOC entry 4813 (class 2606 OID 16784)
-- Name: EventContributors PK_EventContributors; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventContributors"
    ADD CONSTRAINT "PK_EventContributors" PRIMARY KEY ("ProfileId", "CalendarEntryId");


--
-- TOC entry 4795 (class 2606 OID 16713)
-- Name: Friends PK_Friends; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "PK_Friends" PRIMARY KEY ("User1ProfileId", "User2ProfileId");


--
-- TOC entry 4810 (class 2606 OID 16774)
-- Name: HabitLogs PK_HabitLogs; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HabitLogs"
    ADD CONSTRAINT "PK_HabitLogs" PRIMARY KEY ("Id");


--
-- TOC entry 4798 (class 2606 OID 16731)
-- Name: Habits PK_Habits; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Habits"
    ADD CONSTRAINT "PK_Habits" PRIMARY KEY ("Id");


--
-- TOC entry 4789 (class 2606 OID 16692)
-- Name: Profiles PK_Profiles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "PK_Profiles" PRIMARY KEY ("Id");


--
-- TOC entry 4806 (class 2606 OID 16759)
-- Name: SharedCalendars PK_SharedCalendars; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SharedCalendars"
    ADD CONSTRAINT "PK_SharedCalendars" PRIMARY KEY ("ProfileId", "CalendarId");


--
-- TOC entry 4785 (class 2606 OID 16684)
-- Name: Users PK_Users; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_Users" PRIMARY KEY ("Id");


--
-- TOC entry 4782 (class 2606 OID 16677)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- TOC entry 4799 (class 1259 OID 16795)
-- Name: IX_CalendarEntries_CalendarId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_CalendarEntries_CalendarId" ON public."CalendarEntries" USING btree ("CalendarId");


--
-- TOC entry 4800 (class 1259 OID 16796)
-- Name: IX_CalendarEntries_CreatedBy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_CalendarEntries_CreatedBy" ON public."CalendarEntries" USING btree ("CreatedBy");


--
-- TOC entry 4801 (class 1259 OID 16797)
-- Name: IX_CalendarEntries_StartDate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_CalendarEntries_StartDate" ON public."CalendarEntries" USING btree ("StartDate");


--
-- TOC entry 4790 (class 1259 OID 16798)
-- Name: IX_Calendars_ProfileId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Calendars_ProfileId" ON public."Calendars" USING btree ("ProfileId");


--
-- TOC entry 4811 (class 1259 OID 16799)
-- Name: IX_EventContributors_CalendarEntryId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_EventContributors_CalendarEntryId" ON public."EventContributors" USING btree ("CalendarEntryId");


--
-- TOC entry 4793 (class 1259 OID 16800)
-- Name: IX_Friends_User2ProfileId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Friends_User2ProfileId" ON public."Friends" USING btree ("User2ProfileId");


--
-- TOC entry 4807 (class 1259 OID 16801)
-- Name: IX_HabitLogs_Date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_HabitLogs_Date" ON public."HabitLogs" USING btree ("Date");


--
-- TOC entry 4808 (class 1259 OID 16802)
-- Name: IX_HabitLogs_HabitId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_HabitLogs_HabitId" ON public."HabitLogs" USING btree ("HabitId");


--
-- TOC entry 4796 (class 1259 OID 16803)
-- Name: IX_Habits_ProfileId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Habits_ProfileId" ON public."Habits" USING btree ("ProfileId");


--
-- TOC entry 4786 (class 1259 OID 16804)
-- Name: IX_Profiles_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Profiles_UserId" ON public."Profiles" USING btree ("UserId");


--
-- TOC entry 4787 (class 1259 OID 16808)
-- Name: IX_Profiles_Username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_Profiles_Username" ON public."Profiles" USING btree ("Username");


--
-- TOC entry 4804 (class 1259 OID 16806)
-- Name: IX_SharedCalendars_CalendarId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_SharedCalendars_CalendarId" ON public."SharedCalendars" USING btree ("CalendarId");


--
-- TOC entry 4783 (class 1259 OID 16807)
-- Name: IX_Users_Email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_Users_Email" ON public."Users" USING btree ("Email");


--
-- TOC entry 4819 (class 2606 OID 16745)
-- Name: CalendarEntries FK_CalendarEntries_Calendars_CalendarId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CalendarEntries"
    ADD CONSTRAINT "FK_CalendarEntries_Calendars_CalendarId" FOREIGN KEY ("CalendarId") REFERENCES public."Calendars"("Id") ON DELETE CASCADE;


--
-- TOC entry 4820 (class 2606 OID 16750)
-- Name: CalendarEntries FK_CalendarEntries_Profiles_CreatedBy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CalendarEntries"
    ADD CONSTRAINT "FK_CalendarEntries_Profiles_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES public."Profiles"("Id") ON DELETE CASCADE;


--
-- TOC entry 4815 (class 2606 OID 16704)
-- Name: Calendars FK_Calendars_Profiles_ProfileId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Calendars"
    ADD CONSTRAINT "FK_Calendars_Profiles_ProfileId" FOREIGN KEY ("ProfileId") REFERENCES public."Profiles"("Id") ON DELETE CASCADE;


--
-- TOC entry 4824 (class 2606 OID 16785)
-- Name: EventContributors FK_EventContributors_CalendarEntries_CalendarEntryId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventContributors"
    ADD CONSTRAINT "FK_EventContributors_CalendarEntries_CalendarEntryId" FOREIGN KEY ("CalendarEntryId") REFERENCES public."CalendarEntries"("Id") ON DELETE CASCADE;


--
-- TOC entry 4825 (class 2606 OID 16790)
-- Name: EventContributors FK_EventContributors_Profiles_ProfileId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventContributors"
    ADD CONSTRAINT "FK_EventContributors_Profiles_ProfileId" FOREIGN KEY ("ProfileId") REFERENCES public."Profiles"("Id") ON DELETE CASCADE;


--
-- TOC entry 4816 (class 2606 OID 16714)
-- Name: Friends FK_Friends_Profiles_User1ProfileId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "FK_Friends_Profiles_User1ProfileId" FOREIGN KEY ("User1ProfileId") REFERENCES public."Profiles"("Id") ON DELETE RESTRICT;


--
-- TOC entry 4817 (class 2606 OID 16719)
-- Name: Friends FK_Friends_Profiles_User2ProfileId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "FK_Friends_Profiles_User2ProfileId" FOREIGN KEY ("User2ProfileId") REFERENCES public."Profiles"("Id") ON DELETE RESTRICT;


--
-- TOC entry 4823 (class 2606 OID 16775)
-- Name: HabitLogs FK_HabitLogs_Habits_HabitId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HabitLogs"
    ADD CONSTRAINT "FK_HabitLogs_Habits_HabitId" FOREIGN KEY ("HabitId") REFERENCES public."Habits"("Id") ON DELETE CASCADE;


--
-- TOC entry 4818 (class 2606 OID 16732)
-- Name: Habits FK_Habits_Profiles_ProfileId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Habits"
    ADD CONSTRAINT "FK_Habits_Profiles_ProfileId" FOREIGN KEY ("ProfileId") REFERENCES public."Profiles"("Id") ON DELETE CASCADE;


--
-- TOC entry 4814 (class 2606 OID 16693)
-- Name: Profiles FK_Profiles_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "FK_Profiles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 4821 (class 2606 OID 16760)
-- Name: SharedCalendars FK_SharedCalendars_Calendars_CalendarId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SharedCalendars"
    ADD CONSTRAINT "FK_SharedCalendars_Calendars_CalendarId" FOREIGN KEY ("CalendarId") REFERENCES public."Calendars"("Id") ON DELETE CASCADE;


--
-- TOC entry 4822 (class 2606 OID 16765)
-- Name: SharedCalendars FK_SharedCalendars_Profiles_ProfileId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SharedCalendars"
    ADD CONSTRAINT "FK_SharedCalendars_Profiles_ProfileId" FOREIGN KEY ("ProfileId") REFERENCES public."Profiles"("Id") ON DELETE CASCADE;


-- Completed on 2026-02-27 12:10:26

--
-- PostgreSQL database dump complete
--

\unrestrict 8F8UuwnnUsqeNDJkCIHi6m1GdU54ONdRdMiCXA6hagkxNB2oTIDN1p3YrFjKwzd

