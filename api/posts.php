<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getPost($_GET['id']);
        } else {
            getAllPosts();
        }
        break;
    case 'POST':
        createPost();
        break;
    case 'PUT':
        if (isset($_GET['id'])) {
            updatePost($_GET['id']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Post ID is required']);
        }
        break;
    case 'DELETE':
        if (isset($_GET['id'])) {
            deletePost($_GET['id']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Post ID is required']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

// Get all posts
function getAllPosts() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM posts ORDER BY created_at DESC");
        $stmt->execute();
        $posts = $stmt->fetchAll();
        
        echo json_encode($posts);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch posts: ' . $e->getMessage()]);
    }
}

// Get a single post by ID
function getPost($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        $post = $stmt->fetch();
        
        if (!$post) {
            http_response_code(404);
            echo json_encode(['error' => 'Post not found']);
            return;
        }
        
        echo json_encode($post);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch post: ' . $e->getMessage()]);
    }
}

// Create a new post
function createPost() {
    global $pdo;
    
    $data = getRequestBody();
    
    // Validate input
    $errors = validatePostData($data);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => implode(', ', $errors)]);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO posts (title, content) VALUES (?, ?)");
        $stmt->execute([$data['title'], $data['content']]);
        
        $postId = $pdo->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            'id' => $postId,
            'message' => 'Post created successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create post: ' . $e->getMessage()]);
    }
}

// Update an existing post
function updatePost($id) {
    global $pdo;
    
    $data = getRequestBody();
    
    // Validate input
    $errors = validatePostData($data);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => implode(', ', $errors)]);
        return;
    }
    
    try {
        // Check if post exists
        $checkStmt = $pdo->prepare("SELECT id FROM posts WHERE id = ?");
        $checkStmt->execute([$id]);
        
        if (!$checkStmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Post not found']);
            return;
        }
        
        $stmt = $pdo->prepare("UPDATE posts SET title = ?, content = ? WHERE id = ?");
        $stmt->execute([$data['title'], $data['content'], $id]);
        
        echo json_encode([
            'id' => $id,
            'message' => 'Post updated successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update post: ' . $e->getMessage()]);
    }
}

// Delete a post
function deletePost($id) {
    global $pdo;
    
    try {
        // Check if post exists
        $checkStmt = $pdo->prepare("SELECT id FROM posts WHERE id = ?");
        $checkStmt->execute([$id]);
        
        if (!$checkStmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Post not found']);
            return;
        }
        
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode([
            'message' => 'Post deleted successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete post: ' . $e->getMessage()]);
    }
}
?>

