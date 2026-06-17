# FolioGo – Build Your Future Portfolio

## Project Overview

PortfolioGo is a SaaS platform that enables students and fresh graduates to create professional portfolio websites within minutes without coding knowledge.

The primary goal is to help students secure internships and entry-level jobs by providing a polished online presence.

Target audience:

* University students
* Internship seekers
* Fresh graduates
* Bootcamp students

Core value proposition:

"Build an internship-ready portfolio in under 5 minutes."

---

# User Roles

## Student User

Can:

* Create account
* Build portfolio
* Edit portfolio
* Upload resume
* Publish portfolio
* View analytics

## Admin

Can:

* Manage users
* Manage subscriptions
* View platform analytics
* Manage themes

---

# Main User Journey

1. User signs up
2. User completes onboarding
3. User enters personal information
4. User uploads resume
5. User adds projects
6. User selects portfolio theme
7. User publishes portfolio
8. User shares portfolio link with recruiters

---

# Application Pages

## Landing Page

Purpose:

* Explain product
* Showcase templates
* Drive signups

Sections:

* Hero Section
* Features
* Portfolio Examples
* Testimonials
* Pricing
* FAQ
* Call To Action

---

## Authentication

Pages:

* Login
* Register
* Forgot Password

Authentication:

* Email/Password
* Google Login

---

## Onboarding Wizard

Step 1:
Personal Information

Fields:

* Full Name
* Professional Title
* University
* Degree Program
* Graduation Year
* Location

Step 2:
Skills

Fields:

* Technical Skills
* Soft Skills

Step 3:
Resume Upload

Accepted:

* PDF

Step 4:
Portfolio Theme Selection

Themes:

* Minimal
* Professional
* Modern
* Creative

---

## Dashboard

Sections:

### Portfolio Completion

Display:

* Completion Percentage

### Quick Actions

Buttons:

* Edit Portfolio
* Upload Resume
* Add Project
* Publish Portfolio

### Portfolio Analytics

Display:

* Total Views
* Unique Visitors
* Resume Downloads

---

## Portfolio Editor

Editable Sections:

### About Me

Fields:

* Bio
* Profile Photo

### Education

Fields:

* Institution
* Program
* Duration
* Description

### Experience

Fields:

* Company
* Position
* Start Date
* End Date
* Description

### Projects

Fields:

* Project Name
* Description
* Technologies
* GitHub URL
* Live Demo URL
* Screenshot

### Certifications

Fields:

* Certificate Name
* Issuer
* Date

### Skills

Categories:

* Programming
* Design
* Marketing
* Other

### Contact

Fields:

* Email
* LinkedIn
* GitHub
* Portfolio Links

---

## Portfolio Preview

Features:

* Desktop Preview
* Tablet Preview
* Mobile Preview

Actions:

* Publish
* Save Draft

---

## Public Portfolio

URL Example:

portfoliogo.com/username

Contains:

* Hero Section
* About
* Skills
* Projects
* Experience
* Education
* Certifications
* Contact

---

# AI Features

## Resume Parser

Input:

* Resume PDF

Output:

* Auto-fill profile information
* Auto-fill education
* Auto-fill experience
* Auto-fill skills

---

## AI Project Description Generator

Input:
Short project summary

Output:
Professional project description

Example:

Input:
Built Java voting system

Output:
Developed a Java-based voting management system utilizing Object-Oriented Programming principles for candidate registration, vote processing, and automated result generation.

---

## AI Portfolio Review

Generate:

* Portfolio score
* Missing sections
* Improvement recommendations

Score Range:
0-100

---

# Pricing Model

## Free Plan

Features:

* One Portfolio
* Basic Theme
* Portfolio Hosting

---

## Premium Plan

Features:

* Multiple Themes
* Custom Domain
* Analytics
* AI Portfolio Review
* Resume Parsing

Price:
RM9/month

---

# Database Structure

Users

* id
* name
* email
* password
* plan
* created_at

Profiles

* id
* user_id
* bio
* university
* degree
* graduation_year

Projects

* id
* user_id
* title
* description
* technologies
* github_url
* live_url

Skills

* id
* user_id
* skill_name
* category

Experience

* id
* user_id
* company
* role
* description

Education

* id
* user_id
* institution
* degree

Analytics

* id
* portfolio_id
* views
* unique_visitors

---

# Technical Stack

Frontend:

* Next.js
* TypeScript
* TailwindCSS

Backend:

* Supabase

Authentication:

* Supabase Auth

Storage:

* Supabase Storage

Deployment:

* Vercel

Payments:

* Stripe
* ToyyibPay

---

# Future Features

Version 2:

* Custom Domain Support
* Portfolio Templates Marketplace
* Recruiter Dashboard
* Portfolio Ranking
* Internship Matching

Version 3:

* AI Resume Builder
* AI Cover Letter Generator
* AI Interview Coach
* AI Career Advisor
