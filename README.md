# KalooKonek Frontend

Frontend repository for **KalooKonek** – A Web-Based Identification System for Senior Citizens of Caloocan City with Integrated Barangay Information Portal and QR Code Functionality.

---

## Project Overview

KalooKonek is a web-based platform designed to modernize the management of senior citizen records. The system:

- Assigns unique QR codes to senior citizens
- Enables quick verification of records
- Reduces manual paperwork
- Provides a barangay information portal
- Supports role-based dashboards (User, Admin, Medical Professional)

This repository focuses on **Frontend Development** using:

- **React** – UI & interaction
- **Figma** – UI/UX design

---

## Frontend Objectives

The frontend system must:

- Provide a responsive and accessible UI
- Support bilingual interface (English & Filipino)
- Enforce role-based dashboards
- Integrate QR code display & scanning
- Provide clear system feedback and error messages
- Maintain accessibility standards (font resizing, screen reader support)

---

## User Roles & Features

### Senior Citizen (User)

**Authentication**
- Sign In / Sign Out
- Sign Up
- Forgot Password
- Account Settings

**Dashboard Features**
- View personal QR Code
- Call Emergency
- View Announcements
- Set Appointments
- Manage Prescriptions
- Change Font Size
- Bilingual Toggle (EN / FIL)

---

### Administrator

**Authentication**
- Sign In / Sign Out
- Sign Up
- Forgot Password
- Account Settings

**Dashboard Features**
- Verify / Accept / Reject Registrations
- Post Announcements (CRUD)
- Manage Appointments (CRUD)
- View System Logs
- Bilingual Toggle

---

### Medical Professional

**Authentication**
- Sign In / Sign Out
- Sign Up
- Forgot Password
- Account Settings

**Dashboard Features**
- Manage Medical Records (CRUD)
- QR Code Record Access
- Bilingual Toggle

---

## Functional Requirements (Frontend Scope)

| ID | Description |
|----|-------------|
| FR1–FR3 | Authentication UI & Account Settings |
| FR4 | Emergency Call Interface |
| FR5 | Announcement Viewing |
| FR6 | Appointment Scheduling |
| FR7 | Prescription Management UI |
| FR8 | Font Size Adjustment |
| FR12 | Admin Verification Interface |
| FR13–FR14 | CRUD UI for Announcements & Appointments |
| FR18 | Meaningful Error Messages |
| FR19 | Log Viewing Interface |

---

## UI/UX Design Reference

### Design Tools
- Figma

### Design Principles
- Large readable typography (Senior-friendly)
- High contrast color scheme
- Simple navigation
- Minimal cognitive load

---

## Development Team

### Frontend
- Frank Gasta
- Ralf Neis
- Raphael Espiritu

### Backend
- Sean Lucino
- Martin de Leon
