
--
-- TOC entry 211 (class 1259 OID 74930)
-- Name: positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.positions (
    pos_id uuid NOT NULL,
    unit_name character varying(100) NOT NULL,
    subunit_name character varying(100),
    pos_code character varying(12),
    pos_name character varying(100),
    pos_pronum character varying(5),
    pos_mark character varying(200),
    pos_king character varying(10),
    nco_id uuid,
    time_select timestamp without time zone
);


ALTER TABLE public.positions OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 74918)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    nco_id uuid NOT NULL,
    nco_class character varying(50),
    nco_number character varying(4),
    nco_rank character varying(5),
    first_name character varying(50),
    last_name character varying(50),
    nco_id10 character varying(10),
    nco_id13 character varying(13),
    nco_mark character varying(200),
    nco_king character varying(50)
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 74901)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid NOT NULL,
    username character varying(50),
    password character varying(100),
    fullname character varying(100),
    role character varying(20)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3321 (class 0 OID 74930)
-- Dependencies: 211
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440001', 'พล. ๑ รอ.', 'ร้อย.บก.พล.๑ รอ.', '๕๐๓๐๐๐๓๙๔', 'หน.ชุด', '๑๑๑', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440002', 'พล. ๑ รอ.', 'ร้อย.บก.พล.๑ รอ.', '๕๐๓๐๐๐๓๙๕', 'เสมียน', '๕๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440010', 'พล. ๑ รอ.', 'ร้อย.๓ พล.๑ รอ.', '๕๐๓๐๐๔๐๓', 'พลขับ', '๑๓๕', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440011', 'พล. ๑ รอ.', 'ร้อย.๓ พล.๑ รอ.', '๕๐๓๐๐๔๐๔', 'พลประจำรถ', '๒๐๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440012', 'พล. ๑ รอ.', 'ร้อย.สนับสนุน', '๕๐๓๐๐๔๐๕', 'เสมียน', '๔๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440014', 'พล. ๑ รอ.', 'ร้อย.สนับสนุน', '๕๐๓๐๐๔๐๗', 'พลวิทยุ', '๗๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440015', 'พล. ๑ รอ.', 'ร้อย.๔ พล.๑ รอ.', '๕๐๓๐๐๔๐๘', 'พลขับ', '๑๐๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440016', 'พล. ๑ รอ.', 'ร้อย.๔ พล.๑ รอ.', '๕๐๓๐๐๔๐๙', 'หน.ชุด', '๘๕', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440018', 'พล. ๑ รอ.', 'ร้อย.๕ พล.๑ รอ.', '๕๐๓๐๐๔๑๑', 'เสมียน', '๕๕', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440019', 'พล. ๑ รอ.', 'ร้อย.๕ พล.๑ รอ.', '๕๐๓๐๐๔๑๒', 'พลขับ', '๑๒๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440020', 'พล. ๑ รอ.', 'ร้อย.๕ พล.๑ รอ.', '๕๐๓๐๐๔๑๓', 'พลวิทยุ', '๗๕', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440021', 'พล. ๑ รอ.', 'ร้อย.๖ พล.๑ รอ.', '๕๐๓๐๐๔๑๔', 'หน.ชุด', '๙๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440022', 'พล. ๑ รอ.', 'ร้อย.๖ พล.๑ รอ.', '๕๐๓๐๐๔๑๕', 'พลประจำรถ', '๑๘๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440023', 'พล. ๑ รอ.', 'ร้อย.๖ พล.๑ รอ.', '๕๐๓๐๐๔๑๖', 'พลขับ', '๑๒๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440024', 'พล. ๑ รอ.', 'ร้อย.๗ พล.๑ รอ.', '๕๐๓๐๐๔๑๗', 'เสมียน', '๖๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440025', 'พล. ๑ รอ.', 'ร้อย.๗ พล.๑ รอ.', '๕๐๓๐๐๔๑๘', 'หน.ชุด', '๑๐๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440026', 'พล. ๑ รอ.', 'ร้อย.๗ พล.๑ รอ.', '๕๐๓๐๐๔๑๙', 'พลวิทยุ', '๘๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440027', 'พล. ๑ รอ.', 'ร้อย.๘ พล.๑ รอ.', '๕๐๓๐๐๔๒๐', 'พลขับ', '๑๕๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440028', 'พล. ๑ รอ.', 'ร้อย.๘ พล.๑ รอ.', '๕๐๓๐๐๔๒๑', 'พลประจำรถ', '๒๐๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440029', 'พล. ๑ รอ.', 'ร้อย.๘ พล.๑ รอ.', '๕๐๓๐๐๔๒๒', 'เสมียน', '๕๕', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440013', 'พล. ๑ รอ.', 'ร้อย.สนับสนุน', '๕๐๓๐๐๔๐๖', 'หน.ชุด', '๖๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440003', 'พล. ๑ รอ.', 'ร้อย.๑ พล.๑ รอ.', '๕๐๓๐๐๐๓๙๖', 'พลขับ', '๑๕๐', NULL, NULL, '350f6ab0-8c66-41cd-83f3-f1d3deb51fbc', '2025-10-05 16:43:06.342');
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440005', 'พล. ๑ รอ.', 'ร้อย.๑ พล.๑ รอ.', '๕๐๓๐๐๐๓๙๘', 'พลประจำรถ', '๒๕๐', NULL, NULL, 'a1b2c3d4-1111-2222-3333-444455556666', '2025-10-05 16:43:44.476');
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440007', 'พล. ๑ รอ.', 'ร้อย.๒ พล.๑ รอ.', '๕๐๓๐๐๐๔๐๐', 'พลขับ', '๑๒๐', NULL, NULL, 'c3d4e5f6-3333-4444-5555-666677778888', '2025-10-05 16:44:30.932');
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440004', 'พล. ๑ รอ.', 'ร้อย.๑ พล.๑ รอ.', '๕๐๓๐๐๐๓๙๗', 'พลวิทยุ', '๘๐', NULL, NULL, 'd4e5f6a7-4444-5555-6666-777788889999', '2025-10-05 16:44:43.206');
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440006', 'พล. ๑ รอ.', 'ร้อย.๒ พล.๑ รอ.', '๕๐๓๐๐๐๓๙๙', 'หน.ชุด', '๙๐', NULL, NULL, 'c9d0e1f2-9999-0000-1111-222233334444', '2025-10-06 07:43:54.859');
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440030', 'พล. ๒ รอ.', 'ร้อย.สนับสนุน', '๕๐๓๐๐๔๒๓', 'หน.ชุด', '๖๕', NULL, NULL, 'f6a7b8c9-6666-7777-8888-999900001111', '2025-10-05 17:28:24.741');
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440017', 'พล. ๑ รอ.', 'ร้อย.๔ พล.๑ รอ.', '๕๐๓๐๐๔๑๐', 'พลประจำรถ', '๑๕๐', NULL, NULL, NULL, NULL);
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440008', 'พล. ๑ รอ.', 'ร้อย.๒ พล.๑ รอ.', '๕๐๓๐๐๔๐๑', 'เสมียน', '๗๕', NULL, NULL, 'e1f2a3b4-1111-2222-3333-444455556667', '2025-10-06 07:40:06.266');
INSERT INTO public.positions (pos_id, unit_name, subunit_name, pos_code, pos_name, pos_pronum, pos_mark, pos_king, nco_id, time_select) VALUES ('550e8400-e29b-41d4-a716-446655440009', 'พล. ๑ รอ.', 'ร้อย.๓ พล.๑ รอ.', '๕๐๓๐๐๔๐๒', 'พลวิทยุ', '๖๐', NULL, NULL, NULL, NULL);


