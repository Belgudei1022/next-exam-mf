export interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    tags?: string[];
    comments: Comment[];
  }
  
  export interface Comment {
    id: string;
    text: string;
    createdAt: string;
    postId: string;
    authorId: string;
  }
  export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: string | null;
    image: "string";
  }
  