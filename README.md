# Forms Mastery

## Introduction

The "Forms Master" project is a web application designed to create and manage customizable forms, similar to Google Forms. Users can create templates for quizzes, tests, and questionnaires, which other users can fill out to gather specific responses. The application also includes social features, allowing users to leave comments and like templates.

## Features

### Create Forms based on Templates

Users can fill out forms based on the created templates, providing specific responses that can be analyzed later by the creator of the template and the admin users.

### User Page Visible for Admin users

Comprehensive user management, with the ability to view, block, unblock, delete users, and manage user roles.

### Access Control

Only admins can manage (add, delete, edit) templates and forms. Template creators can view the answers submitted through their templates but cannot modify them.

### Liking Templates

Users can express appreciation for templates by liking them.

### Commenting System

Users can leave comments on templates, and all users can like or dislike the comments. Also, comment authors can delete or update their comments.

### Tag Cloud Search

It allows users to efficiently find templates using tags.

### Search Feature

Users can search for templates by text. The search checks for matches in the template title, template description, or any question title within the template.

### Internationalization

The app supports both English and Spanish, allowing users to switch between languages.

### Theme Options

Users can choose between dark mode, light mode, or system-based theme, adapting to their preferences or device settings.

### Non-authenticated Access

Non-authenticated users have read-only access to the application, allowing them to search and view templates based on titles, descriptions, or question titles. However, they cannot create templates, leave comments, like or dislike, or fill out forms without being authenticated.

### Google Authentication

Users can sign in or sign up using their Google account, providing a seamless and quick authentication process.

### Drag-and-Drop Functionality

Users can easily rearrange questions within a template by dragging and dropping them into their desired order.

## Question Types and Limits

- **Short Answer**  
  _Description_: Brief response.  
  _Limit_: Up to 4 short answer questions per template.

- **Long Answer**  
  _Description_: Detailed responses.  
  _Limit_: Up to 4 long answer questions per template.

- **Number**  
  _Description_: Numerical response.  
  _Limit_: Up to 4 number questions per template.

- **Checkbox**  
  _Description_: Users can select one or more options from a list of checkboxes, allowing for multiple selections.  
  _Limit_: Up to 4 checkbox questions per template.

- **Multiple Choice**  
  _Description_: Users choose a single option from a list of predetermined answers, ideal for questions where only one answer is correct or preferred.  
  _Limit_: Up to 4 multiple choice questions per template.

### Rating Feature for Question Types

When users opt to rate questions, specific requirements apply for the following question types:

- **Number**: A correct answer must be provided by entering a numerical value in the input field.
- **Checkbox**: The creator must specify which options are correct and at least two options must be provided for this question type.
- **Multiple Choice**: A correct answer must be designated by selecting one answer from the provided options and at least two options must be provided for this question type.

### Tag Cloud Search Feature

- **Tag Representation**: Tags are displayed in a cloud format, where the size of each tag may vary based on the number of templates associated with it.
- **Search Functionality**: Users can click on a tag in the cloud to initiate a search.
- **Tag Assignment**: Tags are assigned during template creation and can be updated when the user manages the template.

## Technologies Used

### Frontend:

- **Next.js**: For building server-side rendered React applications.
- **TypeScript**: Ensures type safety and scalability in the codebase.
- **Shadcn & Tailwind CSS**: Used for styling with a utility-first approach, enabling rapid UI development.
- **React Query**: Manages server state and caching for efficient data fetching.
- **Dnd Kit**: Enables drag-and-drop functionality for managing question order.
- **React-hook-form**: Simplifies form handling and validation.

### Visualization:

- **Recharts**: For creating data visualizations like charts.
- **Visx (Wordcloud)**: Displays tags in a cloud format based on template associations.

### Backend:

- **PostgreSQL**: Relational database for storing form, template, and user data.
- **Prisma**: ORM for database interactions, simplifying queries and migrations.
- **Next Auth**: Provides authentication support, including Google login.

### Validation & Utilities:

- **Zod**: Ensures schema-based validation of inputs.
- **Date-fns**: Utility library for handling and formatting dates.

### Icons:

- **React-icons & Lucide icons**: Used for displaying scalable and customizable icons.

### Internationalization:

- **Next-intl**: Used to allow users to switch between English and Spanish seamlessly.

## Demos

### Non-authenticated User View
https://github.com/user-attachments/assets/9a2f66c3-4b4e-44ee-bc17-3a349fa1b734

### Changing Language and Theme
https://github.com/user-attachments/assets/6031d557-a95b-428b-a3f1-1d55ad91742b

### Like/Dislike Templates and Comments
https://github.com/user-attachments/assets/314f4ade-0787-4a05-9cc1-cc339f4bdd74

### Login and User Management
https://github.com/user-attachments/assets/592bb075-1a0c-41aa-b1ad-532acd663077

### Create a Template
https://github.com/user-attachments/assets/096cacdd-30cd-4fb9-bcee-7e3aae7d4f67

### Submit Form and Update Answers
https://github.com/user-attachments/assets/20cdf6c0-24ae-4127-a8fb-7a3bc4c41daf

### Manage Template
https://github.com/user-attachments/assets/31f9cf40-c97d-447a-9e14-618f9ea12131


## Test Accounts

- **kazi@example.com**
  - Kazi Carter
  - Admin
- **jason@example.com**
  - Jason Bennett
  - Normal user
- **daniel@example.com**
  - Daniel Scott
  - Normal user
- **sophia@example.com**

  - Sophia Brooks
  - Normal user

- **Password**: Example123$
