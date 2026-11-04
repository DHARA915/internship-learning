-- INSERT SAMPLE DATA 

-- DOCTORS ------------------------------------------------------------------------------------------------------------------------
INSERT INTO DOCTORS
(name, specialization, phone, experience_years, status)
VALUES
('Dr. Aarav Shah', 'Cardiology', '9876500001', 12, 'ACTIVE'),
('Dr. Priya Patel', 'Cardiology', '9876500002', 8, 'ACTIVE'),

('Dr. Rahul Mehta', 'Dermatology', '9876500003', 10, 'ACTIVE'),
('Dr. Neha Desai', 'Dermatology', '9876500004', 6, 'ACTIVE'),

('Dr. Karan Joshi', 'Orthopedics', '9876500005', 15, 'ACTIVE'),
('Dr. Anjali Trivedi', 'Orthopedics', '9876500006', 9, 'INACTIVE');

-- PATIENTS -------------------------------------------------------------------------------------------------------------------------
INSERT INTO PATIENTS
(name, age, gender, phone, blood_group, status)
VALUES
('Amit Patel', 25, 'MALE', '9000000001', 'A+', 'ACTIVE'),
('Riya Shah', 30, 'FEMALE', '9000000002', 'B+', 'ACTIVE'),
('Jay Mehta', 42, 'MALE', '9000000003', 'O+', 'ACTIVE'),
('Krisha Desai', 28, 'FEMALE', '9000000004', 'AB+', 'ACTIVE'),
('Rahul Joshi', 55, 'MALE', '9000000005', 'A-', 'ACTIVE'),

('Priya Shah', 35, 'FEMALE', '9000000006', 'O-', 'ACTIVE'),
('Nikhil Patel', 45, 'MALE', '9000000007', 'B-', 'ACTIVE'),
('Sneha Mehta', 26, 'FEMALE', '9000000008', 'A+', 'ACTIVE'),
('Dhruv Shah', 38, 'MALE', '9000000009', 'AB-', 'ACTIVE'),
('Kavya Patel', 32, 'FEMALE', '9000000010', 'O+', 'ACTIVE'),

('Harsh Desai', 50, 'MALE', '9000000011', 'B+', 'ACTIVE'),
('Mira Joshi', 29, 'FEMALE', '9000000012', 'A-', 'ACTIVE'),
('Parth Shah', 60, 'MALE', '9000000013', 'O+', 'ACTIVE'),
('Diya Mehta', 22, 'FEMALE', '9000000014', 'AB+', 'ACTIVE'),
('Yash Patel', 40, 'MALE', '9000000015', 'B-', 'INACTIVE');

-- APPOITMENTS -----------------------------------------------------------------------------------------------------------------------
INSERT INTO APPOINTMENTS
(patient_id, doctor_id, appointment_date, status, notes)
VALUES

-- August: Historical appointments
(1, 1, CURRENT_DATE - 80 + TIME '09:00', 'COMPLETED', 'Regular heart checkup'),
(2, 2, CURRENT_DATE - 75 + TIME '10:00', 'COMPLETED', 'Chest discomfort'),
(3, 3, CURRENT_DATE - 70 + TIME '11:00', 'COMPLETED', 'Skin allergy'),
(4, 4, CURRENT_DATE - 65 + TIME '12:00', 'CANCELLED', 'Appointment cancelled'),
(5, 5, CURRENT_DATE - 60 + TIME '14:00', 'COMPLETED', 'Knee pain'),

-- September: Historical appointments
(6, 6, CURRENT_DATE - 55 + TIME '09:00', 'COMPLETED', 'Joint pain'),
(4, 1, CURRENT_DATE - 50 + TIME '10:00', 'CANCELLED', 'Patient unavailable'),
(1, 2, CURRENT_DATE - 45 + TIME '11:00', 'COMPLETED', 'Heart consultation'),
(2, 3, CURRENT_DATE - 40 + TIME '12:00', 'CANCELLED', 'Patient cancelled'),
(3, 4, CURRENT_DATE - 35 + TIME '14:00', 'COMPLETED', 'Skin infection'),

