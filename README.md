# Purchase Request System (PRS) - Angular & TypeScript

The **Purchase Request System (PRS)** allows employees to submit purchase requests for products needed in their work. Similar to an e-commerce cart, users can add products to their request, then submit it for approval.

A user with **admin** privileges has full access to the database.  A user with **reviewer** privileges can view all submitted requests and approve or reject them after review.  A **user** with no extra privileges can create and manage their own requests, but cannot view or modify requests submitted by others.

The system supports full **CRUD** functionality for all main data models.

---

## Overview

The PRS project is built using the Angular framework with TypeScript and communicates with a RESTful backend API.

### Key Technical Features

1. **Single Page Application (SPA)**: Built using Angular routing and component-based architecture.
2. **Consistent UI/UX**: Maintains a uniform and responsive design.
3. **Modular Codebase**: Follows best practices, coding standards, and object model conventions.
4. **GitHub Deployment**: Project is version-controlled and published to GitHub.
5. **Adheres to Object Model**: Design is based on object-oriented principles, ensuring clear relationships between entities.

---

## Structure

### Core Entities:

* `User`: Represents employees (with or without reviewer/admin roles).
* `Request`: A purchase request containing metadata and total.
* `Product`: The items available for purchase.
* `LineItem`: Represents a quantity of a selected product in a request.

### Component Structure (Angular):

* `request-list`
* `request-create`
* `request-edit`
* `request-lines`
* `line-item-create`
* `line-item-edit`
* `user-login`

---

## Features and Functionality

### CRUD Operations

Each of the main models supports:

* **Get All** records
* **Get By ID**
* **Insert** (Create)
* **Update**
* **Delete**

### Additional Requirements

* Submit request for review
* Approve or reject requests (reviewer only)
* Dynamic calculation of request total based on line items

---
