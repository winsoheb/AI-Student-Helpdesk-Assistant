# Chapter 1: Introduction

## 1.1 Background
Educational institutions generate vast amounts of operational and academic information. Students often struggle to find answers to routine questions, leading to administrative overhead.

## 1.2 Problem Statement
Information is distributed across notice boards, disparate documents, and departments. Finding academic information is time-consuming, resulting in repeated queries to the administration.

## 1.3 Project Objectives
- Centralize academic information (timetables, assignments, announcements).
- Provide a Student Self-Service Portal.
- Implement an AI-based chatbot using NLP techniques (TF-IDF) to extract answers from uploaded PDFs and DOCX files.
- Deliver an Administrative Dashboard for real-time analytics.

## 1.4 Project Scope
The project covers Admin capabilities (managing students, subjects, materials, etc.) and Student capabilities (interacting with the AI, viewing timetables/assignments). It operates offline using a local database and ML libraries, strictly adhering to zero-internet-dependency rules.

## 1.5 Limitations
- The AI relies on Extractive QA (TF-IDF), so it extracts verbatim text rather than generating new contextual sentences (LLM).
- Scalability is bounded by SQLite capabilities.

# Chapter 2: Existing and Proposed System

## 2.1 Existing System
- Manual student enquiry handling.
- Information distributed across notices, documents, and departments.
- Repeated questions to college administration.

## 2.2 Proposed System
- **Centralized Academic Information:** A single digital repository for college data.
- **Student Self-Service Portal:** View profiles, timetables, and assignments.
- **AI-based Question Answering:** An offline chatbot that parses college-uploaded study materials to answer queries instantly.
- **Administrative Information Management:** A Next.js dashboard for admins (including Faculty and Announcement management).
- **Dynamic Theming Engine:** A robust Light/Dark mode and accent color system customizable per user.