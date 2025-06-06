from fastapi import FastAPI, Depends, HTTPException, status, Form, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
import json
from datetime import datetime, timedelta

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - in production, specify domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a directory for static files if it doesn't exist
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Mock database - in a real app, this would be a database connection
class InMemoryDB:
    def __init__(self):
        self.users = []
        self.posts = []
        self.comments = []
        self.likes = []
        self.notifications = []
        self.follows = []
        
        # Add some initial users
        self.users = [
            {
                "id": "user1",
                "username": "cosmicwanderer",
                "email": "cosmic@example.com",
                "password": "password123",  # In a real app, this would be hashed
                "display_name": "Cosmic Wanderer",
                "avatar": "/static/avatar1.jpg",
                "bio": "Exploring the digital cosmos ✨",
                "followers": 1024,
                "following": 256,
                "created_at": (datetime.now() - timedelta(days=120)).isoformat()
            },
            {
                "id": "user2",
                "username": "stardust",
                "email": "stardust@example.com",
                "password": "password456",
                "display_name": "Star Dust",
                "avatar": "/static/avatar2.jpg",
                "bio": "Digital artist and night owl 🦉",
                "followers": 3500,
                "following": 420,
                "created_at": (datetime.now() - timedelta(days=90)).isoformat()
            }
        ]
        
        # Add some initial posts
        self.posts = [
            {
                "id": "post1",
                "user_id": "user2",
                "content": "Just finished my latest digital artwork. What do you think? #digitalart #nightwalker",
                "media": [{"type": "image", "url": "/static/post1.jpg"}],
                "created_at": (datetime.now() - timedelta(hours=5)).isoformat()
            },
            {
                "id": "post2",
                "user_id": "user1",
                "content": "The night sky was absolutely breathtaking yesterday. Spent hours just gazing at the stars ✨",
                "media": [{"type": "image", "url": "/static/post2.jpg"}],
                "created_at": (datetime.now() - timedelta(hours=12)).isoformat()
            }
        ]
        
        # Add some initial comments
        self.comments = [
            {
                "id": "comment1",
                "post_id": "post1",
                "user_id": "user1",
                "content": "This is absolutely stunning! The colors are otherworldly.",
                "created_at": (datetime.now() - timedelta(hours=4)).isoformat()
            }
        ]
        
        # Add some initial likes
        self.likes = [
            {"user_id": "user1", "post_id": "post1"},
            {"user_id": "user2", "post_id": "post2"}
        ]
        
        # Add some initial notifications
        self.notifications = [
            {
                "id": "notif1",
                "user_id": "user1",
                "type": "like",
                "source_user_id": "user2",
                "post_id": "post2",
                "read": False,
                "created_at": (datetime.now() - timedelta(hours=2)).isoformat()
            }
        ]
        
        # Add some initial follows
        self.follows = [
            {"follower_id": "user1", "following_id": "user2"},
            {"follower_id": "user2", "following_id": "user1"}
        ]

# Create our in-memory database
db = InMemoryDB()

# Pydantic models for API requests and responses
class User(BaseModel):
    id: str
    username: str
    email: str
    display_name: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    followers: int = 0
    following: int = 0
    created_at: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    display_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None

class Post(BaseModel):
    id: str
    user_id: str
    content: str
    media: Optional[List[dict]] = None
    created_at: str

class PostCreate(BaseModel):
    content: str

class Comment(BaseModel):
    id: str
    post_id: str
    user_id: str
    content: str
    created_at: str

class CommentCreate(BaseModel):
    post_id: str
    content: str

class Notification(BaseModel):
    id: str
    user_id: str
    type: str
    source_user_id: str
    post_id: Optional[str] = None
    comment_id: Optional[str] = None
    read: bool = False
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# Authentication helper
def get_current_user(token: str = None):
    # In a real app, this would validate a JWT token
    # For this demo, we'll just return the first user
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return db.users[0]

# API routes
@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    # Find user by email
    user = next((u for u in db.users if u["email"] == user_data.email), None)
    if not user or user["password"] != user_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # In a real app, generate a JWT token here
    token = "mock-jwt-token"
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": User(**user)
    }

@app.post("/api/auth/signup", response_model=Token)
async def signup(user_data: UserCreate):
    # Check if username or email already exists
    if any(u["username"] == user_data.username for u in db.users):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    if any(u["email"] == user_data.email for u in db.users):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    
    # Create new user
    new_user = {
        "id": f"user{len(db.users) + 1}",
        "username": user_data.username,
        "email": user_data.email,
        "password": user_data.password,  # In a real app, hash the password
        "display_name": user_data.display_name,
        "avatar": None,
        "bio": "",
        "followers": 0,
        "following": 0,
        "created_at": datetime.now().isoformat()
    }
    
    db.users.append(new_user)
    
    # In a real app, generate a JWT token here
    token = "mock-jwt-token"
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": User(**new_user)
    }

@app.get("/api/users/profile", response_model=User)
async def get_profile(current_user = Depends(get_current_user)):
    return User(**current_user)