-- October: Historical appointments
(4, 5, CURRENT_DATE - 30 + TIME '09:00', 'COMPLETED', 'Back pain'),
(5, 1, CURRENT_DATE - 25 + TIME '10:00', 'CANCELLED', 'Personal reason'),
(6, 2, CURRENT_DATE - 20 + TIME '11:00', 'COMPLETED', 'Heart examination'),
(7, 3, CURRENT_DATE - 15 + TIME '12:00', 'COMPLETED', 'Skin consultation'),
(1, 4, CURRENT_DATE - 10 + TIME '14:00', 'COMPLETED', 'Dermatology follow-up'),

-- Recent appointments
(8, 1, CURRENT_DATE - 2 + TIME '09:00', 'COMPLETED', 'Heart checkup'),
(9, 1, CURRENT_DATE - 1 + TIME '10:00', 'SCHEDULED', 'Regular consultation'),

-- Today's appointments
(10, 1, CURRENT_DATE + TIME '09:00', 'SCHEDULED', 'Heart consultation'),
(11, 2, CURRENT_DATE + TIME '10:00', 'SCHEDULED', 'Cardiology checkup'),
(12, 3, CURRENT_DATE + TIME '11:00', 'SCHEDULED', 'Skin examination');

-- PRESCRIPTIONS----------------------------------------------------------------------------------------------------------------------
INSERT INTO PRESCRIPTIONS
(appointment_id, medicine_name, dosage, duration_days)
VALUES

-- Appointment 1: 1 medicine
(1, 'Paracetamol', '500mg twice daily', 3),

-- Appointment 2: 2 medicines
(2, 'Aspirin', '75mg once daily', 5),
(2, 'Atorvastatin', '10mg once daily', 30),

-- Appointment 3: 3 medicines
(3, 'Cetirizine', '10mg once daily', 5),
(3, 'Calamine Lotion', 'Apply twice daily', 7),
(3, 'Vitamin C', '500mg once daily', 10),

-- Appointment 5: 1 medicine
(5, 'Ibuprofen', '200mg twice daily', 3),

-- Appointment 6: 2 medicines
(6, 'Calcium Carbonate', '500mg once daily', 30),
(6, 'Cholecalciferol', '1000 IU once daily', 30),

-- Appointment 8: 3 medicines
(8, 'Metoprolol', '25mg once daily', 15),
(8, 'Amlodipine', '5mg once daily', 10),
(8, 'Vitamin B Complex', '1 tablet once daily', 15),

-- Appointment 10: 1 medicine
(10, 'Loratadine', '10mg once daily', 5),

-- Appointment 11: 2 medicines
(11, 'Omeprazole', '20mg once daily', 7),
(11, 'Pantoprazole', '40mg once daily', 10),

-- Appointment 13: 3 medicines
(13, 'Losartan', '50mg once daily', 15),
(13, 'Rosuvastatin', '10mg once daily', 10),
(13, 'Clopidogrel', '75mg once daily', 5),

-- Appointment 14: 1 medicine
(14, 'Hydrocortisone Cream', 'Apply twice daily', 7),

-- Appointment 15: 2 medicines
(15, 'Montelukast', '10mg once daily', 10),
(15, 'Levocetirizine', '5mg once daily', 5),

-- Appointment 16: 3 medicines
(16, 'Amoxicillin', '500mg three times daily', 7),
(16, 'Azithromycin', '500mg once daily', 5),
(16, 'Dextromethorphan Syrup', 'As directed', 10);

-- SELECT ALL DATA FROM TABLES.

SELECT * FROM DOCTORS;
SELECT * FROM PATIENTS;
SELECT * FROM APPOINTMENTS;
SELECT * FROM PRESCRIPTIONS;