--
-- TOC entry 3320 (class 0 OID 74918)
-- Dependencies: 210
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('350f6ab0-8c66-41cd-83f3-f1d3deb51fbc', 'ร้อย.นนส.ที่ 1', '75', 'นนส.', 'จักรกริช', 'กงพูล', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('a1b2c3d4-1111-2222-3333-444455556666', 'ร้อย.นนส.ที่ 1', '76', 'นนส.', 'สมชาย', 'ใจดี', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('b2c3d4e5-2222-3333-4444-555566667777', 'ร้อย.นนส.ที่ 1', '77', 'นนส.', 'วชิรพล', 'สวัสดิ์', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('c3d4e5f6-3333-4444-5555-666677778888', 'ร้อย.นนส.ที่ 1', '78', 'นนส.', 'ธนพล', 'ศรีทอง', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('d4e5f6a7-4444-5555-6666-777788889999', 'ร้อย.นนส.ที่ 1', '79', 'นนส.', 'จิรภัทร์', 'บุญช่วย', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('e5f6a7b8-5555-6666-7777-888899990000', 'ร้อย.นนส.ที่ 1', '80', 'นนส.', 'ปกรณ์', 'บุญมา', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('f6a7b8c9-6666-7777-8888-999900001111', 'ร้อย.นนส.ที่ 1', '81', 'นนส.', 'ณัฐพล', 'เกษมสุข', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('a7b8c9d0-7777-8888-9999-000011112222', 'ร้อย.นนส.ที่ 1', '82', 'นนส.', 'วีรพจน์', 'รัตนมงคล', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('b8c9d0e1-8888-9999-0000-111122223333', 'ร้อย.นนส.ที่ 1', '83', 'นนส.', 'ชัชวาล', 'ทองแท้', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('c9d0e1f2-9999-0000-1111-222233334444', 'ร้อย.นนส.ที่ 1', '84', 'นนส.', 'อัครพล', 'แก้วมณี', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('d0e1f2a3-0000-1111-2222-333344445555', 'ร้อย.นนส.ที่ 1', '85', 'นนส.', 'ภานุพงศ์', 'รุ่งโรจน์', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('e1f2a3b4-1111-2222-3333-444455556667', 'ร้อย.นนส.ที่ 1', '86', 'นนส.', 'กิตติพงษ์', 'จันทร์ประเสริฐ', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('f2a3b4c5-2222-3333-4444-555566667778', 'ร้อย.นนส.ที่ 1', '87', 'นนส.', 'ธีรพล', 'วงศ์วาน', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('a3b4c5d6-3333-4444-5555-666677778889', 'ร้อย.นนส.ที่ 1', '88', 'นนส.', 'ฤทธิ์พล', 'ปิติวงศ์', NULL, NULL, NULL, NULL);
INSERT INTO public.students (nco_id, nco_class, nco_number, nco_rank, first_name, last_name, nco_id10, nco_id13, nco_mark, nco_king) VALUES ('b4c5d6e7-4444-5555-6666-777788889990', 'ร้อย.นนส.ที่ 1', '89', 'นนส.', 'สราวุธ', 'ประเสริฐชัย', NULL, NULL, NULL, NULL);


--
-- TOC entry 3319 (class 0 OID 74901)
-- Dependencies: 209
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3178 (class 2606 OID 74936)
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (pos_id);


--
-- TOC entry 3176 (class 2606 OID 74922)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (nco_id);


--
-- TOC entry 3172 (class 2606 OID 74905)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3174 (class 2606 OID 74907)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3179 (class 2606 OID 74937)
-- Name: positions ref_student_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT ref_student_id FOREIGN KEY (nco_id) REFERENCES public.students(nco_id) NOT VALID;


-- Completed on 2025-10-07 01:19:11

--
-- PostgreSQL database dump complete
--