@app.get("/api/users/{username}", response_model=User)
async def get_user_profile(username: str):
    user = next((u for u in db.users if u["username"] == username), None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return User(**user)

@app.put("/api/users/profile", response_model=User)
async def update_profile(
    user_data: UserUpdate,
    current_user = Depends(get_current_user)
):
    # Find the current user in the database
    user_index = next((i for i, u in enumerate(db.users) if u["id"] == current_user["id"]), None)
    
    # Update user data
    if user_data.display_name:
        db.users[user_index]["display_name"] = user_data.display_name
    if user_data.bio:
        db.users[user_index]["bio"] = user_data.bio
    if user_data.email:
        db.users[user_index]["email"] = user_data.email
    
    return User(**db.users[user_index])

@app.post("/api/posts", response_model=Post)
async def create_post(
    content: str = Form(...),
    media: List[UploadFile] = File(None),
    current_user = Depends(get_current_user)
):
    post_id = f"post{len(db.posts) + 1}"
    media_urls = []
    
    # In a real app, save uploaded media to a storage service
    if media:
        for i, file in enumerate(media):
            # Create a file path
            file_path = f"/static/{post_id}_media_{i}{os.path.splitext(file.filename)[1]}"
            
            # Save file to disk
            with open(f".{file_path}", "wb") as f:
                f.write(await file.read())
            
            # Add to media urls
            media_type = "image" if file.content_type.startswith("image") else "video"
            media_urls.append({"type": media_type, "url": file_path})
    
    # Create new post
    new_post = {
        "id": post_id,
        "user_id": current_user["id"],
        "content": content,
        "media": media_urls,
        "created_at": datetime.now().isoformat()
    }
    
    db.posts.append(new_post)
    
    return Post(**new_post)

@app.get("/api/posts/feed", response_model=List[Post])
async def get_feed_posts(current_user = Depends(get_current_user)):
    # In a real app, fetch posts from users that the current user follows
    # For demo purposes, return all posts
    return [Post(**post) for post in db.posts]

@app.get("/api/posts/{post_id}", response_model=Post)
async def get_post(post_id: str):
    post = next((p for p in db.posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return Post(**post)

@app.get("/api/users/{user_id}/posts", response_model=List[Post])
async def get_user_posts(user_id: str):
    return [Post(**post) for post in db.posts if post["user_id"] == user_id]

@app.post("/api/posts/{post_id}/like")
async def like_post(post_id: str, current_user = Depends(get_current_user)):
    # Check if post exists
    post = next((p for p in db.posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user already liked the post
    if any(like["user_id"] == current_user["id"] and like["post_id"] == post_id for like in db.likes):
        return {"message": "Post already liked"}
    
    # Add like
    db.likes.append({"user_id": current_user["id"], "post_id": post_id})
    
    # Create notification
    if post["user_id"] != current_user["id"]:
        notification = {
            "id": f"notif{len(db.notifications) + 1}",
            "user_id": post["user_id"],
            "type": "like",
            "source_user_id": current_user["id"],
            "post_id": post_id,
            "read": False,
            "created_at": datetime.now().isoformat()
        }
        db.notifications.append(notification)
    
    return {"message": "Post liked successfully"}

@app.delete("/api/posts/{post_id}/like")
async def unlike_post(post_id: str, current_user = Depends(get_current_user)):
    # Remove like if it exists
    like_index = next((i for i, like in enumerate(db.likes) if 
                      like["user_id"] == current_user["id"] and like["post_id"] == post_id), None)
    
    if like_index is not None:
        db.likes.pop(like_index)
    
    return {"message": "Post unliked successfully"}

@app.post("/api/posts/{post_id}/comments", response_model=Comment)
async def create_comment(
    post_id: str,
    comment_data: CommentCreate,
    current_user = Depends(get_current_user)
):
    # Check if post exists
    post = next((p for p in db.posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Create new comment
    new_comment = {
        "id": f"comment{len(db.comments) + 1}",
        "post_id": post_id,
        "user_id": current_user["id"],
        "content": comment_data.content,
        "created_at": datetime.now().isoformat()
    }
    
    db.comments.append(new_comment)
    
    # Create notification
    if post["user_id"] != current_user["id"]:
        notification = {
            "id": f"notif{len(db.notifications) + 1}",
            "user_id": post["user_id"],
            "type": "comment",
            "source_user_id": current_user["id"],
            "post_id": post_id,
            "comment_id": new_comment["id"],
            "read": False,
            "created_at": datetime.now().isoformat()
        }
        db.notifications.append(notification)
    
    return Comment(**new_comment)

@app.get("/api/posts/{post_id}/comments", response_model=List[Comment])
async def get_comments(post_id: str):
    return [Comment(**comment) for comment in db.comments if comment["post_id"] == post_id]

@app.get("/api/notifications", response_model=List[Notification])
async def get_notifications(current_user = Depends(get_current_user)):
    return [Notification(**notification) for notification in db.notifications 
            if notification["user_id"] == current_user["id"]]

@app.put("/api/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user = Depends(get_current_user)
):
    # Find notification
    notification = next((n for n in db.notifications if n["id"] == notification_id), None)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    # Check if notification belongs to current user
    if notification["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this notification"
        )
    
    # Mark as read
    notification_index = next(i for i, n in enumerate(db.notifications) if n["id"] == notification_id)
    db.notifications[notification_index]["read"] = True
    
    return {"message": "Notification marked as read"}

@app.get("/api/search/users")
async def search_users(query: str):
    if not query or len(query) < 2:
        return []
    
    # Search users by username or display name
    results = []
    for user in db.users:
        if (query.lower() in user["username"].lower() or 
            query.lower() in user["display_name"].lower()):
            results.append(User(**user))
    
    return results

@app.get("/api/search/posts")
async def search_posts(query: str):
    if not query or len(query) < 2:
        return []
    
    # Search posts by content
    results = []
    for post in db.posts:
        if query.lower() in post["content"].lower():
            results.append(Post(**post))
    
    return results

# Root route to ensure the API is working
@app.get("/")
async def root():
    return {"message": "Night Walker Social API is running"}