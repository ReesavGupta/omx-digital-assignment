### Simple Blog System

A lightweight blog system with a PHP backend and HTML/CSS/JS frontend. This project provides a complete solution for creating, reading, updating, and deleting blog posts with a clean, responsive interface.

## Features

- **Complete CRUD Operations**: Create, read, update, and delete blog posts
- **RESTful API**: Backend built with plain PHP following RESTful principles
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean UI**: Simple and intuitive user interface
- **Security**: SQL injection prevention with prepared statements
- **Input Validation**: Validates all user inputs
- **Error Handling**: Graceful error handling on both frontend and backend

## Technologies Used

- **Backend**: Plain PHP, MySQL
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Architecture**: RESTful API

## Installation

### Prerequisites

- PHP 7.0 or higher
- MySQL 5.6 or higher
- Web server (Apache, Nginx, etc.)

### Setup Instructions

1. **Clone the repository**

```shellscript
git clone https://github.com/yourusername/simple-blog-system.git
cd simple-blog-system
```

2. **Database Setup**

1. Create a MySQL database named `blog_system`
1. Update the database credentials in `api/config.php`:

```php
$host = 'localhost';
$dbname = 'blog_system';
$username = 'your_username'; // Change to your MySQL username
$password = 'your_password'; // Change to your MySQL password
```

3. Run the setup script by visiting `http://your-server/api/setup.php` in your browser

4. **Server Configuration**

5. Place all files in your web server's document root or a subdirectory
6. Ensure the web server has write permissions to the `api` directory
7. If you're using Apache, the included `.htaccess` file will handle PUT and DELETE requests
8. For Nginx, you'll need to configure it to handle these HTTP methods

## Usage

1. **View Blog Posts**

1. Navigate to the homepage to see all blog posts
1. Click on a post to view its full content

1. **Create a New Post**

1. Click the "New Post" button
1. Fill in the title and content
1. Click "Save Post"

1. **Edit a Post**

1. View a post and click the "Edit" button
1. Modify the title and/or content
1. Click "Save Post"

1. **Delete a Post**

1. View a post and click the "Delete" button
1. Confirm the deletion

## API Documentation

The backend provides the following RESTful endpoints:

| Endpoint              | Method | Description       | Parameters                                          |
| --------------------- | ------ | ----------------- | --------------------------------------------------- |
| `/api/posts.php`      | GET    | Get all posts     | None                                                |
| `/api/posts.php?id=X` | GET    | Get a single post | `id`: Post ID                                       |
| `/api/posts.php`      | POST   | Create a new post | JSON body with `title` and `content`                |
| `/api/posts.php?id=X` | PUT    | Update a post     | `id`: Post ID, JSON body with `title` and `content` |
| `/api/posts.php?id=X` | DELETE | Delete a post     | `id`: Post ID                                       |

### Example Requests

**Create a post:**

```shellscript
curl -X POST http://your-server/api/posts.php \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Post","content":"This is the content of my first post."}'
```

**Update a post:**

```shellscript
curl -X PUT http://your-server/api/posts.php?id=1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","content":"Updated content."}'
```

**Delete a post:**

```shellscript
curl -X DELETE http://your-server/api/posts.php?id=1
```

## File Structure

```plaintext
simple-blog-system/
├── api/
│   ├── .htaccess           # Apache configuration for HTTP methods
│   ├── config.php          # Database connection and utilities
│   ├── posts.php           # API endpoints for blog posts
│   └── setup.php           # Database setup script
├── css/
│   └── style.css           # Styles for the frontend
├── js/
│   └── script.js           # Frontend JavaScript
├── index.html              # Main HTML file
└── README.md               # This file
```
