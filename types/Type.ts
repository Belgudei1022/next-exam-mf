export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: string | null;
  image?: string | null;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  tags?: string[];
  createdAt: string;
  userId: string;
  categoryId: string;
  likes: string[];
  comments: Comment[];
  user?: {
    id: string;
    name: string;
    image?: string | null;
  };
  category?: {
    id: string;
    name: string;
  };
}
